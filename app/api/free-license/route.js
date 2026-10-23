import { NextResponse } from 'next/server';
import { db } from '../../../lib/server/supabase';
import { generateLicenseKey, maxActivations } from '../../../lib/server/license';
import { sendLicenseEmail } from '../../../lib/server/email';
import { products } from '../../../lib/site';
import { allowEmailSend, clientIp, TOO_MANY } from '../../../lib/server/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Free plugins: POST { email, product } → emails a license key and download links.
 * One license per email per product. Asking again resends the same key.
 * If WAITLIST_WEBHOOK_URL is set, the address is also forwarded there (list "<product>-free").
 */
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Send JSON with an email.' }, { status: 400 }); }
  const email = String(body?.email || '').trim().toLowerCase();
  const product = String(body?.product || '').toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'That email address looks wrong.' }, { status: 400 });
  }
  if (!products[product] || !products[product].free) {
    return NextResponse.json({ error: 'That plugin is not free.' }, { status: 400 });
  }

  let supabase;
  try { supabase = db(); } catch (err) {
    console.error('[free-license] db', err);
    return NextResponse.json({ error: "Downloads aren't set up yet. Try again later." }, { status: 503 });
  }
  if (!(await allowEmailSend({ kind: 'free-license', email, ip: clientIp(request) }))) {
    return NextResponse.json({ error: TOO_MANY }, { status: 429 });
  }
  const { data: existing } = await supabase.from('licenses').select('key')
    .eq('product', product).eq('status', 'active').eq('email', email).limit(1).maybeSingle();

  let key = existing?.key;
  if (!key) {
    key = generateLicenseKey();
    const { error } = await supabase.from('licenses').insert({ key, product, email, max_activations: maxActivations() });
    if (error) {
      console.error('[free-license] insert', error);
      return NextResponse.json({ error: "That didn't go through. Try again in a minute." }, { status: 500 });
    }
  }

  try {
    await sendLicenseEmail({ to: email, product, key });
  } catch (err) {
    console.error('[free-license] email', err);
    return NextResponse.json({ error: "We couldn't send the email. Try again in a minute." }, { status: 502 });
  }

  const hook = process.env.WAITLIST_WEBHOOK_URL;
  if (hook) {
    fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, list: `${product}-free`, signedUpAt: new Date().toISOString() }) })
      .catch((err) => console.error('[free-license] list', err));
  }
  return NextResponse.json({ ok: true });
}
