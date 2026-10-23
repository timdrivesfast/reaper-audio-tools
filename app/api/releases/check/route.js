import { NextResponse } from 'next/server';
import { db } from '../../../../lib/server/supabase';
import { unsubscribeToken } from '../../../../lib/server/auth';
import { compareVersions, latestRelease, noteLines } from '../../../../lib/server/releases';
import { sendUpdateEmails } from '../../../../lib/server/email';
import { products, site } from '../../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * Emails owners when a plugin has a new version. Safe to call any time, by anyone:
 * it only sends when installers/<product>/latest.json holds a version newer than every
 * version already announced, and records it first so it never sends twice.
 * The plugin release workflow calls it after uploading; a daily cron is the backup.
 * The first time a product is seen, its current version is recorded without emailing.
 */
async function check(slug) {
  const supabase = db();
  const latest = await latestRelease(slug);
  if (!latest) return { product: slug, status: 'no release' };
  const { data: seen, error } = await supabase.from('release_notices').select('version').eq('product', slug);
  if (error) return { product: slug, status: 'error', error: error.message };
  const baseline = !seen || seen.length === 0;
  if (!baseline && seen.some((r) => compareVersions(r.version, latest.version) >= 0)) return { product: slug, status: 'up to date', version: latest.version };

  // Claim this version. A concurrent call loses on the primary key and stops here.
  const { error: claimErr } = await supabase.from('release_notices').insert({ product: slug, version: latest.version });
  if (claimErr) return { product: slug, status: 'already claimed', version: latest.version };
  if (baseline) return { product: slug, status: 'baseline recorded', version: latest.version };

  const { data: lic } = await supabase.from('licenses').select('email').eq('product', slug).eq('status', 'active');
  const { data: out } = await supabase.from('email_optouts').select('email');
  const skip = new Set((out || []).map((r) => r.email));
  const emails = [...new Set((lic || []).map((r) => String(r.email).toLowerCase()))].filter((e) => !skip.has(e));
  const recipients = emails.map((email) => ({ email, unsubscribeUrl: `${site.url}/api/unsubscribe?token=${encodeURIComponent(unsubscribeToken(email))}` }));
  const sent = recipients.length ? await sendUpdateEmails({ product: slug, version: latest.version, notes: noteLines(latest.notes), recipients }) : 0;
  await supabase.from('release_notices').update({ recipients: sent }).eq('product', slug).eq('version', latest.version);
  return { product: slug, status: 'sent', version: latest.version, sent };
}

async function handle(request) {
  const only = new URL(request.url).searchParams.get('product');
  const slugs = Object.keys(products).filter((s) => products[s].status === 'available' && (!only || s === only));
  const results = [];
  for (const s of slugs) results.push(await check(s));
  return NextResponse.json({ results });
}

export const GET = handle;   // Vercel cron
export const POST = handle;  // release workflow
