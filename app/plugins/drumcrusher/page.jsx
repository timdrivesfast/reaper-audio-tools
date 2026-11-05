import ProductPage from '../../../components/v2/ProductPage';
import { products } from '../../../lib/site';
import { drumCrusherFaq } from '../../../lib/faq';
import AudioExamples from '../../../components/v2/AudioExamples';
import { drumCrusherPeaks } from '../../../lib/drumCrusherPeaks';

const p = products.drumcrusher;

export const metadata = {
  title: 'DrumCrusher, drum bus processor plugin',
  description: 'DrumCrusher is a drum bus processor for VST3 and AU: 3-band parallel compression with five character modes, filters and per-band wet faders. $25.',
  openGraph: { images: [p.ui] },
};

const features = [
  { stat: '3 BANDS', title: 'Parallel compression', body: 'HI, MID and LO bands, each with its own Amount, Freq and Wet, plus solo and mute. Squash the lows and leave the hats open.' },
  { stat: '5 MODES', title: 'Character', body: 'Tape (the default), Tube, FET, VCA and Crush. Crush goes wild inside the band but stays level-matched.' },
  { stat: 'MASTER', title: 'Mix, Drive and Air', body: 'Mix blends crushed and dry drums. Drive pushes the bus. Air adds a short room that ducks under the hits, plus a gentle top-end lift.' },
  { stat: 'HPF · LPF', title: 'Filters', body: 'High-pass and low-pass on the compressed signal only, so the dry drums keep their full range.' },
  { stat: 'A / B', title: 'Compare', body: 'Two settings slots, saved with your session. Flip between them to hear which sits better.' },
];

// Audio examples. WET is the same boom bap loop with the drums run through the DrumCrusher
// DSP at the named settings (everything else at its default, OUT at 0 dB). The keys are the
// same in both. Files in /public/audio/drumcrusher.
const audioExamples = [
  { title: 'Tape mode, 88 BPM', drySrc: '/audio/drumcrusher/tape-dry.mp3', wetSrc: '/audio/drumcrusher/tape-wet.mp3', peaks: drumCrusherPeaks.tape },
  { title: 'FET mode, 92 BPM', drySrc: '/audio/drumcrusher/fet-dry.mp3', wetSrc: '/audio/drumcrusher/fet-wet.mp3', peaks: drumCrusherPeaks.fet },
  { title: 'Crush mode, 88 BPM', drySrc: '/audio/drumcrusher/crush-dry.mp3', wetSrc: '/audio/drumcrusher/crush-wet.mp3', peaks: drumCrusherPeaks.crush },
];

export default function Page() {
  return (
    <ProductPage product={p} features={features} faq={drumCrusherFaq}>
      <AudioExamples examples={audioExamples} tone={p.tone}
        intro={["Boom bap loops with DrumCrusher off (DRY) and on (WET). It's on the drums. The keys are untouched.",
          'Tape: Mix 75, Drive 55. FET: Mix 80, Drive 55. Crush: Mix 75, Drive 70. Everything else is at its default.']} />
    </ProductPage>
  );
}
