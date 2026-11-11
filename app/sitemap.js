import { site } from '../lib/site';

export default function sitemap() {
  const now = new Date();
  const pages = [
    ['/', 1.0, 'weekly'], ['/plugins/easyduck', 0.9, 'weekly'], ['/plugins/drumcrusher', 0.9, 'weekly'], ['/plugins/modfx-pro', 0.9, 'weekly'],
    ['/basic', 0.7, 'monthly'], ['/pro', 0.7, 'monthly'], ['/contact', 0.3, 'yearly'],
    ['/legal/terms', 0.2, 'yearly'], ['/legal/privacy', 0.2, 'yearly'], ['/legal/refunds', 0.2, 'yearly'],
  ];
  return pages.map(([p, priority, changeFrequency]) => ({ url: `${site.url}${p}`, lastModified: now, priority, changeFrequency }));
}
