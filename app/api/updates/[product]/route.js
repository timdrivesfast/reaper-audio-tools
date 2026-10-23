import { NextResponse } from 'next/server';
import { latestRelease } from '../../../../lib/server/releases';
import { products, site } from '../../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Update check for the plugins' Settings > Check for updates:
 *   GET /api/updates/easyduck -> {"version":"1.2.0","url":"https://www.reaperaudiotools.com/account?product=easyduck","notes":"…"}
 * The url is the account page, where the owner signs in and downloads the new installer.
 * The version comes from installers/<product>/latest.json in Supabase Storage, which the
 * plugin repo's release workflow writes when it uploads a new build. The env var
 * <PRODUCT>_LATEST_VERSION (e.g. EASYDUCK_LATEST_VERSION) overrides it if set.
 */
export async function GET(_request, { params }) {
  const slug = String(params.product || '').toLowerCase();
  const product = products[slug];
  if (!product) return NextResponse.json({ error: 'Unknown plugin.' }, { status: 404 });

  const latest = await latestRelease(slug);
  const version = latest ? latest.version : '';
  if (!/^\d+(\.\d+){0,3}$/.test(version)) {
    return NextResponse.json({ error: 'No release published yet.' }, { status: 404, headers: { 'Cache-Control': 'public, s-maxage=60' } });
  }
  return NextResponse.json(
    { version, url: `${site.url}/account?product=${slug}`, notes: latest.notes },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
  );
}
