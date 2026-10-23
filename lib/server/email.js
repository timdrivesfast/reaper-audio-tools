import { site, products } from '../site';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Sends the license key and download links through Resend. */
export async function sendLicenseEmail({ to, name, product, key }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error('RESEND_API_KEY and EMAIL_FROM must be set.');
  const p = products[product] || { name: product };
  const dl = (platform) => `${site.url}/api/download?product=${encodeURIComponent(product)}&platform=${platform}&key=${encodeURIComponent(key)}`;
  const greeting = name ? `Hey ${name.split(' ')[0]},` : 'Hey,';
  const max = process.env.LICENSE_MAX_ACTIVATIONS || 2;
  // Free plugins don't ask for a key; paid ones do.
  const howTo = p.free
    ? `Run the installer, then open your DAW and rescan plugins. ${p.name} shows up under Reaper Audio Tools. Keep this email: the key is your record of the download.`
    : `Install, open your DAW, load ${p.name} and paste the key when it asks. One key works on ${max} computers.`;
  // Installers aren't code-signed yet, so the OS warns on first install.
  const firstInstall = [
    'First install:',
    'Mac: if macOS blocks the installer, open System Settings > Privacy & Security, scroll down, click Open Anyway, then run the installer again.',
    'Windows: if you see "Windows protected your PC", click More info, then Run anyway.',
  ];

  const text = [
    greeting,
    '',
    p.free ? `Here's ${p.name}. Download links are below.` : `Here's your ${p.name} license.`,
    '',
    `License key: ${key}`,
    '',
    `Mac installer: ${dl('mac')}`,
    `Windows installer: ${dl('windows')}`,
    '',
    howTo,
    '',
    ...firstInstall,
    '',
    `Your plugins, keys and the latest installers are also at ${site.url}/account. Sign in with this email.`,
    '',
    `Questions: ${site.supportEmail}`,
    '',
    'Reaper Audio Tools',
  ].join('\n');

  const html = `<!doctype html><html><body style="margin:0;background:#E9EAEF;font-family:Helvetica,Arial,sans-serif;color:#18191C">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <div style="background:#FA7F7F;color:#18191C;font:700 11px/1 Helvetica,Arial,sans-serif;letter-spacing:1.5px;padding:8px 14px;border-radius:12px 12px 0 0">${esc(p.name.toUpperCase())} • REAPER AUDIO TOOLS •</div>
  <div style="background:#ECEDF1;padding:28px;border-radius:0 0 12px 12px">
    <p style="margin:0 0 16px;font-size:16px">${esc(greeting)}</p>
    <p style="margin:0 0 20px;font-size:16px">${p.free ? `Here's ${esc(p.name)}. Download links are below.` : `Here's your ${esc(p.name)} license.`}</p>
    <div style="font-size:12px;font-weight:700;letter-spacing:1px;margin-bottom:8px">LICENSE KEY</div>
    <div style="display:inline-block;background:#1A1B1E;color:#F5D547;border:3px solid #CFD1D8;border-radius:3px;padding:10px 14px;font:18px/1 'Courier New',monospace;letter-spacing:1px">${esc(key)}</div>
    <p style="margin:24px 0 12px;font-size:16px">
      <a href="${esc(dl('mac'))}" style="display:inline-block;background:#18191C;color:#fff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.4px;padding:12px 20px;border-radius:999px;margin:0 8px 8px 0">DOWNLOAD FOR MAC</a>
      <a href="${esc(dl('windows'))}" style="display:inline-block;background:#18191C;color:#fff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.4px;padding:12px 20px;border-radius:999px;margin:0 8px 8px 0">DOWNLOAD FOR WINDOWS</a>
    </p>
    <p style="margin:0 0 16px;font-size:14px;color:#4A4C54">${esc(howTo)}</p>
    <div style="margin:0 0 16px;padding:14px 16px;background:#E3E4EA;border-radius:10px;font-size:13px;line-height:1.5;color:#4A4C54">
      <div style="font-weight:700;color:#18191C;margin-bottom:4px">${esc(firstInstall[0])}</div>
      <div>${esc(firstInstall[1])}</div>
      <div style="margin-top:6px">${esc(firstInstall[2])}</div>
    </div>
    <p style="margin:0 0 8px;font-size:14px;color:#4A4C54">Your plugins, keys and the latest installers are also at <a href="${esc(site.url)}/account" style="color:#18191C">${esc(site.url.replace(/^https?:\/\//, ''))}/account</a>. Sign in with this email.</p>
    <p style="margin:0;font-size:14px;color:#4A4C54">Questions: ${esc(site.supportEmail)}</p>
  </div>
</div></body></html>`;

  const res = await fetch((process.env.RESEND_API_URL || 'https://api.resend.com') + '/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject: p.free ? `Your ${p.name} download` : `Your ${p.name} license key`, text, html, reply_to: site.supportEmail.includes('@') ? site.supportEmail : undefined }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}


// --- Shared layout for the account emails -----------------------------------------

function shell(label, inner) {
  return `<!doctype html><html><body style="margin:0;background:#E9EAEF;font-family:Helvetica,Arial,sans-serif;color:#18191C">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <div style="background:#FA7F7F;color:#18191C;font:700 11px/1 Helvetica,Arial,sans-serif;letter-spacing:1.5px;padding:8px 14px;border-radius:12px 12px 0 0">${esc(label)} • REAPER AUDIO TOOLS •</div>
  <div style="background:#ECEDF1;padding:28px;border-radius:0 0 12px 12px">${inner}</div>
</div></body></html>`;
}
const button = (href, label) => `<a href="${esc(href)}" style="display:inline-block;background:#18191C;color:#fff;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:.4px;padding:12px 20px;border-radius:999px">${esc(label)}</a>`;

function resendConfig() {
  const apiKey = process.env.RESEND_API_KEY, from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error('RESEND_API_KEY and EMAIL_FROM must be set.');
  return { apiKey, from, replyTo: site.supportEmail.includes('@') ? site.supportEmail : undefined };
}

/** The sign-in link for /account. */
export async function sendSignInEmail({ to, link }) {
  const { apiKey, from, replyTo } = resendConfig();
  const text = ['Here is your sign-in link for Reaper Audio Tools:', '', link, '', 'It works for 30 minutes. If you did not ask for it, ignore this email.', '', 'Reaper Audio Tools'].join('\n');
  const html = shell('SIGN IN', `
    <p style="margin:0 0 20px;font-size:16px">Here is your sign-in link. It works for 30 minutes.</p>
    <p style="margin:0 0 20px">${button(link, 'SIGN IN')}</p>
    <p style="margin:0;font-size:14px;color:#4A4C54">If you did not ask for this, ignore this email.</p>`);
  const res = await fetch((process.env.RESEND_API_URL || 'https://api.resend.com') + '/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject: 'Sign in to Reaper Audio Tools', text, html, reply_to: replyTo }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}

/** One "new version" email per recipient, sent in batches of 100.
 *  recipients: [{ email, unsubscribeUrl }]. Returns how many were accepted. */
export async function sendUpdateEmails({ product, version, notes, recipients }) {
  const { apiKey, from, replyTo } = resendConfig();
  const p = products[product] || { name: product };
  const account = `${site.url}/account?product=${encodeURIComponent(product)}`;
  const lines = notes || [];
  let sent = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const batch = recipients.slice(i, i + 100).map(({ email, unsubscribeUrl }) => ({
      from, to: [email], reply_to: replyTo,
      subject: `${p.name} ${version} is out`,
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
      text: [
        `${p.name} ${version} is out.`, '',
        ...(lines.length ? [...lines.map((l) => `- ${l}`), ''] : []),
        `Download it from your account: ${account}`,
        'Run the installer. It replaces the old version. Restart your DAW after.', '',
        `Stop update emails: ${unsubscribeUrl}`,
      ].join('\n'),
      html: shell(p.name.toUpperCase(), `
        <p style="margin:0 0 16px;font-size:20px;font-weight:700">${esc(p.name)} ${esc(version)} is out.</p>
        ${lines.length ? `<ul style="margin:0 0 20px;padding-left:20px;font-size:15px;line-height:1.5">${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>` : ''}
        <p style="margin:0 0 20px">${button(account, 'DOWNLOAD THE UPDATE')}</p>
        <p style="margin:0 0 16px;font-size:14px;color:#4A4C54">Run the installer. It replaces the old version. Restart your DAW after.</p>
        <p style="margin:0;font-size:12px;color:#6B6E78"><a href="${esc(unsubscribeUrl)}" style="color:#6B6E78">Stop update emails</a></p>`),
    }));
    const res = await fetch((process.env.RESEND_API_URL || 'https://api.resend.com') + '/emails/batch', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
      body: JSON.stringify(batch),
    });
    if (!res.ok) { console.error('[update-email]', res.status, await res.text()); continue; }
    sent += batch.length;
  }
  return sent;
}
