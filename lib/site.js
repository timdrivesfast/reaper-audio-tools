// Everything you are likely to change lives here or in .env.local.
// [Bracketed] text is a placeholder: replace it before launch.

export const site = {
  name: 'Reaper Audio Tools',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '[support email]',
  // Must match the seller name on your Paddle account exactly.
  sellerName: process.env.NEXT_PUBLIC_SELLER_NAME || '[Your legal name]',
  refundDays: process.env.NEXT_PUBLIC_REFUND_DAYS || '[refund window]',
  description: 'Simple VST3 and AU plugins for making beats on Mac and Windows.',
};

export const products = {
  easyduck: {
    slug: 'easyduck',
    code: '01',
    name: 'EasyDuck',
    tone: 'coral',
    status: 'available',
    kind: 'Sidechain emulator',
    tagline: "Sidechain emulator that needs no input signal. Put it on any track, no routing.",
    formats: 'VST3 · AU',
    free: true,
    priceLabel: 'Free',
    image: '/images/easyduck.webp',
  },
  drumcrusher: {
    slug: 'drumcrusher',
    code: '02',
    name: 'DrumCrusher',
    tone: 'cyan',
    status: 'soon',
    kind: 'Drum bus processor',
    tagline: 'Drum bus processor with 3-band EQ, filters and per-band wet faders.',
    image: '/images/drumcrusher-concept.webp',
  },
};

export const nav = [
  { label: 'Plugins', href: '/#plugins' },
  { label: 'EasyDuck', href: '/plugins/easyduck' },
  { label: 'DrumCrusher', href: '/#drumcrusher' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Your plugins', href: '/account' },
];

export const footerColumns = [
  { title: 'Plugins', links: [{ label: 'EasyDuck', href: '/plugins/easyduck' }, { label: 'DrumCrusher', href: '/#drumcrusher' }] },
  { title: 'Help', links: [{ label: 'Your plugins', href: '/account' }, { label: 'FAQ', href: '/#faq' }, { label: 'Contact', href: '/contact' }] },
  { title: 'Legal', links: [{ label: 'Terms', href: '/legal/terms' }, { label: 'Privacy', href: '/legal/privacy' }, { label: 'Refunds', href: '/legal/refunds' }] },
];
