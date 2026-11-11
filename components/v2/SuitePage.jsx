import { Shell, Frame } from './Chrome';
import BuyButton from './BuyButton';
import { products } from '../../lib/site';
import { pluginListSchema, breadcrumbSchema, jsonLd } from '../../lib/seo';

/** A suite's page: a hero, then one band per plugin in the suite. Basic is light, Pro is dark. */
export default function SuitePage({ suite, title, lede, dark = false, cta }) {
  const list = Object.values(products).filter((p) => p.suite === suite);
  return (
    <Shell cta={cta}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd([pluginListSchema(title, list), breadcrumbSchema([['Home', '/'], [title, `/${suite}`]])])} />
      <section className={`v-hero ${dark ? 'v-dark' : 'v-stone'}`}>
        <div className="v-wrap v-hero__in" style={{ display: 'grid', gap: 20 }}>
          <div className="v-eyebrow">{list.length} {list.length === 1 ? 'plugin' : 'plugins'}</div>
          <h1 className="v-h1" style={{ color: dark ? '#fff' : undefined, maxWidth: 900 }}>{title}</h1>
          <p className="v-lede" style={{ color: dark ? '#C9CEDC' : undefined, maxWidth: 560 }}>{lede}</p>
        </div>
      </section>
      {list.map((p, i) => (
        <section key={p.slug} id={p.slug} className="v-wrap v-section" style={{ scrollMarginTop: 90 }}>
          <div className="v-band v-stone" style={{ backgroundPosition: i % 2 ? '30% 60%' : '60% 30%', flexDirection: i % 2 ? 'row-reverse' : 'row' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 440 }}>
              <div className="v-eyebrow">{p.code} / {p.kind}</div>
              <h2 className="v-h2">{p.name}</h2>
              <p className="v-lede" style={{ fontSize: 17 }}>{p.tagline}</p>
              <div className="v-row" style={{ gap: 14 }}><span className="v-price">{p.free ? 'Free' : p.priceLabel}</span><span className="v-tag v-tag--glass">{p.formats}</span></div>
              <div className="v-row" style={{ gap: 18 }}>
                {p.free
                  ? <a className="v-btn v-btn--dark v-btn--lg" href={`/plugins/${p.slug}#buy`}>Get {p.name} free</a>
                  : <BuyButton product={p} label={`Buy ${p.name}`} />}
                <a className="v-link" href={`/plugins/${p.slug}`}>Details <span className="v-mono">→</span></a>
              </div>
            </div>
            <a href={`/plugins/${p.slug}`} style={{ flex: '1.5 1 440px', minWidth: 0 }} aria-label={`${p.name} details`}><Frame src={p.ui} alt={`${p.name} plugin`} /></a>
          </div>
        </section>
      ))}
      <div style={{ height: 'var(--v-section)' }} />
    </Shell>
  );
}
