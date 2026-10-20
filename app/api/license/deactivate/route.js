import { NextResponse } from 'next/server';
import { db } from '../../../../lib/server/supabase';
import { KEY_PATTERN, normalizeKey } from '../../../../lib/server/license';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Called by the plugin's "Deactivate this computer" button. Body: { key, machineId } */
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Send JSON.' }, { status: 400 }); }
  const key = normalizeKey(body.key);
  const machineId = String(body.machineId || '');
  if (!KEY_PATTERN.test(key) || !machineId) return NextResponse.json({ error: 'Missing key or machineId.' }, { status: 400 });

  const supabase = db();
  const { data: license } = await supabase.from('licenses').select('id').eq('key', key).maybeSingle();
  if (!license) return NextResponse.json({ error: "That license key doesn't exist." }, { status: 404 });
  await supabase.from('activations').delete().eq('license_id', license.id).eq('machine_id', machineId);
  return NextResponse.json({ ok: true });
}
