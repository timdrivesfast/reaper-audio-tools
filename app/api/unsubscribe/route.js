import { NextResponse } from 'next/server';
import { db } from '../../../lib/server/supabase';
import { verifyToken } from '../../../lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function optOut(token) {
  const p = verifyToken(token, 'unsub');
  if (!p) return false;
  const { error } = await db().from('email_optouts').upsert({ email: p.e }, { onConflict: 'email', ignoreDuplicates: true });
  if (error) { console.error('[unsubscribe]', error.message); return false; }
  return true;
}

const page = (msg) => new NextResponse(`<!doctype html><meta name="viewport" content="width=device-width"><title>Reaper Audio Tools</title><body style="font-family:Helvetica,Arial,sans-serif;background:#E9EAEF;color:#18191C;padding:48px 20px"><div style="max-width:520px;margin:0 auto"><h1 style="font-size:28px">${msg}</h1><p><a href="/account" style="color:#18191C">Your account</a></p></div></body>`, { headers: { 'content-type': 'text/html; charset=utf-8' } });

/** Link in update emails. */
export async function GET(request) {
  const ok = await optOut(new URL(request.url).searchParams.get('token'));
  return page(ok ? "You won't get update emails anymore." : "That unsubscribe link didn't work. Email us and we'll take you off.");
}

/** One-click unsubscribe from mail apps (List-Unsubscribe-Post). */
export async function POST(request) {
  const ok = await optOut(new URL(request.url).searchParams.get('token'));
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
