import { NextResponse } from 'next/server';
import { db } from '../../../../lib/server/supabase';
import { sessionEmail } from '../../../../lib/server/auth';
import { site } from '../../../../lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Form POST from the account page: frees one activation (a computer) on a license you own. */
export async function POST(request) {
  const email = sessionEmail();
  if (!email) return NextResponse.redirect(`${site.url}/account`, 303);
  const form = await request.formData();
  const id = String(form.get('id') || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.redirect(`${site.url}/account`, 303);
  const supabase = db();
  const { data: act } = await supabase.from('activations').select('id, licenses ( email )').eq('id', id).maybeSingle();
  if (act && String(act.licenses?.email || '').toLowerCase() === email) {
    await supabase.from('activations').delete().eq('id', id);
  }
  return NextResponse.redirect(`${site.url}/account`, 303);
}
