import { site } from '../lib/site';

export default function sitemap() {
  const paths = ['/', '/plugins/easyduck', '/contact', '/legal/terms', '/legal/privacy', '/legal/refunds'];
  return paths.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date() }));
}
