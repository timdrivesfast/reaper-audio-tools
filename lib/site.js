// Everything you are likely to change lives here or in .env.local.
// [Bracketed] text is a placeholder: replace it before launch.

export const site = {
  name: 'Reaper Audio Tools',
  // Canonical address. The bare domain redirects to www, so links in structured data and llms.txt use www.
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace('://reaperaudiotools.com', '://www.reaperaudiotools.com').replace(/\/$/, ''),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'hello@reaperaudiotools.com',
  // Your legal name, shown in the footer and the terms.
  sellerName: process.env.NEXT_PUBLIC_SELLER_NAME || 'Timothy Vogel',
  refundDays: process.env.NEXT_PUBLIC_REFUND_DAYS || '14',
  // Official social accounts. Linked in the footer and listed as sameAs in the structured data.
  social: [
    { label: 'Instagram', handle: '@reaperaudiotools', href: 'https://www.instagram.com/reaperaudiotools/' },
    { label: 'TikTok', handle: '@reaperaudiotools', href: 'https://www.tiktok.com/@reaperaudiotools' },
  ],
  description: 'VST3 and AU plugins for Mac and Windows: EasyDuck and DrumCrusher (both free) and ModFX Pro.',
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
    image: '/images/v2/easyduck-ui.webp',
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
    tagline: 'Drum bus processor with 3-band parallel compression, five character modes and per-band wet faders.',
    formats: 'VST3 · AU',
    free: true,
    priceLabel: 'Free',
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
    price: 50,
    priceLabel: '$50',
    image: '/images/v2/modfx-pro-ui.webp',
    ui: '/images/v2/modfx-pro-ui.webp',
  },
};

// Paid launch (ModFX Pro). Until `live` is true, paid plugins show a countdown and a waitlist form
// instead of Buy buttons. Flip `live` to true (and redeploy) at launch.
export const launch = {
  live: false,
  at: '2026-11-13T00:00:00-08:00', // midnight Thursday night / Friday 12:00 AM Pacific
  label: 'Fri 11.13',
  list: 'launch',
};

// Header links. `suites: true` is the Suites dropdown, built from the suites and products below.
export const nav = [
  { label: 'Suites', suites: true },
  { label: 'Your plugins', href: '/account' },
];

export const suites = [
  { id: 'basic', name: 'Basic Suite', href: '/basic', note: 'Light interface, quick to learn' },
  { id: 'pro', name: 'Pro Suite', href: '/pro', note: 'Deeper control, dark interface' },
];

export const footerColumns = [
  { title: 'Basic Suite', links: [{ label: 'Overview', href: '/basic' }, { label: 'EasyDuck', href: '/plugins/easyduck' }, { label: 'DrumCrusher', href: '/plugins/drumcrusher' }] },
  { title: 'Pro Suite', links: [{ label: 'Overview', href: '/pro' }, { label: 'ModFX Pro', href: '/plugins/modfx-pro' }] },
  { title: 'Help', links: [{ label: 'Your plugins', href: '/account' }, { label: 'FAQ', href: '/#faq' }, { label: 'Contact', href: '/contact' }] },
  { title: 'Legal', links: [{ label: 'Terms', href: '/legal/terms' }, { label: 'Privacy', href: '/legal/privacy' }, { label: 'Refunds', href: '/legal/refunds' }] },
];
