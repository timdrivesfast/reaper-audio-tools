import { NextResponse } from 'next/server';
import { SESSION_COOKIE, sessionCookieOptions, sessionToken, verifyToken } from '../../../../lib/server/auth';
import { site } from '../../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** The link from the sign-in email. Sets the session cookie and goes to the account page. */
export async function GET(request) {
  const url = new URL(request.url);
  const p = verifyToken(url.searchParams.get('token'), 'login');
  const nextParam = url.searchParams.get('next') || '/account';
  const next = /^\/account(\?[\w=&%-]*)?$/.test(nextParam) ? nextParam : '/account';
  if (!p) return NextResponse.redirect(`${site.url}/account?link=expired`, 303);
  const res = NextResponse.redirect(`${site.url}${next}`, 303);
  res.cookies.set(SESSION_COOKIE, sessionToken(p.e), sessionCookieOptions);
  return res;
}
