import { Header, Footer } from '../components/SiteChrome';
import Faq from '../components/Faq';
import WaitlistForm from '../components/WaitlistForm';
import { Button, Lcd, SectionHeading, ProductCard, ColorBand } from '../components/web';
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
            <div className="eyebrow"><span className="dot" aria-hidden="true"></span>Reaper Audio Tools / Lab</div>
            <h1 className="display-xl">Precision audio tools.</h1>
            <p className="lede">Plugins for every producer. Everyday tools to ignite your sound.</p>
            <div className="catalogue"><span>01 / EASYDUCK / OUT NOW</span><span>02 / DRUMCRUSHER / SOON</span></div>
            <div className="row">
              <Button variant="color" tone="coral" size="lg" href="/plugins/easyduck">Shop 01</Button>
              <Button variant="soft" size="lg" href="#plugins">Index</Button>
            </div>
          </div>
          <a className="hero__media" href="/plugins/easyduck">
            <img className="sticker sticker--tr" src="/images/sticker-calm.webp" width="624" height="640" alt="" />
            <img src={duck.image} width="1600" height="761" alt="The EasyDuck plugin: Trigger envelope, four knobs, and a 16-step pattern" />
            <div className="row" style={{ justifyContent: 'space-between', padding: '16px 8px 4px' }}>
              <span style={{ font: '600 17px/1.2 var(--font-ui)' }}>EasyDuck <span style={{ color: 'var(--ink-muted)', fontWeight: 400 }}>· {duck.kind}</span></span>
              <span className="row" style={{ gap: 10 }}>
                <Lcd size="price" small>{duck.priceLabel}</Lcd>
                <Lcd>{duck.formats}</Lcd>
              </span>
            </div>
          </a>
        </section>

        <section id="plugins" className="wrap section stack" style={{ gap: 40, scrollMarginTop: 24 }}>
          <SectionHeading eyebrow="Index" title="Plugins" lede="One job per plugin. VST3 / AU / AUv3 on Mac, Windows and iPad." />
          <div className="cards">
            <ProductCard name={duck.name} tone={duck.tone} tagline={duck.tagline} image={duck.image} imageAlt="EasyDuck plugin" price={duck.priceLabel} formats={duck.formats} href="/plugins/easyduck" />
            <ProductCard name={crusher.name} tone={crusher.tone} tagline={crusher.tagline} image={crusher.image} imageAlt="DrumCrusher concept" status="soon" href="#drumcrusher" />
          </div>
        </section>


        <div id="drumcrusher" style={{ scrollMarginTop: 24 }}>
          <ColorBand tone="cyan" variant="full">
            <div className="band-split">
              <div>
                <div className="eyebrow" style={{ color: 'var(--on-color)' }}>02 / Soon</div>
                <h2 className="h2-band" style={{ color: 'var(--on-color)' }}>DrumCrusher</h2>
                <p style={{ margin: 0, fontSize: 20, lineHeight: 1.5, color: 'var(--on-color)', maxWidth: '40ch' }}>Drum bus processor. EQ, filters and faders in one window. Join the list to hear it first.</p>
              </div>
              <div className="has-sticker">
                <img className="sticker sticker--tr" src="/images/sticker-angry.webp" width="640" height="639" alt="" />
                <WaitlistForm list="drumcrusher" title="Waitlist" lede="One email when it ships." button="Join" />
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
