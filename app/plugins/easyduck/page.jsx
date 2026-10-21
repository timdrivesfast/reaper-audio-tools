import { Header, Footer } from '../../../components/SiteChrome';
import Faq from '../../../components/Faq';
import GetFreeForm from '../../../components/GetFreeForm';
import EasyDuckDemo from '../../../components/EasyDuckDemo';
import Slate from '../../../components/Slate';
import { Button, Lcd, PriceTag, SectionHeading, AudioDemo, FeatureTile, ColorBand } from '../../../components/web';
import { products, site } from '../../../lib/site';
import { easyDuckFaq } from '../../../lib/faq';

const duck = products.easyduck;
const licenseComputers = process.env.LICENSE_MAX_ACTIVATIONS || '2';

// Audio examples: add { title, drySrc, wetSrc } entries (files in /public/audio) and the section appears.
const audioExamples = [];

export const metadata = {
  title: 'EasyDuck, sidechain emulator plugin',
  description: "EasyDuck is a sidechain emulation plugin for VST3 and AU. It needs no input signal, so there's no routing. Put it on any track to duck or pump it.",
  openGraph: { images: [duck.image] },
};

export default function EasyDuckPage() {
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'EasyDuck',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'macOS, Windows',
    description: "EasyDuck is a sidechain emulation plugin for VST3 and AU. It needs no input signal, so there's no routing. Put it on any track to duck or pump it.",
    image: `${site.url}${duck.image}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: site.name },
  };
  return (
    <div className="ratw" data-signature="coral">
      <Header ticker={['01 EASYDUCK', 'SIDECHAIN', 'REAPER AUDIO TOOLS']} />
      <main>
        <section className="wrap hero" style={{ paddingTop: 64 }}>
          <div className="hero__copy">
            <a className="back" href="/#plugins">← ALL PLUGINS</a>
            <div className="eyebrow"><span className="dot" aria-hidden="true"></span>01 / {duck.kind}</div>
            <h1 className="display-xl" style={{ fontSize: 'clamp(48px, 7vw, 80px)' }}>EasyDuck</h1>
            <p className="lede">A sidechain emulation plugin that doesn't need an input signal. No routing or busses. Put it on any track to duck or pump that track.</p>
            <div className="row" style={{ gap: 14, alignItems: 'baseline' }}>
              <PriceTag price={duck.priceLabel} />
              <Lcd small>{duck.formats}</Lcd>
            </div>
            <GetFreeForm product={duck} />
            <p className="fine">We'll email your license key and download links. No card needed. <a href="#interface">Try the interface first</a>.</p>
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
                <h2 className="on-screen-title">Try the interface</h2>
                <p style={{ margin: 0, fontSize: 20, lineHeight: 1.5 }}>EasyDuck's interface, running in your browser. The controls work, but it doesn't make sound here.</p>
              </div>
              <Slate interactive label="EasyDuck interface" sticker={<img className="sticker sticker--out" src="/images/sticker-angry.webp" width="640" height="639" alt="" />}>
                <EasyDuckDemo />
              </Slate>
            </div>
          </ColorBand>
        </div>

        <div style={{ height: 'var(--space-9)' }} aria-hidden="true"></div>
        {audioExamples.length > 0 && (
          <section className="wrap section split" style={{ alignItems: 'center' }}>
            <SectionHeading title="Audio examples" lede="The same loop with EasyDuck off (DRY) and on (WET)." />
            <div>
              {audioExamples.map((a, i) => <AudioDemo key={a.title} title={a.title} drySrc={a.drySrc} wetSrc={a.wetSrc} tone="coral" seed={7 + i * 12} />)}
            </div>
          </section>
        )}

        <section className="wrap section stack">
          <SectionHeading title="Controls" />
          <div className="tiles tiles--3">
            <FeatureTile tone="cyan" stat="4 KNOBS" title="Trigger envelope">Shape the duck like a kick. A hard attack and deep cut for boom bap, or a softer pump with a longer decay for house. Attack 1 to 150 ms, Decay 20 to 600 ms, Length 0 to 300 ms, Depth 0 to 100%.</FeatureTile>
            <FeatureTile tone="orange" stat="UP TO 1/16" title="Pattern">Velocity per step, swing and triplets. 1/4, 1/8 or 1/16 notes across 1 or 2 bars.</FeatureTile>
            <FeatureTile tone="lime" stat="HOST CLOCK" title="Sync">Follows your DAW's tempo and time signature. Set them by hand when running standalone.</FeatureTile>
            <FeatureTile tone="lilac" stat="ANALOG" title="Juice">Adds a little analog bump and noise to push the pump and add grit.</FeatureTile>
            <FeatureTile tone="indigo" stat="6 PRESETS" title="Presets">Disco, Boom Bap, Rock, Deep House, Techno and Trance.</FeatureTile>
          </div>
        </section>

        <section className="wrap section stack" style={{ gap: 28 }}>
          <SectionHeading title="Specs" />
          <dl className="specs">
            <dt>Formats</dt><dd>{duck.formats.replace(/ · /g, ', ')}</dd>
            <dt>Platforms</dt><dd>Mac (VST3, AU), Windows (VST3)</dd>
            <dt>Price</dt><dd>Free</dd>
            <dt>License</dt><dd>{licenseComputers} computers per license</dd>
          </dl>
        </section>

        <Faq items={easyDuckFaq} />

        <ColorBand tone="cyan" padding="var(--space-8)">
          <div className="row" style={{ justifyContent: 'space-between', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, flex: '1 1 380px' }}>
              <div className="eyebrow">02 / In development</div>
              <h2 className="h2">DrumCrusher</h2>
              <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: 'var(--ink-soft)' }}>Drum bus processor with 3-band EQ, high-pass and low-pass filters, and a wet fader per band. No release date yet.</p>
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
