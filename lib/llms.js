// Plain-text (markdown) summaries for AI assistants, served at /llms.txt and /llms-full.txt.
// Built from the same data as the pages, so they never go out of date.
import { site, products, launch } from './site';
import { easyDuckFeatures, easyDuckDescription, drumCrusherFeatures, drumCrusherDescription, modFxFeatures, modFxDescription } from './catalog';
import { homeFaq, easyDuckFaq, drumCrusherFaq, modFxFaq } from './faq';

const DETAIL = {
  easyduck: { features: easyDuckFeatures, description: easyDuckDescription, faq: easyDuckFaq },
  drumcrusher: { features: drumCrusherFeatures, description: drumCrusherDescription, faq: drumCrusherFaq },
  'modfx-pro': { features: modFxFeatures, description: modFxDescription, faq: modFxFaq },
};
const price = (p) => (p.free ? 'Free' : launch.live ? `${p.priceLabel} one-time` : `${p.priceLabel} one-time, launches ${launch.label} (${launch.at.slice(0, 10)})`);
const suiteName = (p) => (p.suite === 'pro' ? 'Pro Suite' : 'Basic Suite');

function header() {
  return [`# ${site.name}`, '',
    `> ${site.name} makes audio plugins (VST3 and AU) for music producers on Mac and Windows. ${Object.values(products).filter((p) => p.free).map((p) => p.name).join(' and ')} are free. Not affiliated with the REAPER DAW.`, '',
    'Plugins load in any DAW that supports VST3 or AU: Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One, Reaper and GarageBand. Mac gets VST3 and AU; Windows gets VST3. Pro Tools (AAX) is not supported.', ''];
}

export function llmsTxt() {
  const lines = header();
  lines.push('## Plugins', '');
  for (const p of Object.values(products)) lines.push(`- [${p.name}](${site.url}/plugins/${p.slug}): ${p.kind}, ${suiteName(p)}. ${price(p)}. ${DETAIL[p.slug].description}`);
  lines.push('', '## Suites', '', `- [Basic Suite](${site.url}/basic): free plugins with a light interface and a few controls each.`, `- [Pro Suite](${site.url}/pro): paid plugins with deeper control and a dark interface.`);
  lines.push('', '## More', '', `- [Full details for AI assistants](${site.url}/llms-full.txt): every plugin's controls, specs and FAQ in one file.`, `- [FAQ](${site.url}/#faq)`, `- [Contact](${site.url}/contact): ${site.supportEmail}`, `- [Refund policy](${site.url}/legal/refunds)`);
  return lines.join('\n') + '\n';
}

export function llmsFullTxt() {
  const lines = header();
  for (const p of Object.values(products)) {
    const d = DETAIL[p.slug];
    lines.push(`## ${p.name}`, '', `URL: ${site.url}/plugins/${p.slug}`, `Type: ${p.kind}`, `Suite: ${suiteName(p)}`, `Price: ${price(p)}`, `Formats: VST3, AU`, `Platforms: macOS (VST3, AU), Windows (VST3)`,
      p.free ? 'How to get it: enter your email on the plugin page; a license key and download links arrive by email. No card needed.' : `How to get it: buy on the plugin page (Stripe checkout); a license key and download links arrive by email. Works on ${process.env.LICENSE_MAX_ACTIVATIONS || 2} computers.`,
      '', d.description, '', '### Controls', '');
    for (const f of d.features) lines.push(`- ${f.title}: ${f.body}`);
    lines.push('', '### FAQ', '');
    for (const f of d.faq) lines.push(`Q: ${f.q}`, `A: ${f.a}`, '');
  }
  lines.push(`## General FAQ`, '');
  for (const f of homeFaq) lines.push(`Q: ${f.q}`, `A: ${f.a}`, '');
  lines.push(`Contact: ${site.supportEmail}`);
  return lines.join('\n') + '\n';
}
