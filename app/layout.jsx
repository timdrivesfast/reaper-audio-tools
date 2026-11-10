import './globals.css';
import './v2.css';
import { site } from '../lib/site';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Intuitive tools for complex sounds`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: 'website', images: ['/images/v2/drumcrusher-ui.webp'] },
  twitter: { card: 'summary_large_image' },
};

export const viewport = { themeColor: '#22213A', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Geist-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/GeistMono-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
