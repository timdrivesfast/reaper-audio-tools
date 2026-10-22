import { NextResponse } from 'next/server';
import { db } from '../../../lib/server/supabase';

// Waitlist signups. Each one is saved to the Supabase `waitlist` table
// (supabase/migrations/0002_waitlist.sql). Set WAITLIST_WEBHOOK_URL to also
// forward it as JSON ({ email, list, signedUpAt }) to an email tool.

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Send JSON with an email.' }, { status: 400 });
  }
  const email = String(body?.email || '').trim().toLowerCase();
  const list = String(body?.list || 'general').slice(0, 40);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'That email address looks wrong.' }, { status: 400 });
  }
  const signup = { email, list, signedUpAt: new Date().toISOString() };
  console.log('[waitlist]', JSON.stringify(signup));

  let saved = false;
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const { error } = await db()
      .from('waitlist')
      .upsert({ email, list }, { onConflict: 'email,list', ignoreDuplicates: true });
    if (error) console.error('[waitlist] save failed', error.message);
    else saved = true;
  }

  const hook = process.env.WAITLIST_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(signup) }).catch(() => null);
    if (res && res.ok) saved = true;
  }

  if (!saved) return NextResponse.json({ error: 'Signup failed. Try again.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
