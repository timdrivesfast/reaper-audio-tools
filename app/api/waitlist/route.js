import { NextResponse } from 'next/server';

// Waitlist signups. Set WAITLIST_WEBHOOK_URL to forward each signup as JSON
// ({ email, list, signedUpAt }) to your email tool: a Zapier or Make webhook,
// Loops, ConvertKit, Klaviyo, or a Google Sheet via Apps Script.
// Without it, signups are only written to the server log.

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
  const hook = process.env.WAITLIST_WEBHOOK_URL;
  if (hook) {
    const res = await fetch(hook, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(signup) });
    if (!res.ok) return NextResponse.json({ error: 'Signup failed. Try again.' }, { status: 502 });
  } else {
    console.log('[waitlist]', JSON.stringify(signup));
  }
  return NextResponse.json({ ok: true });
}
