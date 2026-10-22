import './globals.css';
import { site } from '../lib/site';

export const metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Simple tools for making beats`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: 'website', images: ['/images/easyduck.webp'] },
  twitter: { card: 'summary_large_image' },
};

export const viewport = { themeColor: '#E9EAEF', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Rubik-Bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Rubik-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
