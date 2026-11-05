import ProductPage from '../../../components/v2/ProductPage';
import { products } from '../../../lib/site';
import { modFxFaq } from '../../../lib/faq';
import AudioExamples from '../../../components/v2/AudioExamples';
import { modFxPeaks } from '../../../lib/modFxPeaks';

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

// Audio examples. WET is the same 8-bar loop played through the ModFX Pro DSP with the XY
// pad moves written out ahead of time. Files in /public/audio/modfx-pro.
const audioExamples = [
  { title: 'Filter', drySrc: '/audio/modfx-pro/loop-dry.mp3', wetSrc: '/audio/modfx-pro/filter-wet.mp3', peaks: modFxPeaks.filter },
  { title: 'Beat Repeat and Tape Stop', drySrc: '/audio/modfx-pro/loop-dry.mp3', wetSrc: '/audio/modfx-pro/repeat-wet.mp3', peaks: modFxPeaks.repeat },
  { title: 'Vinyl Scratch', drySrc: '/audio/modfx-pro/loop-dry.mp3', wetSrc: '/audio/modfx-pro/scratch-wet.mp3', peaks: modFxPeaks.scratch },
];

export default function Page() {
  return (
    <ProductPage product={p} features={features} faq={modFxFaq}>
      <AudioExamples examples={audioExamples} tone={p.tone}
        intro={['One 92 BPM loop, played through ModFX Pro (WET) and without it (DRY). Each example is one XY pad move.',
          'Filter closes the low-pass over two bars and opens it again. Beat Repeat rolls the end of bar 4, then Tape Stop ends bar 8. Vinyl Scratch scratches the second half of bars 3, 4, 7 and 8.']} />
    </ProductPage>
  );
}
