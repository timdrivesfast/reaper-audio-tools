// Pure helpers for cart checkout, shared by the checkout route, the webhook and the tests.
import { products } from '../site.js';

export const MAX_CART = 10;

/** Plugins a checkout may sell: paid, on sale, known. Dedupes and keeps order. */
export function cartSlugs(input) {
  const list = Array.isArray(input) ? input : input ? [input] : [];
  const out = [];
  for (const raw of list) {
    const slug = String(raw || '').toLowerCase().trim();
    const p = products[slug];
    if (!p || p.free || p.status !== 'available' || out.includes(slug)) continue;
    out.push(slug);
  }
  return out.slice(0, MAX_CART);
}

/** Plugins an order paid for, from the session's metadata. Older sessions only have `product`. */
export function sessionSlugs(metadata = {}) {
  const raw = metadata.products ? String(metadata.products).split(',') : [metadata.product];
  return raw.map((s) => String(s || '').trim()).filter((s) => products[s]);
}

/** The Checkout Session body for a list of plugins and their Stripe price IDs. */
export function checkoutParams({ slugs, prices, siteUrl, managed = true, from }) {
  const one = slugs.length === 1;
  return {
    mode: 'payment',
    line_items: slugs.map((s) => ({ price: prices[s], quantity: 1 })),
    managed_payments: managed ? { enabled: true } : undefined,
    success_url: `${siteUrl}/thanks?plugin=${encodeURIComponent(slugs.join(','))}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: one && from !== 'cart' ? `${siteUrl}/plugins/${slugs[0]}` : `${siteUrl}/?cart=open`,
    metadata: { products: slugs.join(','), ...(one ? { product: slugs[0] } : {}), from: from === 'cart' ? 'cart' : 'buy_now' },
    integration_identifier: 'rat-store-qkvmbzrt',
  };
}
