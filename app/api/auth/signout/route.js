import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '../../../../lib/server/auth';
import { site } from '../../../../lib/site';

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.redirect(`${site.url}/account`, 303);
  res.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
