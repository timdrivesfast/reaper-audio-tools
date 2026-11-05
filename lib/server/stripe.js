// Server code only (reads STRIPE_SECRET_KEY).
import crypto from 'node:crypto';

// Stripe over plain REST (no SDK). Needs STRIPE_SECRET_KEY.
const API = (process.env.STRIPE_API_URL || 'https://api.stripe.com') + '/v1';
export const STRIPE_VERSION = '2026-04-22.dahlia';

/** Flattens { a: { b: 1 }, c: [ { d: 2 } ] } into Stripe's form encoding: a[b]=1&c[0][d]=2. */
export function formEncode(obj, prefix = '', out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') formEncode(Array.isArray(v) ? Object.fromEntries(v.map((x, i) => [i, x])) : v, key, out);
    else out.append(key, String(v));
  }
  return out;
}

export async function stripe(method, path, params) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set.');
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Stripe-Version': STRIPE_VERSION, ...(params ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) },
    body: params ? formEncode(params).toString() : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Stripe ${method} ${path} failed: ${res.status} ${data?.error?.message || ''}`.trim());
  return data;
}

/**
 * Checks a webhook's Stripe-Signature header: "t=1492774577,v1=5257a8…".
 * Stripe signs "<t>.<raw body>" with HMAC-SHA256 using the endpoint's signing secret (whsec_…).
 */
export function verifyStripeSignature(rawBody, header, secret, { toleranceSeconds = 300, now = Date.now() } = {}) {
  if (!header || !secret) return false;
  const v1 = [];
  let t = null;
  for (const item of String(header).split(',')) {
    const [k, v] = item.split('=');
    if (k === 't') t = v;
    if (k === 'v1' && v) v1.push(v);
  }
  if (!t || !v1.length || !/^\d+$/.test(t)) return false;
  if (Math.abs(now / 1000 - Number(t)) > toleranceSeconds) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${t}.${rawBody}`, 'utf8').digest();
  return v1.some((sig) => {
    const got = Buffer.from(sig, 'hex');
    return got.length === expected.length && crypto.timingSafeEqual(got, expected);
  });
}

/** Stripe price ID for a product, from STRIPE_PRICE_<SLUG> (e.g. STRIPE_PRICE_MODFX_PRO). */
export function priceIdFor(slug) {
  return process.env[`STRIPE_PRICE_${slug.toUpperCase().replace(/-/g, '_')}`] || '';
}
