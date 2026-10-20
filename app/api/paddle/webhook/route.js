import { NextResponse } from 'next/server';
import { db } from '../../../../lib/server/supabase';
import { verifyPaddleSignature, getPaddleCustomer } from '../../../../lib/server/paddle';
import { generateLicenseKey, productForPriceId, maxActivations } from '../../../../lib/server/license';
import { sendLicenseEmail } from '../../../../lib/server/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Paddle → Notifications → New destination: URL https://<your site>/api/paddle/webhook,
// events transaction.completed, adjustment.created and adjustment.updated.
// Copy its secret key into PADDLE_WEBHOOK_SECRET.

export async function POST(request) {
  const raw = await request.text();
  if (!verifyPaddleSignature(raw, request.headers.get('paddle-signature'), process.env.PADDLE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Bad signature' }, { status: 401 });
  }
  const event = JSON.parse(raw);
  const supabase = db();

  const { data: seen } = await supabase.from('paddle_events').select('event_id').eq('event_id', event.event_id).maybeSingle();
  if (seen) return NextResponse.json({ ok: true, duplicate: true });

  try {
    if (event.event_type === 'transaction.completed') await issueLicenses(supabase, event.data);
    if (event.event_type === 'adjustment.created' || event.event_type === 'adjustment.updated') await handleAdjustment(supabase, event.data);
  } catch (err) {
    console.error('[paddle webhook]', event.event_type, event.event_id, err);
    // A non-2xx makes Paddle retry later.
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }

  await supabase.from('paddle_events').insert({ event_id: event.event_id, event_type: event.event_type });
  return NextResponse.json({ ok: true });
}

async function issueLicenses(supabase, txn) {
  const products = [...new Set((txn.items || []).map((i) => productForPriceId(i.price?.id || i.price_id)).filter(Boolean))];
  if (!products.length) return;
  const customer = await getPaddleCustomer(txn.customer_id);

  for (const product of products) {
    const { data: existing } = await supabase.from('licenses').select('id').eq('paddle_transaction_id', txn.id).eq('product', product).maybeSingle();
    if (existing) continue;

    const key = generateLicenseKey();
    const { error } = await supabase.from('licenses').insert({
      key,
      product,
      email: customer.email,
      customer_name: customer.name,
      paddle_transaction_id: txn.id,
      paddle_customer_id: txn.customer_id,
      max_activations: maxActivations(),
    });
    if (error && error.code === '23505') continue; // a retry beat us to it
    if (error) throw error;

    await sendLicenseEmail({ to: customer.email, name: customer.name, product, key });
  }
}

async function handleAdjustment(supabase, adj) {
  if (adj.action !== 'refund' && adj.action !== 'chargeback') return;
  if (adj.status !== 'approved' && adj.action !== 'chargeback') return;
  const { error } = await supabase
    .from('licenses')
    .update({ status: 'revoked', revoked_reason: adj.action })
    .eq('paddle_transaction_id', adj.transaction_id);
  if (error) throw error;
}
