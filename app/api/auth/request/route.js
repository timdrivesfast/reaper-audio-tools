import { NextResponse } from 'next/server';
import { isEmail, loginToken, normalizeEmail } from '../../../../lib/server/auth';
import { sendSignInEmail } from '../../../../lib/server/email';
import { site } from '../../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST { email, next } -> emails a sign-in link. Same answer whether or not the email has plugins. */
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Send JSON with an email.' }, { status: 400 }); }
  const email = normalizeEmail(body?.email);
  if (!isEmail(email)) return NextResponse.json({ error: 'That email address looks wrong.' }, { status: 400 });
  const next = typeof body?.next === 'string' && /^\/account(\?[\w=&%-]*)?$/.test(body.next) ? body.next : '/account';
  const link = `${site.url}/api/auth/verify?token=${encodeURIComponent(loginToken(email))}&next=${encodeURIComponent(next)}`;
  try {
    await sendSignInEmail({ to: email, link });
  } catch (err) {
    console.error('[auth/request]', err.message);
    return NextResponse.json({ error: "Couldn't send the email. Try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
