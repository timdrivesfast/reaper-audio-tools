import { NextResponse } from 'next/server';
import { db } from '../../../lib/server/supabase';
import { KEY_PATTERN, normalizeKey } from '../../../lib/server/license';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PLATFORMS = ['mac', 'windows'];

/**
 * Download link from the license email: /api/download?product=easyduck&platform=mac&key=RAT-…
 * Checks the key, then redirects to a 10-minute signed link for the installer in the
 * private "installers" bucket (uploaded as easyduck/mac.pkg, easyduck/windows.exe, …).
 */
export async function GET(request) {
  const url = new URL(request.url);
  const key = normalizeKey(url.searchParams.get('key'));
  const product = String(url.searchParams.get('product') || '').toLowerCase();
  const platform = String(url.searchParams.get('platform') || '').toLowerCase();
  if (!KEY_PATTERN.test(key) || !/^[a-z0-9-]+$/.test(product) || !PLATFORMS.includes(platform)) {
    return new NextResponse('That download link is incomplete. Use the link from your license email.', { status: 400 });
  }

  const supabase = db();
  const { data: license } = await supabase.from('licenses').select('product, status').eq('key', key).maybeSingle();
  if (!license || license.product !== product || license.status !== 'active') {
    return new NextResponse('That license key is not valid for this download.', { status: 403 });
  }

  const { data: files, error } = await supabase.storage.from('installers').list(product);
  if (error) return new NextResponse('Downloads are unavailable right now. Try again in a minute.', { status: 500 });
  const file = (files || []).find((f) => f.name.toLowerCase().startsWith(platform + '.'));
  if (!file) return new NextResponse(`The ${platform} installer isn't uploaded yet.`, { status: 404 });

  const { data: signed, error: signErr } = await supabase.storage.from('installers').createSignedUrl(`${product}/${file.name}`, 600, { download: true });
  if (signErr) return new NextResponse('Downloads are unavailable right now. Try again in a minute.', { status: 500 });
  return NextResponse.redirect(signed.signedUrl, 302);
}
