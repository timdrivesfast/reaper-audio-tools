import 'server-only';
import { db } from './supabase';

/** Latest published version of a plugin: { version, notes, date } or null.
 *  Reads installers/<slug>/latest.json (written by the plugin repo's release workflow).
 *  <SLUG>_LATEST_VERSION overrides the version. */
export async function latestRelease(slug) {
  let info = {};
  try {
    const { data, error } = await db().storage.from('installers').download(`${slug}/latest.json`);
    if (!error && data) info = JSON.parse(await data.text()) || {};
  } catch (err) {
    console.error('[releases]', slug, err.message);
  }
  const version = String(process.env[`${slug.toUpperCase()}_LATEST_VERSION`] || info.version || '');
  if (!/^\d+(\.\d+){0,3}$/.test(version)) return null;
  return { version, notes: typeof info.notes === 'string' ? info.notes.trim() : '', date: info.date || null };
}

/** -1, 0 or 1. Missing parts count as 0: 1.2 == 1.2.0. */
export function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d > 0 ? 1 : -1;
  }
  return 0;
}

/** Release notes as plain lines, without markdown bullets or headings. */
export function noteLines(notes, max = 6) {
  return String(notes || '').split('\n').map((l) => l.replace(/^\s*(?:[-*•]|#+)\s*/, '').trim()).filter(Boolean).slice(0, max);
}
