import ProductPage from '../../../components/v2/ProductPage';
import { products } from '../../../lib/site';
import { modFxFeatures as features, modFxDescription } from '../../../lib/catalog';
import { modFxFaq } from '../../../lib/faq';
import AudioExamples from '../../../components/v2/AudioExamples';
import PhoneCompanion, { Phone } from '../../../components/v2/PhoneCompanion';
import { Frame } from '../../../components/v2/Chrome';
import { modFxPeaks } from '../../../lib/modFxPeaks';

const p = products['modfx-pro'];

export const metadata = {
  title: 'ModFX Pro, performance FX plugin',
  description: modFxDescription,
  alternates: { canonical: '/plugins/modfx-pro' },
  openGraph: { images: [p.ui] },
};


// Audio examples. WET is the same 8-bar loop played through the ModFX Pro DSP with the XY
// pad moves written out ahead of time. Files in /public/audio/modfx-pro.
const audioExamples = [
  { title: 'Filter', drySrc: '/audio/modfx-pro/loop-dry.mp3', wetSrc: '/audio/modfx-pro/filter-wet.mp3', peaks: modFxPeaks.filter },
  { title: 'Beat Repeat and Tape Stop', drySrc: '/audio/modfx-pro/loop-dry.mp3', wetSrc: '/audio/modfx-pro/repeat-wet.mp3', peaks: modFxPeaks.repeat },
  { title: 'Vinyl Scratch', drySrc: '/audio/modfx-pro/loop-dry.mp3', wetSrc: '/audio/modfx-pro/scratch-wet.mp3', peaks: modFxPeaks.scratch },
];

export default function Page() {
  return (
    <ProductPage description={modFxDescription} product={p} features={features} faq={modFxFaq}
      lead="16 knobs, 45 effects and an XY pad you can play from your phone."
      art={<div className="v-heroduo"><Frame src={p.ui} alt="ModFX Pro plugin" style={{ borderRadius: 18 }} /><Phone src="/images/v2/modfx-phone-process.webp" alt="The ModFX Pro XY pad on a phone" /></div>}>
      <PhoneCompanion />
      <AudioExamples examples={audioExamples} tone={p.tone}
        intro="One loop, one XY pad move per example. Flip DRY and WET." note="92 BPM" />
    </ProductPage>
  );
}
