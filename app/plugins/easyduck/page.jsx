import ProductPage from '../../../components/v2/ProductPage';
import EasyDuckDemo from '../../../components/EasyDuckDemo';
import Slate from '../../../components/Slate';
import { AudioDemo } from '../../../components/web';
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
    <ProductPage product={duck} art={art} features={features} faq={easyDuckFaq}
      lead="A sidechain emulation plugin that doesn't need an input signal. No routing or busses. Put it on any track to duck or pump that track."
      description={easyDuckDescription}>
      <section id="interface" className="v-dark v-section" style={{ paddingBottom: 'var(--v-section)', marginTop: 0 }}>
        <div className="v-wrap" style={{ display: 'grid', gap: 40 }}>
          <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
            <div className="v-eyebrow">Try it</div>
            <h2 className="v-h2">Try the interface</h2>
            <p className="v-body" style={{ fontSize: 18 }}>EasyDuck's interface, running in your browser. The controls work, but it doesn't make sound here.</p>
          </div>
          <div className="ratw" data-signature="coral" style={{ background: 'transparent' }}>
            <Slate interactive label="EasyDuck interface"><EasyDuckDemo /></Slate>
          </div>
        </div>
      </section>
      {audioExamples.length > 0 && (
        <section className="v-wrap v-section">
          <div className="v-grid2" style={{ alignItems: 'center', gap: 'clamp(32px, 5vw, 72px)' }}>
            <div style={{ display: 'grid', gap: 14, maxWidth: 460 }}>
              <div className="v-eyebrow">Listen</div>
              <h2 className="v-h2">Audio examples</h2>
              <p className="v-body">The same loop with EasyDuck off (DRY) and on (WET). It's on the chords and bass. The drums are untouched.</p>
            </div>
            <div className="ratw" data-signature="coral" style={{ display: 'grid', gap: 16, background: 'transparent' }}>
              {audioExamples.map((a, i) => <AudioDemo key={a.title} title={a.title} drySrc={a.drySrc} wetSrc={a.wetSrc} peaks={a.peaks} tone="coral" seed={7 + i * 12} />)}
            </div>
          </div>
        </section>
      )}
    </ProductPage>
  );
}
