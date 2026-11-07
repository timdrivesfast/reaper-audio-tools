import { Shell, Frame } from './Chrome';
import Faq from './Faq';
import BuyButton from './BuyButton';
import GetFreeForm from './GetFreeForm';
import Countdown from './Countdown';
import { site, launch } from '../../lib/site';

/** Shared layout for a plugin page: stone hero with the plugin, features, specs, FAQ. */
export default function ProductPage({ product: p, lead, art, features = [], children, faq, description }) {
  const computers = process.env.LICENSE_MAX_ACTIVATIONS || '2';
  const schema = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: p.name, applicationCategory: 'MultimediaApplication',
    operatingSystem: 'macOS, Windows', description: description || p.tagline, image: `${site.url}${p.ui}`,
    offers: { '@type': 'Offer', price: String(p.price || 0), priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: site.name },
  };
  return (
    <Shell cta={p.free ? undefined : { label: launch.live ? `Buy ${p.name}` : 'Join the waitlist', href: '#buy' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
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
              {!p.free && !launch.live && <div style={{ display: 'grid', gap: 10 }}><div className="v-eyebrow">Launches {launch.label}</div><Countdown /></div>}
              {p.free ? <GetFreeForm product={p} /> : <div><BuyButton product={p} /></div>}
              <p className="v-fine">{p.free
                ? "We'll email your license key and download links. No card needed."
                : launch.live
                  ? `One-time purchase. Your license key and download links arrive by email. Works on ${computers} computers.`
                  : `Join the waitlist and we'll email you the moment it's out. One-time purchase, ${p.priceLabel}.`}</p>
            </div>
          </div>
          <div className="v-hero__art">{art || <Frame src={p.ui} alt={`${p.name} plugin`} style={{ borderRadius: 18 }} />}</div>
        </div>
      </section>

      {children}

      {features.length > 0 && (
        <section className="v-wrap v-section">
          <div style={{ display: 'grid', gap: 14, marginBottom: 36 }}><div className="v-eyebrow">{p.name}</div><h2 className="v-h2">Controls</h2></div>
          <div className="v-tiles">
            {features.map((f) => (
              <div key={f.title} className="v-tile">
                {f.stat && <span className="v-tag" style={{ justifySelf: 'start' }}>{f.stat}</span>}
                <h3>{f.title}</h3>
                <p className="v-body">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="v-wrap v-section">
        <div className="v-faq">
          <h2 className="v-h2">Specs</h2>
          <dl className="v-specs" style={{ gridColumn: 'span 2' }}>
            <dt>Formats</dt><dd>{p.formats.replace(/ · /g, ', ')}</dd>
            <dt>Platforms</dt><dd>Mac (VST3, AU), Windows (VST3)</dd>
            <dt>Price</dt><dd>{p.free ? 'Free' : `${p.priceLabel}, one-time`}</dd>
            <dt>License</dt><dd>{computers} computers per license</dd>
            {!p.free && <><dt>Refunds</dt><dd>Within {site.refundDays} days. <a href="/legal/refunds" style={{ textDecoration: 'underline' }}>Refund policy</a></dd></>}
          </dl>
        </div>
      </section>

      {faq && <Faq items={faq} />}
    </Shell>
  );
}
