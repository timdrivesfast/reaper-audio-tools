import { NextResponse } from 'next/server';
import { stripe, priceIdFor } from '../../../lib/server/stripe';
import { cartSlugs, checkoutParams } from '../../../lib/server/checkout';
import { site } from '../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST { products: [slug, …], from: 'cart' | 'buy_now' } (or the older { product: slug })
 * -> { url } of a Stripe Checkout page with one line per plugin.
 * Uses Managed Payments (Stripe as merchant of record: sales tax and VAT handled)
 * unless STRIPE_MANAGED_PAYMENTS=false.
 */
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const slugs = cartSlugs(body?.products ?? body?.product);
  if (!slugs.length) return NextResponse.json({ error: "That plugin isn't for sale." }, { status: 400 });
  const prices = Object.fromEntries(slugs.map((s) => [s, priceIdFor(s)]));
  if (!process.env.STRIPE_SECRET_KEY || slugs.some((s) => !prices[s])) {
    return NextResponse.json({ error: "Checkout isn't connected yet. Email us and we'll sort you out." }, { status: 503 });
  }
  try {
    const session = await stripe('POST', '/checkout/sessions', checkoutParams({
      slugs, prices, siteUrl: site.url, managed: process.env.STRIPE_MANAGED_PAYMENTS !== 'false', from: body?.from,
    }));
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout]', err.message);
    return NextResponse.json({ error: "Couldn't start checkout. Try again in a minute." }, { status: 502 });
  }
}
