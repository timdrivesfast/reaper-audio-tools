import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';

// Passwordless sign-in. A signed token goes out by email; opening it sets a signed
// session cookie holding the email address. Nothing is stored server-side.
// AUTH_SECRET signs both. Without it, a secret is derived from the Supabase service
// role key so sign-in works with no extra setup; set AUTH_SECRET to rotate sessions.

export const SESSION_COOKIE = 'rat_session';
export const SESSION_DAYS = 30;
const LOGIN_MINUTES = 30;

function secret() {
  if (process.env.AUTH_SECRET) return process.env.AUTH_SECRET;
  const base = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base) throw new Error('AUTH_SECRET or SUPABASE_SERVICE_ROLE_KEY must be set.');
  return crypto.createHmac('sha256', base).update('reaper-audio-tools-auth').digest('hex');
}

const b64 = (buf) => Buffer.from(buf).toString('base64url');
const mac = (data) => crypto.createHmac('sha256', secret()).update(data).digest();

export function signToken(payload) {
  const data = b64(JSON.stringify(payload));
  return `${data}.${b64(mac(data))}`;
}

export function verifyToken(token, purpose) {
  const [data, sig] = String(token || '').split('.');
  if (!data || !sig) return null;
  const want = mac(data), got = Buffer.from(sig, 'base64url');
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')); } catch { return null; }
  if (!payload || payload.p !== purpose || typeof payload.e !== 'string') return null;
  if (payload.x && Date.now() > payload.x) return null;
  return payload;
}

export const normalizeEmail = (s) => String(s || '').trim().toLowerCase();
export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;

export const loginToken = (email) => signToken({ p: 'login', e: email, x: Date.now() + LOGIN_MINUTES * 60e3 });
export const sessionToken = (email) => signToken({ p: 'session', e: email, x: Date.now() + SESSION_DAYS * 864e5 });
// No expiry: an unsubscribe link should keep working.
export const unsubscribeToken = (email) => signToken({ p: 'unsub', e: email });

/** The signed-in email, or null. */
export function sessionEmail() {
  const v = cookies().get(SESSION_COOKIE)?.value;
  const p = verifyToken(v, 'session');
  return p ? p.e : null;
}

export const sessionCookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: SESSION_DAYS * 86400 };

/** Escape an email for a Postgres ILIKE match (so _ and % are literal). */
export const likeExact = (email) => email.replace(/[\\%_]/g, (c) => '\\' + c);
