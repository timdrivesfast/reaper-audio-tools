// Everything you are likely to change lives here or in .env.local.
// [Bracketed] text is a placeholder: replace it before launch.

export const site = {
  name: 'Reaper Audio Tools',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'hello@reaperaudiotools.com',
  // Must match the seller name on your Paddle account exactly.
  sellerName: process.env.NEXT_PUBLIC_SELLER_NAME || 'Timothy Vogel',
  refundDays: process.env.NEXT_PUBLIC_REFUND_DAYS || '14',
  description: 'VST3 and AU plugins for Mac and Windows: EasyDuck (free), DrumCrusher and ModFX Pro.',
};

export const products = {
  easyduck: {
    slug: 'easyduck',
    code: '01',
    name: 'EasyDuck',
    suite: 'basic',
    tone: 'coral',
    status: 'available',
    kind: 'Sidechain emulator',
    tagline: 'Sidechain emulator that needs no input signal. Put it on any track, no routing.',
    formats: 'VST3 · AU',
    free: true,
    priceLabel: 'Free',
    image: '/images/easyduck.webp',
    ui: '/images/v2/easyduck-ui.webp',
  },
  drumcrusher: {
    slug: 'drumcrusher',
    code: '02',
    name: 'DrumCrusher',
    suite: 'basic',
    tone: 'cyan',
    status: 'available',
    kind: 'Drum bus processor',
    tagline: 'Drum bus processor with 3-band EQ, filters and per-band wet faders.',
    formats: 'VST3 · AU',
    price: 29,
    priceLabel: '$29',
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_DRUMCRUSHER || '',
    image: '/images/v2/drumcrusher-ui.webp',
    ui: '/images/v2/drumcrusher-ui.webp',
  },
  'modfx-pro': {
    slug: 'modfx-pro',
    code: '03',
    name: 'ModFX Pro',
    suite: 'pro',
    tone: 'indigo',
    status: 'available',
    kind: 'Performance FX board',
    tagline: 'Performance FX board with 16 knob slots, 45 effects and an XY pad for processing, drops and scratching.',
    formats: 'VST3 · AU',
    price: 29,
    priceLabel: '$29',
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_MODFX_PRO || '',
    image: '/images/v2/modfx-pro-ui.webp',
    ui: '/images/v2/modfx-pro-ui.webp',
  },
};

export const nav = [
  { label: 'Basic Suite', href: '/#plugins' },
  { label: 'Pro Suite', href: '/pro' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Your plugins', href: '/account' },
];

export const footerColumns = [
  { title: 'Basic Suite', links: [{ label: 'EasyDuck', href: '/plugins/easyduck' }, { label: 'DrumCrusher', href: '/plugins/drumcrusher' }] },
  { title: 'Pro Suite', links: [{ label: 'Overview', href: '/pro' }, { label: 'ModFX Pro', href: '/plugins/modfx-pro' }] },
  { title: 'Help', links: [{ label: 'Your plugins', href: '/account' }, { label: 'FAQ', href: '/#faq' }, { label: 'Contact', href: '/contact' }] },
  { title: 'Legal', links: [{ label: 'Terms', href: '/legal/terms' }, { label: 'Privacy', href: '/legal/privacy' }, { label: 'Refunds', href: '/legal/refunds' }] },
];
