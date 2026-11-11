import ProductPage from '../../../components/v2/ProductPage';
import { products } from '../../../lib/site';
import { drumCrusherFeatures as features, drumCrusherDescription } from '../../../lib/catalog';
import { drumCrusherFaq } from '../../../lib/faq';
import AudioExamples from '../../../components/v2/AudioExamples';
import { drumCrusherPeaks } from '../../../lib/drumCrusherPeaks';

const p = products.drumcrusher;

export const metadata = {
  title: 'DrumCrusher, drum bus processor plugin',
  description: drumCrusherDescription,
  alternates: { canonical: '/plugins/drumcrusher' },
  openGraph: { images: [p.ui] },
};


// Audio examples. Real drum loops (from Cappy) with WET run through the DrumCrusher DSP at its
// AMOUNT 85 on every band, DRIVE 30, CHARACTER as named. Files in /public/audio/drumcrusher.
const audioExamples = [
  { title: 'Tape mode', drySrc: '/audio/drumcrusher/tape-dry-3.mp3', wetSrc: '/audio/drumcrusher/tape-wet-3.mp3', peaks: drumCrusherPeaks.tape },
  { title: 'FET mode', drySrc: '/audio/drumcrusher/fet-dry-3.mp3', wetSrc: '/audio/drumcrusher/fet-wet-3.mp3', peaks: drumCrusherPeaks.fet },
  { title: 'Crush mode', drySrc: '/audio/drumcrusher/crush-dry-3.mp3', wetSrc: '/audio/drumcrusher/crush-wet-3.mp3', peaks: drumCrusherPeaks.crush },
];

export default function Page() {
  return (
    <ProductPage lead="Parallel compression for your drum bus. Three bands, five modes." description={drumCrusherDescription} product={p} specs={[['Extras', 'A/B compare']]} features={features} faq={drumCrusherFaq}>
      <AudioExamples examples={audioExamples} tone={p.tone}
        intro="Drum loops with DrumCrusher off and on. Flip DRY and WET." note="AMOUNT 85 · DRIVE 30" />
    </ProductPage>
  );
}
