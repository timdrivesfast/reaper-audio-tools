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
  { stat: '16 SLOTS', title: 'Knob board', body: 'Load up to 16 effects into knob slots and play them like hardware. Each slot shows its effect and value at a glance.' },
  { stat: '45 EFFECTS', title: 'Effect library', body: 'Filters, delays, reverb, tape echo, crush, flanger, tape stop, stutter, pitch, auto-pan and more.' },
  { stat: 'XY PAD', title: 'Process, drops, scratch', body: 'Three XY pad modes for shaping a sound, building drops and scratching, with hold, spring and touch behavior.' },
  { stat: 'PRESETS', title: 'Sets', body: 'Save a whole board as a set and recall it in one click.' },
];

export default function Page() {
  return <ProductPage product={p} features={features} faq={modFxFaq} />;
}
