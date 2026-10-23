import 'server-only';
import crypto from 'node:crypto';
import { db } from './supabase';

// Caps how many emails the public forms (sign-in link, free download) can trigger,
// so nobody can use them to flood someone's inbox. Per hour:
const PER_EMAIL = 3;   // to one address, per form
const PER_IP = 10;     // from one visitor, all forms together

const hashIp = (ip) => crypto.createHash('sha256').update(`rat:${ip}`).digest('hex').slice(0, 32);

export function clientIp(request) {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : request.headers.get('x-real-ip') || '').trim() || 'unknown';
}

/** true if this send is allowed (and records it). Fails open if the table is missing. */
export async function allowEmailSend({ kind, email, ip }) {
  const supabase = db();
  const since = new Date(Date.now() - 3600e3).toISOString();
  const ipHash = hashIp(ip);
  const [byEmail, byIp] = await Promise.all([
    supabase.from('email_sends').select('id', { count: 'exact', head: true }).eq('kind', kind).eq('email', email).gte('created_at', since),
    supabase.from('email_sends').select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since),
  ]);
  if (byEmail.error || byIp.error) {
    console.error('[ratelimit]', (byEmail.error || byIp.error).message);
    return true;
  }
  if ((byEmail.count || 0) >= PER_EMAIL || (byIp.count || 0) >= PER_IP) return false;
  await supabase.from('email_sends').insert({ kind, email, ip_hash: ipHash });
  return true;
}

export const TOO_MANY = "That's a lot of emails in a short time. Try again in an hour, or check your inbox for the last one.";
