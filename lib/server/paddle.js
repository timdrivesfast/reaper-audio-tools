import crypto from 'node:crypto';

/**
 * Checks a Paddle Billing webhook. Header looks like "ts=1671552777;h1=eb4d0dc8…".
 * Paddle signs "<ts>:<raw body>" with HMAC-SHA256 using the endpoint's secret key.
 */
export function verifyPaddleSignature(rawBody, header, secret, { toleranceSeconds = 300, now = Date.now() } = {}) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(';').map((p) => p.split('=')).filter((p) => p.length === 2).map(([k, v]) => [k.trim(), v.trim()]));
  const signatures = header.split(';').map((p) => p.trim()).filter((p) => p.startsWith('h1=')).map((p) => p.slice(3));
  const ts = parseInt(parts.ts, 10);
  if (!Number.isFinite(ts) || !signatures.length) return false;
  if (Math.abs(now / 1000 - ts) > toleranceSeconds) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${ts}:${rawBody}`).digest('hex');
  return signatures.some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}

function apiBase() {
  return process.env.NEXT_PUBLIC_PADDLE_ENV === 'production' ? 'https://api.paddle.com' : 'https://sandbox-api.paddle.com';
}

/** Customer email and name. Paddle's transaction webhook only carries the customer ID. */
export async function getPaddleCustomer(customerId) {
  const key = process.env.PADDLE_API_KEY;
  if (!key) throw new Error('PADDLE_API_KEY is not set.');
  const res = await fetch(`${apiBase()}/customers/${encodeURIComponent(customerId)}`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Paddle customer lookup failed: ${res.status}`);
  const { data } = await res.json();
  return { email: data.email, name: data.name || null };
}
