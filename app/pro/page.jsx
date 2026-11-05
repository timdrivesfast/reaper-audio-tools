import { Shell, Frame } from '../../components/v2/Chrome';
import BuyButton from '../../components/v2/BuyButton';
import { products } from '../../lib/site';

export const metadata = {
  title: 'Pro Suite',
  description: 'Reaper Audio Tools Pro Suite: paid plugins with deeper control and a dark interface. ModFX Pro is out now.',
};

export default function Pro() {
  const pro = Object.values(products).filter((p) => p.suite === 'pro');
  return (
    <Shell cta={{ label: 'Buy ModFX Pro', href: '/plugins/modfx-pro#buy' }}>
      <section className="v-hero v-dark">
        <div className="v-wrap v-hero__in" style={{ display: 'grid', gap: 20 }}>
          <div className="v-eyebrow">Pro Suite</div>
          <h1 className="v-h1" style={{ color: '#fff', maxWidth: 900 }}>Pro Suite</h1>
          <p className="v-lede" style={{ color: '#C9CEDC', maxWidth: 560 }}>Paid plugins with deeper control and a dark interface. ModFX Pro is the first one. Each plugin is a one-time purchase.</p>
        </div>
      </section>
      {pro.map((p) => (
        <section key={p.slug} id={p.slug} className="v-wrap v-section" style={{ scrollMarginTop: 90 }}>
          <div className="v-band v-stone" style={{ backgroundPosition: '60% 30%' }}>
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 440 }}>
              <div className="v-eyebrow">{p.code} / {p.kind}</div>
              <h2 className="v-h2">{p.name}</h2>
              <p className="v-lede" style={{ fontSize: 17 }}>{p.tagline}</p>
              <div className="v-row" style={{ gap: 14 }}><span className="v-price">{p.priceLabel}</span><span className="v-tag v-tag--glass">{p.formats}</span></div>
              <div className="v-row" style={{ gap: 18 }}>
                <BuyButton product={p} label={`Buy ${p.name}`} />
                <a className="v-link" href={`/plugins/${p.slug}`}>Details <span className="v-mono">→</span></a>
              </div>
            </div>
            <div style={{ flex: '1.5 1 440px', minWidth: 0 }}><Frame src={p.ui} alt={`${p.name} plugin`} /></div>
          </div>
        </section>
      ))}
      <div style={{ height: 'var(--v-section)' }} />
    </Shell>
  );
}
