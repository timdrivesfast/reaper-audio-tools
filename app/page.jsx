import { Header, Footer } from '../components/SiteChrome';
import Faq from '../components/Faq';
import WaitlistForm from '../components/WaitlistForm';
import { Button, Lcd, SectionHeading, ProductCard, Panel, ColorBand } from '../components/web';
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
            <img src={duck.image} width="1600" height="761" alt="The EasyDuck plugin: Trigger envelope, four knobs, a 16-step pattern and the Juice toggle" />
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

        <section className="wrap section">
          <Panel tone="pink" tinted style={{ padding: 48 }}>
            <div className="juice">
              <div className="juice__faces">
                <img className="juice__off" src="/images/juice-off.png" width="120" height="120" alt="Juice off: the coral face" />
                <img className="juice__on" src="/images/juice-on.png" width="150" height="150" alt="Juice on: the angry red face" />
              </div>
              <div style={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="eyebrow">Standard in every plugin</div>
                <h2 style={{ margin: 0, font: '700 40px/1.05 var(--font-ui)', letterSpacing: '-1px' }}>Juice.</h2>
                <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: 'var(--ink-soft)', maxWidth: '52ch' }}>Tape. Saturation. Hiss. Wobble. The face in the corner of every plugin. Click for dirt, click again for clean.</p>
              </div>
            </div>
          </Panel>
        </section>

        <div id="drumcrusher" style={{ scrollMarginTop: 24 }}>
          <ColorBand tone="cyan" variant="full" ticker={['02 DRUMCRUSHER', 'SOON']}>
            <div className="band-split">
              <div>
                <div className="eyebrow" style={{ color: 'var(--on-color)' }}>02 / Soon</div>
                <h2 className="h2-band" style={{ color: 'var(--on-color)' }}>DrumCrusher</h2>
                <p style={{ margin: 0, fontSize: 20, lineHeight: 1.5, color: 'var(--on-color)', maxWidth: '40ch' }}>Drum bus processor. EQ, filters, faders and Juice in one window. Join the list to hear it first.</p>
              </div>
              <WaitlistForm list="drumcrusher" title="Waitlist" lede="One email when it ships." button="Join" />
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
