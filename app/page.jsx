import { Shell, Frame } from '../components/v2/Chrome';
import Faq from '../components/v2/Faq';
import NotifyForm from '../components/v2/NotifyForm';
import { products, site } from '../lib/site';
import { homeFaq } from '../lib/faq';

export default function Home() {
  const duck = products.easyduck, crusher = products.drumcrusher, modfx = products['modfx-pro'];
  const org = { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url, logo: `${site.url}/images/v2/typemark.png` };
  return (
    <Shell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />

      <section id="top" className="v-hero v-stone">
        <div className="v-wrap v-hero__in">
          <div className="v-hero__copy">
            <div className="v-row" style={{ gap: 10 }}>
              {Object.values(products).map((p) => <div key={p.slug} className="v-chip"><span className="v-chip__dot" />{p.code} / {p.name.toUpperCase()} / OUT NOW</div>)}
            </div>
            <h1 className="v-h1">Intuitive tools for <span style={{ color: 'var(--v-indigo)' }}>complex sounds.</span></h1>
            <p className="v-lede" style={{ maxWidth: 440 }}>Crafted by a team of audio engineers and industry professionals, Reaper Audio Tools are built to provide professional mixing solutions with an incredibly accessible form factor.</p>
            <div className="v-row">
              <a className="v-btn v-btn--dark v-btn--lg" href="/plugins/easyduck">Get EasyDuck free</a>
              <a className="v-link" href="/pro">Explore Pro <span className="v-mono">→</span></a>
            </div>
          </div>
          <a className="v-hero__art" href="/plugins/drumcrusher">
            <Frame src={crusher.ui} alt="DrumCrusher plugin" style={{ borderRadius: 18 }} />
            <div className="v-hero__caption">
              <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-.2px', color: '#111216' }}>DrumCrusher</span>
              <span style={{ fontSize: 14, color: '#3D414A' }}>{crusher.kind}</span>
              <span className="v-tag v-tag--dark">{crusher.priceLabel}</span>
              <span className="v-tag v-tag--glass">{crusher.formats}</span>
            </div>
          </a>
        </div>
      </section>

      <section id="plugins" className="v-wrap v-section" style={{ scrollMarginTop: 90 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 36 }}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="v-eyebrow">Basic Suite</div>
            <h2 className="v-h2">Plugins</h2>
          </div>
          <p className="v-body" style={{ maxWidth: 380 }}>EasyDuck is free. DrumCrusher is $29. Both come with Mac and Windows installers.</p>
        </div>
        <div className="v-grid2">
          {[duck, crusher].map((p, i) => (
            <article key={p.slug} id={p.slug} className="v-card">
              <div className="v-card__media v-stone" style={{ backgroundPosition: i ? '70% 60%' : '30% 40%' }}><Frame src={p.ui} alt={`${p.name} plugin`} /></div>
              <div className="v-card__body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><h3 className="v-h3">{p.name}</h3><span className="v-tag">{p.free ? 'FREE' : p.priceLabel}</span></div>
                <p className="v-body">{p.tagline}</p>
                <div className="v-card__foot">
                  <span className="v-mono" style={{ fontSize: 12, letterSpacing: '.06em', color: 'var(--v-ink-4)' }}>{p.formats}</span>
                  <a className="v-btn v-btn--dark v-btn--md" href={`/plugins/${p.slug}`}>Get {p.name}</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pro" className="v-wrap v-section">
        <a href="/pro" className="v-band v-stone" style={{ backgroundPosition: '60% 30%', color: '#111216' }}>
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 440 }}>
            <div className="v-eyebrow">Pro Suite</div>
            <h2 className="v-h2">{modfx.name}</h2>
            <p className="v-lede" style={{ fontSize: 17 }}>{modfx.tagline}</p>
            <span className="v-btn v-btn--dark v-btn--lg" style={{ alignSelf: 'flex-start', marginTop: 8 }}>Explore the Pro Suite <span className="v-mono">→</span></span>
          </div>
          <div style={{ flex: '1.5 1 440px', minWidth: 0 }}><Frame src={modfx.ui} alt="ModFX Pro plugin" /></div>
        </a>
      </section>

      <section id="notify" className="v-wrap v-section">
        <div className="v-grid2" style={{ gap: 'clamp(32px, 5vw, 72px)', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 520 }}>
            <div className="v-eyebrow">Newsletter</div>
            <h2 className="v-h2">Hear about new plugins first.</h2>
            <p className="v-body" style={{ fontSize: 18 }}>One email when a new plugin is released. Nothing else.</p>
          </div>
          <div className="v-notify">
            <img className="v-notify__sticker" src="/images/v2/sticker.webp" alt="" />
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 28, letterSpacing: '-.03em' }}>Get notified</h3>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, color: '#C9CEDC', maxWidth: 320 }}>We'll email you when the next plugin is out.</p>
            <NotifyForm list="newsletter" />
          </div>
        </div>
      </section>

      <Faq items={homeFaq} />
    </Shell>
  );
}
