'use client';
// One place for store funnel events. Sends to Vercel Web Analytics, and to an ad pixel
// (Meta fbq, TikTok ttq, Google gtag) when one is on the page, using each one's standard event name.
import { track as vercelTrack } from '@vercel/analytics';

const STANDARD = {
  add_to_cart: { fb: 'AddToCart', tt: 'AddToCart', ga: 'add_to_cart' },
  view_cart: { fb: 'ViewContent', tt: 'ViewContent', ga: 'view_cart' },
  begin_checkout: { fb: 'InitiateCheckout', tt: 'InitiateCheckout', ga: 'begin_checkout' },
  purchase: { fb: 'Purchase', tt: 'CompletePayment', ga: 'purchase' },
};

/** track('add_to_cart', { products: ['modfx-pro'], value: 25 }) */
export function track(name, { products = [], value, from } = {}) {
  const list = Array.isArray(products) ? products : [products];
  try { vercelTrack(name, { products: list.join(','), value: value ?? null, from: from ?? null }); } catch {}
  if (typeof window === 'undefined') return;
  const s = STANDARD[name];
  const money = value != null ? { value, currency: 'USD' } : {};
  try { if (s && window.fbq) window.fbq('track', s.fb, { content_ids: list, content_type: 'product', ...money }); } catch {}
  try { if (s && window.ttq) window.ttq.track(s.tt, { contents: list.map((id) => ({ content_id: id })), ...money }); } catch {}
  try { if (s && window.gtag) window.gtag('event', s.ga, { items: list.map((id) => ({ item_id: id })), ...money }); } catch {}
}
