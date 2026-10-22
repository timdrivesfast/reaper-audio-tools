import { NextResponse } from 'next/server';
import { db } from '../../../../lib/server/supabase';
import { products, site } from '../../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Update check for the plugins' Settings > Check for updates:
 *   GET /api/updates/easyduck -> {"version":"1.2.0","url":"https://www.reaperaudiotools.com/plugins/easyduck"}
 * The version comes from installers/<product>/latest.json in Supabase Storage, which the
 * plugin repo's release workflow writes when it uploads a new build. The env var
 * <PRODUCT>_LATEST_VERSION (e.g. EASYDUCK_LATEST_VERSION) overrides it if set.
 */
export async function GET(_request, { params }) {
  const slug = String(params.product || '').toLowerCase();
  const product = products[slug];
  if (!product) return NextResponse.json({ error: 'Unknown plugin.' }, { status: 404 });

  let version = process.env[`${slug.toUpperCase()}_LATEST_VERSION`] || '';
  if (!version) {
    try {
      const { data, error } = await db().storage.from('installers').download(`${slug}/latest.json`);
      if (!error && data) version = String(JSON.parse(await data.text()).version || '');
    } catch (err) {
      console.error('[updates]', slug, err);
    }
  }
  if (!/^\d+(\.\d+){0,3}$/.test(version)) {
    return NextResponse.json({ error: 'No release published yet.' }, { status: 404, headers: { 'Cache-Control': 'public, s-maxage=60' } });
  }
  return NextResponse.json(
    { version, url: `${site.url}/plugins/${slug}` },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
  );
}
