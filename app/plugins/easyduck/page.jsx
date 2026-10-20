import { Header, Footer } from '../../../components/SiteChrome';
import Faq from '../../../components/Faq';
import BuyButton from '../../../components/BuyButton';
import EasyDuckDemo from '../../../components/EasyDuckDemo';
import { Button, Lcd, PriceTag, SectionHeading, AudioDemo, FeatureTile, Panel, ColorBand } from '../../../components/web';
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
        <section className="wrap hero" style={{ paddingTop: 64 }}>
          <div className="hero__copy">
            <a className="back" href="/#plugins">← INDEX</a>
            <div className="eyebrow"><span className="dot" aria-hidden="true"></span>01 / {duck.kind}</div>
            <h1 style={{ margin: 0 }}><img className="wordmark" src="/images/easyduck-wordmark.png" width="928" height="209" alt="EasyDuck" /></h1>
            <p className="lede">Sidechain ducking without a kick on another track. Draw the curve. Pick the rhythm. Done.</p>
            <div className="row" style={{ gap: 12 }}>
              <PriceTag price={duck.priceLabel} />
              <Lcd>{duck.formats}</Lcd>
            </div>
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <BuyButton product={duck} label="Buy EasyDuck" />
              <Button variant="soft" size="lg" href="#interface">Demo</Button>
            </div>
            <p className="fine">Checkout by Paddle. USD. Tax at checkout.</p>
          </div>
          <div className="hero__media">
            <img src={duck.image} width="1600" height="761" alt="EasyDuck: Trigger envelope on the left, ATTACK, DECAY, LENGTH and DEPTH knobs below, a 16-step pattern on the right" />
          </div>
        </section>

        <section id="interface" className="wrap section stack" style={{ scrollMarginTop: 24 }}>
          <SectionHeading eyebrow="Live" title="Interface" lede="The real interface, running in your browser. Drag anything." />
          <div className="scroller">
            <div className="plugin-frame"><EasyDuckDemo /></div>
          </div>
          <p className="fine" style={{ textAlign: 'center' }}>Visual only. Audio below.</p>
        </section>

        <section className="wrap section split" style={{ alignItems: 'center' }}>
          <SectionHeading eyebrow="Audio" title="Dry / Wet" lede="Same loop, same level. Flip it to hear what EasyDuck does." />
          <div>
            {/* Add drySrc and wetSrc (files in /public/audio) to make these play. */}
            <AudioDemo title="[Loop name, BPM]" tone="coral" seed={7} />
            <AudioDemo title="[Second loop, BPM]" tone="coral" seed={19} />
          </div>
        </section>

        <section className="wrap section stack">
          <SectionHeading eyebrow="Spec" title="Parameters" lede="Four knobs, one curve, one grid." />
          <div className="tiles">
            <FeatureTile tone="cyan" stat="1–150 ms" title="Attack">Hard click to slow swell. Knob and curve move together.</FeatureTile>
            <FeatureTile tone="indigo" stat="6 presets" title="Presets">Disco. Boom Bap. Rock. Deep House. Techno. Trance. Start from one, tweak from there.</FeatureTile>
            <FeatureTile tone="orange" stat="1/4 to 1/16" title="Grid">Triplets. Swing. 1 or 2 bars. Velocity per step.</FeatureTile>
            <FeatureTile tone="coral" stat="0 tracks" title="Routing">None. No ghost kick, no send. It runs its own pattern in time with your DAW.</FeatureTile>
          </div>
        </section>

        <section className="wrap section row" style={{ gap: 24, alignItems: 'flex-start' }}>
          <Panel title="Specs" style={{ flex: '1 1 420px' }}>
            <dl className="specs" style={{ margin: 0 }}>
              <dt>FORMATS</dt><dd><Lcd>{duck.formats}</Lcd></dd>
              <dt>SYSTEMS</dt><dd><Lcd>[macOS + Windows versions]</Lcd></dd>
              <dt>VERSION</dt><dd><Lcd>[v1.0]</Lcd></dd>
              <dt>LICENSE</dt><dd><Lcd>[N] computers</Lcd></dd>
            </dl>
          </Panel>
          <Panel title="Juice" tone="pink" tinted style={{ flex: '1 1 420px' }}>
            <div className="row" style={{ gap: 20, flexWrap: 'nowrap' }}>
              <img src="/images/juice-on.png" width="72" height="72" alt="Juice on" style={{ borderRadius: '50%', flex: 'none', boxShadow: '0 0 24px rgba(255, 59, 59, 0.5)' }} />
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--ink-soft)' }}>Tape. Saturation. Hiss. Wobble. The face bottom left. Click for dirt, click again for clean.</p>
            </div>
          </Panel>
        </section>

        <Faq items={easyDuckFaq} />

        <ColorBand tone="cyan" ticker={['02 DRUMCRUSHER', 'SOON']} padding="var(--space-8)">
          <div className="row" style={{ justifyContent: 'space-between', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, flex: '1 1 380px' }}>
              <div className="eyebrow">02 / Soon</div>
              <h2 style={{ margin: 0, font: '700 40px/1.05 var(--font-ui)', letterSpacing: '-1px' }}>DrumCrusher</h2>
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: 'var(--ink-soft)' }}>Drum bus processor. EQ, filters, faders and Juice in one window.</p>
            </div>
            <Button variant="color" tone="cyan" size="lg" href="/#drumcrusher">Notify me</Button>
          </div>
        </ColorBand>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema).replace(/</g, '\\u003c') }} />
    </div>
  );
}
