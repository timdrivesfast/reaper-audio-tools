import { NextResponse } from 'next/server';
import { db } from '../../../../lib/server/supabase';
import { KEY_PATTERN, normalizeKey, signLicense } from '../../../../lib/server/license';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Called by the plugin. Body: { key, product, machineId, machineName? }
 * 200 → { license: "<payload>.<signature>", activationsUsed, maxActivations }
 * 404 unknown key · 403 revoked or wrong product · 409 computer limit reached (lists the active computers)
 */
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Send JSON.' }, { status: 400 }); }
  const key = normalizeKey(body.key);
  const product = String(body.product || '').toLowerCase();
  const machineId = String(body.machineId || '').slice(0, 200);
  const machineName = body.machineName ? String(body.machineName).slice(0, 100) : null;
  if (!KEY_PATTERN.test(key) || !product || machineId.length < 8) {
    return NextResponse.json({ error: 'Missing or malformed key, product or machineId.' }, { status: 400 });
  }

  const supabase = db();
  const { data: license } = await supabase.from('licenses').select('id, key, product, email, status, max_activations').eq('key', key).maybeSingle();
  if (!license) return NextResponse.json({ error: "That license key doesn't exist." }, { status: 404 });
  if (license.status !== 'active') return NextResponse.json({ error: 'This license has been deactivated.' }, { status: 403 });
  if (license.product !== product) return NextResponse.json({ error: `This key is for ${license.product}, not ${product}.` }, { status: 403 });

  const { data: activations } = await supabase.from('activations').select('id, machine_id, machine_name, created_at').eq('license_id', license.id);
  const mine = (activations || []).find((a) => a.machine_id === machineId);

  if (mine) {
    await supabase.from('activations').update({ last_seen_at: new Date().toISOString(), machine_name: machineName || mine.machine_name }).eq('id', mine.id);
  } else {
    if ((activations || []).length >= license.max_activations) {
      return NextResponse.json({
        error: `This key is already on ${license.max_activations} computers. Deactivate one first.`,
        computers: activations.map((a) => ({ name: a.machine_name, since: a.created_at })),
      }, { status: 409 });
    }
    const { error } = await supabase.from('activations').insert({ license_id: license.id, machine_id: machineId, machine_name: machineName });
    if (error && error.code !== '23505') return NextResponse.json({ error: 'Activation failed. Try again.' }, { status: 500 });
  }

  const used = mine ? activations.length : (activations || []).length + 1;
  const token = signLicense({ v: 1, key: license.key, product: license.product, machineId, email: license.email, issuedAt: new Date().toISOString() });
  return NextResponse.json({ license: token, activationsUsed: used, maxActivations: license.max_activations });
}
