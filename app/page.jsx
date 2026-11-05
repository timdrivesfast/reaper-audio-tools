import { Shell, Frame } from '../components/v2/Chrome';
import BuyButton from '../components/v2/BuyButton';
import PluginCard from '../components/v2/PluginCard';
import Faq from '../components/v2/Faq';
import NotifyForm from '../components/v2/NotifyForm';
import { products, site } from '../lib/site';
import { homeFaq } from '../lib/faq';

const suites = [
  { id: 'basic', name: 'Basic Suite', title: 'Quick to learn', body: 'A light interface and a handful of controls per plugin. Load it, turn two knobs, move on.', href: '/plugins#basic', cta: 'See the Basic Suite' },
  { id: 'pro', name: 'Pro Suite', title: 'Deeper control', body: 'A dark interface with more to dig into, for performance and sound design.', href: '/pro', cta: 'Explore the Pro Suite', dark: true },
];

export default function Home() {
  const crusher = products.drumcrusher;
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
              <BuyButton product={products.drumcrusher} label="Buy DrumCrusher" />
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

      <section id="why" className="v-wrap v-section">
        <div className="v-grid2" style={{ gap: 'clamp(24px, 5vw, 72px)', alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="v-eyebrow">Why Reaper</div>
            <h2 className="v-h2">Pro sound without the setup.</h2>
          </div>
          <div style={{ display: 'grid', gap: 16, maxWidth: 520 }}>
            <p className="v-body" style={{ fontSize: 18 }}>Each plugin does one job. You get the controls you'd reach for anyway, labeled in plain words, so you can get a finished sound without reading a manual or building a routing chain.</p>
            <p className="v-body" style={{ fontSize: 18 }}>VST3 and AU for Mac and Windows. Pay once, keep it. No subscription.</p>
          </div>
        </div>
      </section>

      <section id="suites" className="v-wrap v-section">
        <div style={{ display: 'grid', gap: 14, marginBottom: 36 }}><div className="v-eyebrow">Two suites</div><h2 className="v-h2">Basic and Pro</h2></div>
        <div className="v-grid2">
          {suites.map((s) => (
            <a key={s.id} href={s.href} className={`v-suite ${s.dark ? 'v-dark' : 'v-stone'}`}>
              <div className="v-eyebrow">{s.name}</div>
              <h3 className="v-h3" style={{ fontSize: 30 }}>{s.title}</h3>
              <p className="v-body">{s.body}</p>
              <ul className="v-suite__list">
                {Object.values(products).filter((p) => p.suite === s.id).map((p) => (
                  <li key={p.slug}><span>{p.name}</span><span className="v-mono">{p.free ? 'FREE' : p.priceLabel}</span></li>
                ))}
              </ul>
              <span className="v-link" style={{ marginTop: 'auto' }}>{s.cta} <span className="v-mono">→</span></span>
            </a>
          ))}
        </div>
      </section>

      <section id="plugins" className="v-wrap v-section" style={{ scrollMarginTop: 90 }}>
        <div style={{ display: 'grid', gap: 14, marginBottom: 36 }}><div className="v-eyebrow">Plugins</div><h2 className="v-h2">All plugins</h2></div>
        <div className="v-grid3">
          {Object.values(products).map((p, i) => <PluginCard key={p.slug} product={p} index={i} />)}
        </div>
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
