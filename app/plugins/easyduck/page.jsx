import { Header, Footer } from '../../../components/SiteChrome';
import Faq from '../../../components/Faq';
import BuyButton from '../../../components/BuyButton';
import EasyDuckDemo from '../../../components/EasyDuckDemo';
import Slate from '../../../components/Slate';
import Tape from '../../../components/Tape';
import { Button, Lcd, PriceTag, SectionHeading, AudioDemo, FeatureTile, ColorBand } from '../../../components/web';
import { products, site } from '../../../lib/site';
import { easyDuckFaq } from '../../../lib/faq';

const duck = products.easyduck;

export const metadata = {
  title: 'EasyDuck, sidechain emulator plugin',
  description: 'EasyDuck is a sidechain emulator plugin for VST3, AU and AUv3. Draw the duck curve, pick the rhythm, no kick routing needed.',
  openGraph: { images: [duck.image] },
};

export default function EasyDuckPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EasyDuck',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'macOS, Windows, iPadOS',
    description: 'Sidechain emulator plugin. Draw the duck curve and pick the rhythm, with no kick routing needed. VST3, AU and AUv3.',
    image: `${site.url}${duck.image}`,
    publisher: { '@type': 'Organization', name: site.name },
  };
  return (
    <div className="ratw" data-signature="coral">
      <Header ticker={['01 EASYDUCK', 'SIDECHAIN', 'REAPER AUDIO TOOLS']} />
      <main>
        <section className="wrap hero tape-host" style={{ paddingTop: 64 }}>
          <Tape items={['01 EASYDUCK', 'SIDECHAIN EMULATOR', 'NO ROUTING']} angle={-3} bottom="clamp(18px, 4.5vw, 72px)" />
          <div className="hero__copy">
            <a className="back" href="/#plugins">← ALL PLUGINS</a>
            <div className="eyebrow"><span className="dot" aria-hidden="true"></span>01 / {duck.kind}</div>
            <h1 className="display-xl" style={{ fontSize: 'clamp(48px, 7vw, 80px)' }}>EasyDuck</h1>
            <p className="lede">Sidechain ducking without routing a kick from another track. Draw the curve, pick the rhythm, done.</p>
            <div className="row" style={{ gap: 14, alignItems: 'baseline' }}>
              <PriceTag price={duck.priceLabel} />
              <Lcd small>{duck.formats}</Lcd>
            </div>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <BuyButton product={duck} label="Buy EasyDuck" />
              <Button variant="soft" size="lg" href="#interface">Try it in your browser</Button>
            </div>
            <p className="fine">Secure checkout by Paddle. Prices in USD, tax added at checkout.</p>
          </div>
          <div className="hero__media">
            <Slate tilt label="EasyDuck: Trigger envelope on the left, Attack, Decay, Length and Depth knobs below, a 16-step pattern on the right">
              <EasyDuckDemo autoplay />
            </Slate>
          </div>
        </section>

        <div id="interface" style={{ scrollMarginTop: 24 }}>
          <ColorBand variant="screen" tone="coral">
            <div className="stack" style={{ gap: 48 }}>
              <div style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
                <div className="eyebrow">Live demo</div>
                <h2 className="on-screen-title">Play with the real interface.</h2>
                <p style={{ margin: 0, fontSize: 20, lineHeight: 1.5 }}>Drag the curve, turn the knobs, change the pattern. This is the plugin's own UI running in your browser. It doesn't make sound here; the audio examples are below.</p>
              </div>
              <Slate interactive label="EasyDuck interface" sticker={<img className="sticker sticker--out" src="/images/sticker-angry.webp" width="640" height="639" alt="" />}>
                <EasyDuckDemo />
              </Slate>
            </div>
          </ColorBand>
        </div>

        <div style={{ height: 'var(--space-9)' }} aria-hidden="true"></div>
        <section className="wrap section split" style={{ alignItems: 'center' }}>
          <SectionHeading eyebrow="Audio" title="Hear the difference" lede="The same loop at the same level, with EasyDuck off and on. Switch between DRY and WET." />
          <div>
            {/* Add drySrc and wetSrc (files in /public/audio) to make these play. */}
            <AudioDemo title="[Loop name, BPM]" tone="coral" seed={7} />
            <AudioDemo title="[Second loop, BPM]" tone="coral" seed={19} />
          </div>
        </section>

        <section className="wrap section stack">
          <SectionHeading eyebrow="Controls" title="What you get" lede="Four knobs, one curve, one step grid." />
          <div className="tiles">
            <FeatureTile tone="cyan" stat="1–150 MS" title="Attack">From a hard click to a slow swell. The knob and the curve move together.</FeatureTile>
            <FeatureTile tone="indigo" stat="6 PRESETS" title="Presets">Disco, Boom Bap, Rock, Deep House, Techno and Trance. Start from one and adjust.</FeatureTile>
            <FeatureTile tone="orange" stat="1/4 – 1/16" title="Step grid">Triplets, swing, one or two bars, and velocity per step.</FeatureTile>
            <FeatureTile tone="coral" stat="0 SENDS" title="No routing">No ghost kick and no send. It runs its own pattern in time with your DAW.</FeatureTile>
          </div>
        </section>

        <section className="wrap section stack" style={{ gap: 28 }}>
          <SectionHeading eyebrow="Specs" title="Tech specs" />
          <dl className="specs">
            <dt>Formats</dt><dd>{duck.formats.replace(/ · /g, ', ')}</dd>
            <dt>Systems</dt><dd>[macOS + Windows versions]</dd>
            <dt>Version</dt><dd>[v1.0]</dd>
            <dt>License</dt><dd>[N] computers per license</dd>
          </dl>
        </section>

        <Faq items={easyDuckFaq} />

        <ColorBand tone="cyan" padding="var(--space-8)">
          <div className="row" style={{ justifyContent: 'space-between', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, flex: '1 1 380px' }}>
              <div className="eyebrow">02 / In development</div>
              <h2 className="h2">DrumCrusher</h2>
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: 'var(--ink-soft)' }}>A drum bus processor. Three-band EQ, filters and faders in one window.</p>
            </div>
            <Button variant="color" tone="cyan" size="lg" href="/#drumcrusher">Get notified</Button>
          </div>
        </ColorBand>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, '\\u003c') }} />
    </div>
  );
}
