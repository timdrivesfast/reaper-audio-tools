import AudioExamples from '../../../components/v2/AudioExamples';
import ProductPage from '../../../components/v2/ProductPage';
import EasyDuckDemo from '../../../components/EasyDuckDemo';
import Slate from '../../../components/Slate';
import { products } from '../../../lib/site';
import { easyDuckFeatures as features, easyDuckDescription } from '../../../lib/catalog';
import { easyDuckFaq } from '../../../lib/faq';
import { audioPeaks } from '../../../lib/audioPeaks';

const duck = products.easyduck;

// Audio examples. WET is the DRY loop with the chords and bass run through the EasyDuck
// v1.2.0 DSP at the named preset; the drums are the same in both. Files in /public/audio.
const audioExamples = [
  { title: 'Deep House preset, 124 BPM', drySrc: '/audio/easyduck/house-dry.mp3', wetSrc: '/audio/easyduck/house-wet.mp3', peaks: audioPeaks.house },
  { title: 'Techno preset, 130 BPM', drySrc: '/audio/easyduck/techno-dry.mp3', wetSrc: '/audio/easyduck/techno-wet.mp3', peaks: audioPeaks.techno },
];

export const metadata = {
  title: 'EasyDuck, sidechain emulator plugin',
  description: easyDuckDescription,
  alternates: { canonical: '/plugins/easyduck' },
  openGraph: { images: [duck.image] },
};


export default function EasyDuckPage() {
  const art = (
    <div className="ratw" data-signature="coral" style={{ background: 'transparent' }}>
      <Slate tilt label="EasyDuck: Trigger envelope on the left, Attack, Decay, Length and Depth knobs below, a 16-step pattern on the right">
        <EasyDuckDemo autoplay />
      </Slate>
    </div>
  );
  return (
    <ProductPage product={duck} specs={[['Tempo', 'Syncs to your DAW']]} art={art} features={features} faq={easyDuckFaq}
      lead="Sidechain pumping without the sidechain. Put it on any track. No routing."
      description={easyDuckDescription}>
      <section id="interface" className="v-dark v-section" style={{ paddingBottom: 'var(--v-section)', marginTop: 0 }}>
        <div className="v-wrap" style={{ display: 'grid', gap: 40 }}>
          <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
            <div className="v-eyebrow">Try it</div>
            <h2 className="v-h2">Try the interface</h2>
            <p className="v-body" style={{ fontSize: 18 }}>Click around. No sound here.</p>
          </div>
          <div className="ratw" data-signature="coral" style={{ background: 'transparent' }}>
            <Slate interactive label="EasyDuck interface"><EasyDuckDemo /></Slate>
          </div>
        </div>
      </section>
      <AudioExamples examples={audioExamples} tone="coral" intro="EasyDuck on the chords and bass. Flip DRY and WET." />
    </ProductPage>
  );
}
