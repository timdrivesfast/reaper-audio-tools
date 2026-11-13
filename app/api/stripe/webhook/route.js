import { notifyOrder, notifyRefund, notifyPartialRefund } from '../../../../lib/server/notify';
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/server/supabase';
import { verifyStripeSignature } from '../../../../lib/server/stripe';
import { generateLicenseKey, maxActivations } from '../../../../lib/server/license';
import { sendLicenseEmail } from '../../../../lib/server/email';
import { products } from '../../../../lib/site';
import { sessionSlugs } from '../../../../lib/server/checkout';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Stripe → Developers → Webhooks → Add endpoint: https://www.reaperaudiotools.com/api/stripe/webhook
// Events: checkout.session.completed, checkout.session.async_payment_succeeded,
// checkout.session.async_payment_failed, charge.refunded, charge.dispute.created. Copy the signing secret (whsec_…) into STRIPE_WEBHOOK_SECRET.
export async function POST(request) {
  const raw = await request.text();
  if (!verifyStripeSignature(raw, request.headers.get('stripe-signature'), process.env.STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json({ error: 'Bad signature.' }, { status: 400 });
  }
  const event = JSON.parse(raw);
  const supabase = db();
  const { data: seen } = await supabase.from('stripe_events').select('event_id').eq('event_id', event.id).maybeSingle();
  if (seen) return NextResponse.json({ ok: true, duplicate: true });

  try {
    const obj = event.data?.object || {};
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      if (obj.payment_status === 'paid') await issueLicenses(supabase, obj);
    } else if (event.type === 'checkout.session.async_payment_failed') {
      console.warn('[stripe webhook] delayed payment failed, no license issued', obj.id);
    } else if (event.type === 'charge.refunded') {
      // A full refund revokes every license in the order. A partial one (one plugin of a cart order)
      // can't say which plugin, so it's flagged in #orders to revoke by hand.
      if (obj.refunded) await revoke(supabase, obj.payment_intent, 'refund');
      else await notifyPartialRefund({ amount: obj.amount_refunded != null ? (obj.amount_refunded / 100).toFixed(2) : undefined, paymentIntent: obj.payment_intent });
    } else if (event.type === 'charge.dispute.created') {
      await revoke(supabase, obj.payment_intent, 'chargeback');
    }
  } catch (err) {
    console.error('[stripe webhook]', event.type, event.id, err);
    return NextResponse.json({ error: 'Handler failed.' }, { status: 500 }); // Stripe retries
  }
  await supabase.from('stripe_events').insert({ event_id: event.id, event_type: event.type });
  return NextResponse.json({ ok: true });
}

/** One license per plugin in the order: a cart order can hold several. */
async function issueLicenses(supabase, session) {
  const slugs = sessionSlugs(session.metadata);
  if (!slugs.length) throw new Error(`Session ${session.id} has no known product (${session.metadata?.products || session.metadata?.product}).`);
  const email = session.customer_details?.email || session.customer_email;
  if (!email) throw new Error(`Session ${session.id} has no customer email.`);
  const name = session.customer_details?.name || null;
  for (const product of slugs) await issueOne(supabase, session, { product, email, name, order: slugs.length });
}

async function issueOne(supabase, session, { product, email, name, order }) {
  const { data: existing } = await supabase.from('licenses').select('id').eq('stripe_session_id', session.id).eq('product', product).maybeSingle();
  if (existing) return;
  const key = generateLicenseKey();
  const { error } = await supabase.from('licenses').insert({
    key, product, email: email.toLowerCase(), customer_name: name,
    stripe_session_id: session.id, stripe_payment_intent: session.payment_intent || null,
    max_activations: maxActivations(),
  });
  if (error && error.code === '23505') return; // a retry beat us to it
  if (error) throw error;
  await sendLicenseEmail({ to: email, name, product, key });
  const { count } = await supabase.from('licenses').select('id', { count: 'exact', head: true }).eq('product', product).not('stripe_session_id', 'is', null);
  // One plugin: the order total. Several: that plugin's list price.
  const amount = order === 1 && session.amount_total != null ? (session.amount_total / 100).toFixed(2).replace(/\.00$/, '') : products[product]?.price;
  await notifyOrder({ product, email, paid: true, amount, total: count, cart: order > 1 ? order : undefined });
}

async function revoke(supabase, paymentIntent, reason) {
  if (!paymentIntent) return;
  const { data, error } = await supabase.from('licenses').update({ status: 'revoked', revoked_reason: reason }).eq('stripe_payment_intent', paymentIntent).select('id');
  if (error) throw error;
  if (data?.length) await notifyRefund({ reason, count: data.length });
}
