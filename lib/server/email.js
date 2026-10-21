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
    <p style="margin:0;font-size:14px;color:#4A4C54">Questions: ${esc(site.supportEmail)}</p>
  </div>
</div></body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject: p.free ? `Your ${p.name} download` : `Your ${p.name} license key`, text, html, reply_to: site.supportEmail.includes('@') ? site.supportEmail : undefined }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}
