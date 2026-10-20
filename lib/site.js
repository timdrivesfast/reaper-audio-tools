// Everything you are likely to change lives here or in .env.local.
// [Bracketed] text is a placeholder: replace it before launch.

export const site = {
  name: 'Reaper Audio Tools',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '[support email]',
  // Must match the seller name on your Paddle account exactly.
  sellerName: process.env.NEXT_PUBLIC_SELLER_NAME || '[Your legal name]',
  refundDays: process.env.NEXT_PUBLIC_REFUND_DAYS || '[refund window]',
  description: 'Precision audio tools. Plugins for every producer. Everyday tools to ignite your sound.',
};

export const products = {
  easyduck: {
    slug: 'easyduck',
    code: '01',
    name: 'EasyDuck',
    tone: 'coral',
    status: 'available',
    kind: 'Sidechain emulator',
    tagline: 'Sidechain without the routing. Draw the curve, pick the rhythm.',
    formats: 'VST3 · AU · AUv3',
    priceLabel: process.env.NEXT_PUBLIC_EASYDUCK_PRICE_LABEL || '$--',
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_EASYDUCK || '',
    image: '/images/easyduck.webp',
  },
  drumcrusher: {
    slug: 'drumcrusher',
    code: '02',
    name: 'DrumCrusher',
    tone: 'cyan',
    status: 'soon',
    kind: 'Drum bus processor',
    tagline: 'Drum bus processor. EQ, filters, faders and Juice in one window.',
    image: '/images/drumcrusher-concept.webp',
  },
};

export const nav = [
  { label: 'Plugins', href: '/#plugins' },
  { label: 'EasyDuck', href: '/plugins/easyduck' },
  { label: 'DrumCrusher', href: '/#drumcrusher' },
  { label: 'FAQ', href: '/#faq' },
];

export const footerColumns = [
  { title: 'Plugins', links: [{ label: 'EasyDuck', href: '/plugins/easyduck' }, { label: 'DrumCrusher', href: '/#drumcrusher' }] },
  { title: 'Help', links: [{ label: 'FAQ', href: '/#faq' }, { label: 'Contact', href: '/contact' }] },
  { title: 'Legal', links: [{ label: 'Terms', href: '/legal/terms' }, { label: 'Privacy', href: '/legal/privacy' }, { label: 'Refunds', href: '/legal/refunds' }] },
];
