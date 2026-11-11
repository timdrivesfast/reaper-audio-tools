// Structured data (schema.org JSON-LD) for search engines and AI answer engines.
// Invisible on the page; it tells crawlers exactly what each plugin is, costs and runs on.
import { site, products, launch, suites } from './site';

const abs = (p) => `${site.url}${p}`;
const KIND = { easyduck: 'Sidechain emulator / volume ducking plugin', drumcrusher: 'Drum bus compressor / parallel compression plugin', 'modfx-pro': 'Performance multi-effects plugin' };

export const orgSchema = {
  '@context': 'https://schema.org', '@type': 'Organization', '@id': abs('/#org'),
  name: site.name, url: site.url, logo: abs('/images/v2/typemark.png'), email: site.supportEmail,
  sameAs: (site.social || []).map((s) => s.href),
  description: 'Reaper Audio Tools makes VST3 and AU audio plugins for music producers: EasyDuck, DrumCrusher and ModFX Pro. Not affiliated with the REAPER DAW.',
};

export const websiteSchema = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': abs('/#site'), name: site.name, url: site.url, publisher: { '@id': abs('/#org') } };

export function productSchema(p, { description, features = [] } = {}) {
  const live = p.free || launch.live;
  return {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', '@id': abs(`/plugins/${p.slug}#app`),
    name: p.name, url: abs(`/plugins/${p.slug}`), description: description || p.tagline,
    applicationCategory: 'MultimediaApplication', applicationSubCategory: KIND[p.slug] || p.kind,
    operatingSystem: 'macOS, Windows', fileFormat: ['VST3', 'AU'],
    image: abs(p.ui), screenshot: abs(p.ui),
    featureList: features.map((f) => `${f.title}: ${f.detail || f.body}`),
    keywords: [p.kind, 'VST3 plugin', 'AU plugin', 'audio plugin', 'music production', p.suite === 'pro' ? 'Pro Suite' : 'Basic Suite'].join(', '),
    isAccessibleForFree: !!p.free,
    offers: {
      '@type': 'Offer', url: abs(`/plugins/${p.slug}`), price: String(p.free ? 0 : p.price), priceCurrency: 'USD',
      availability: live ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      ...(live ? {} : { availabilityStarts: launch.at }),
    },
    publisher: { '@id': abs('/#org') }, brand: { '@type': 'Brand', name: site.name },
  };
}

export function breadcrumbSchema(items) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })) };
}

export function pluginListSchema(name, list) {
  return { '@context': 'https://schema.org', '@type': 'ItemList', name, itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/plugins/${p.slug}`), name: p.name })) };
}

export const jsonLd = (obj) => ({ __html: JSON.stringify(obj).replace(/</g, '\\u003c') });
export { suites };
