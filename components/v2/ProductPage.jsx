import { Shell, Frame } from './Chrome';
import Faq from './Faq';
import BuyButton from './BuyButton';
import GetFreeForm from './GetFreeForm';
import Countdown from './Countdown';
import { site, launch } from '../../lib/site';
import { productSchema, breadcrumbSchema, jsonLd } from '../../lib/seo';

/** Shared layout for a plugin page: stone hero with the plugin, features, specs, FAQ. */
export default function ProductPage({ product: p, lead, art, features = [], children, faq, description, specs = [] }) {
  const computers = process.env.LICENSE_MAX_ACTIVATIONS || '2';
  const schema = [productSchema(p, { description, features }), breadcrumbSchema([['Home', '/'], [p.suite === 'pro' ? 'Pro Suite' : 'Basic Suite', p.suite === 'pro' ? '/pro' : '/basic'], [p.name, `/plugins/${p.slug}`]])];
  return (
    <Shell cta={p.free ? undefined : { label: launch.live ? `Buy ${p.name}` : 'Join the waitlist', href: '#buy' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)} />
      <section className="v-hero v-stone">
        <div className="v-wrap v-hero__in">
          <div className="v-hero__copy">
            <a className="v-back" href={p.suite === 'pro' ? '/pro' : '/basic'}>← {p.suite === 'pro' ? 'PRO SUITE' : 'BASIC SUITE'}</a>
            <div className="v-chip" style={{ alignSelf: 'flex-start' }}><span className="v-chip__dot" />{p.code} / {p.kind.toUpperCase()}</div>
            <h1 className="v-h1" style={{ fontSize: 'clamp(46px, 6vw, 80px)' }}>{p.name}</h1>
            <p className="v-lede">{lead || p.tagline}</p>
            <div id="buy" style={{ display: 'grid', gap: 14, scrollMarginTop: 110 }}>
              <div className="v-row" style={{ gap: 14 }}>
                <span className="v-price" style={{ fontSize: 30 }}>{p.free ? 'Free' : p.priceLabel}</span>
                <span className="v-tag v-tag--glass">{p.formats}</span>
              </div>
              {!p.free && !launch.live && <Countdown inline />}
              {p.free ? <GetFreeForm product={p} /> : <div><BuyButton product={p} addToCart /></div>}
              <p className="v-fine">{p.free ? 'No card needed.' : launch.live ? `One-time purchase. Works on ${computers} computers.` : "We'll email you the moment it's out."}</p>
            </div>
          </div>
          <div className="v-hero__art">{art || <Frame src={p.ui} alt={`${p.name} plugin`} style={{ borderRadius: 18 }} />}</div>
        </div>
      </section>

      {children}

      {features.length > 0 && (
        <section className="v-wrap v-section">
          <h2 className="v-h2" style={{ marginBottom: 'clamp(28px, 4vw, 44px)' }}>What's inside</h2>
          <div className="v-feats">
            {features.map((f) => (
              <div key={f.title} className="v-feat">
                {f.stat && <span className="v-feat__stat">{f.stat}</span>}
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
          <dl className="v-specrow">
            <div><dt>Formats</dt><dd>{p.formats.replace(/ · /g, ', ')}</dd></div>
            <div><dt>Runs on</dt><dd>Mac, Windows</dd></div>
            <div><dt>Price</dt><dd>{p.free ? 'Free' : `${p.priceLabel} once`}</dd></div>
            <div><dt>License</dt><dd>{computers} computers</dd></div>
            {specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            {!p.free && <div><dt>Refunds</dt><dd><a href="/legal/refunds">{site.refundDays} days</a></dd></div>}
          </dl>
        </section>
      )}

      {faq && <Faq items={faq} />}
    </Shell>
  );
}
