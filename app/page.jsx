import { Header, Footer } from '../components/SiteChrome';
import Faq from '../components/Faq';
import WaitlistForm from '../components/WaitlistForm';
import Slate from '../components/Slate';
import EasyDuckDemo from '../components/EasyDuckDemo';
import DrumCrusherDemo from '../components/DrumCrusherDemo';
import { Button, Lcd, PriceTag, SectionHeading, ProductCard, ColorBand } from '../components/web';
import { products } from '../lib/site';
import { homeFaq } from '../lib/faq';

export default function Home() {
  const duck = products.easyduck;
  const crusher = products.drumcrusher;
  return (
    <div className="ratw" data-signature="coral">
      <Header />
      <main>
        <section className="wrap hero">
          <div className="hero__copy">
            <h1 className="display-xl">Audio plugins</h1>
            <p className="lede">VST3 and AU plugins for Mac and Windows.</p>
            <div className="catalogue"><span>01 / EASYDUCK / OUT NOW</span><span>02 / DRUMCRUSHER / SOON</span></div>
            <div className="row">
              <Button variant="color" tone="coral" size="lg" href="/plugins/easyduck">Get EasyDuck</Button>
              <Button variant="soft" size="lg" href="#plugins">All plugins</Button>
            </div>
          </div>
          <a className="hero__media" href="/plugins/easyduck" aria-label="EasyDuck, sidechain emulator">
            <Slate tilt label="The EasyDuck plugin: Trigger envelope, four knobs and a 16-step pattern" sticker={<img className="sticker sticker--tr" src="/images/sticker-calm.webp" width="624" height="640" alt="" />}>
              <EasyDuckDemo autoplay />
            </Slate>
            <div className="hero__caption">
              <span style={{ font: '600 17px/1.2 var(--font-ui)' }}>EasyDuck <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>· {duck.kind}</span></span>
              <span className="row" style={{ gap: 12, alignItems: 'baseline' }}>
                <PriceTag price={duck.priceLabel} small />
                <Lcd small>{duck.formats}</Lcd>
              </span>
            </div>
          </a>
        </section>

        <section id="plugins" className="wrap section stack" style={{ gap: 40, scrollMarginTop: 24 }}>
          <SectionHeading title="Plugins" />
          <div className="cards">
            <ProductCard name={duck.name} tone={duck.tone} tagline={duck.tagline} price={duck.priceLabel} formats={duck.formats} href="/plugins/easyduck" buyLabel="Get EasyDuck"
              media={<Slate label="EasyDuck plugin"><EasyDuckDemo /></Slate>} />
            <ProductCard name={crusher.name} tone={crusher.tone} tagline={crusher.tagline} status="soon" href="#drumcrusher"
              media={<Slate label="DrumCrusher concept"><DrumCrusherDemo animate={false} /></Slate>} />
          </div>
        </section>

        <div id="drumcrusher" style={{ scrollMarginTop: 24 }}>
          <ColorBand variant="screen" tone="cyan">
            <div className="band-split">
              <div>
                <div className="eyebrow">02 / In development</div>
                <h2 className="on-screen-title">DrumCrusher</h2>
                <p style={{ margin: 0, fontSize: 20, lineHeight: 1.5, maxWidth: '40ch' }}>Drum bus processor with 3-band EQ, high-pass and low-pass filters, and a wet fader per band. No release date yet.</p>
              </div>
              <div className="has-sticker">
                <img className="sticker sticker--tr" src="/images/sticker-angry.webp" width="640" height="639" alt="" />
                <WaitlistForm list="drumcrusher" title="Get notified" lede="We'll email you once when it's released." button="Notify me" />
              </div>
            </div>
          </ColorBand>
        </div>

        <div style={{ height: 'var(--space-9)' }} aria-hidden="true"></div>
        <Faq items={homeFaq} />
      </main>
      <Footer />
    </div>
  );
}
