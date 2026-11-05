import { NextResponse } from 'next/server';
import { stripe, priceIdFor } from '../../../lib/server/stripe';
import { products, site } from '../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST { product } -> { url } of a Stripe Checkout page for that plugin.
 * Uses Managed Payments (Stripe as merchant of record: sales tax and VAT handled)
 * unless STRIPE_MANAGED_PAYMENTS=false.
 */
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const slug = String(body?.product || '').toLowerCase();
  const p = products[slug];
  if (!p || p.free || p.status !== 'available') return NextResponse.json({ error: "That plugin isn't for sale." }, { status: 400 });
  const price = priceIdFor(slug);
  if (!process.env.STRIPE_SECRET_KEY || !price) {
    return NextResponse.json({ error: "Checkout isn't connected yet. Email us and we'll sort you out." }, { status: 503 });
  }
  try {
    const session = await stripe('POST', '/checkout/sessions', {
      mode: 'payment',
      line_items: [{ price, quantity: 1 }],
      managed_payments: process.env.STRIPE_MANAGED_PAYMENTS === 'false' ? undefined : { enabled: true },
      success_url: `${site.url}/thanks?plugin=${encodeURIComponent(slug)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/plugins/${slug}`,
      metadata: { product: slug },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout]', err.message);
    return NextResponse.json({ error: "Couldn't start checkout. Try again in a minute." }, { status: 502 });
  }
}
