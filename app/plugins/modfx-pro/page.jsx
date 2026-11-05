import ProductPage from '../../../components/v2/ProductPage';
import { products } from '../../../lib/site';
import { modFxFaq } from '../../../lib/faq';

const p = products['modfx-pro'];

export const metadata = {
  title: 'ModFX Pro, performance FX plugin',
  description: 'ModFX Pro is a performance FX board for VST3 and AU: 16 knob slots, 45 effects and an XY pad for processing, drops and scratching. $29.',
  openGraph: { images: [p.ui] },
};

const features = [
  { stat: '16 SLOTS', title: 'Knob board', body: 'Up to 16 effects in series, each on its own knob slot, so you play them like hardware.' },
  { stat: '45 EFFECTS', title: 'Effect library', body: 'Filters, delays and reverbs, modulation, distortion, dynamics, rhythmic effects like stutter and tape stop, pitch, and stereo tools.' },
  { stat: 'XY PAD', title: 'Process, drops, scratch', body: 'Three XY pad modes: shape a sound, build a drop, or scratch it.' },
  { stat: 'PHONE', title: 'Phone companion', body: 'Scan the QR code in the plugin and play the XY pad from your phone browser. No app, no account. It stays on your Wi-Fi.' },
];

export default function Page() {
  return <ProductPage product={p} features={features} faq={modFxFaq} />;
}
