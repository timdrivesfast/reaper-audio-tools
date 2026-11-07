import Header from './Header';
import { products, site, footerColumns, launch } from '../../lib/site';

const TICK = Object.values(products).map((p) => `${p.code} ${p.name.toUpperCase()}  •  ${p.free ? 'FREE · OUT NOW' : launch.live ? p.priceLabel : `${p.priceLabel} · ${launch.label.toUpperCase()}`}  •  `).join('');

export function Ticker({ text = TICK }) {
  return (
    <div className="v-ticker" aria-hidden="true">
      <div className="v-ticker__track"><span>{text.repeat(6)}</span><span>{text.repeat(6)}</span></div>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="v-footer">
      <div className="v-wrap v-footer__in">
        <div className="v-footer__cols">
          <div className="v-footer__brand">
            <img src="/images/v2/typemark.png" alt="Reaper Audio Tools" />
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
          </div>
          {footerColumns.map((c) => (
            <div key={c.title} className="v-footer__col">
              <div className="v-footer__title">{c.title.toUpperCase()}</div>
              {c.links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
            </div>
          ))}
        </div>
        <div className="v-footer__fine">© {year} {site.sellerName}, trading as Reaper Audio Tools. Payments are processed by Stripe.</div>
      </div>
    </footer>
  );
}

/** Page shell: ticker, header, content, footer. */
export function Shell({ children, cta }) {
  return (
    <div className="v2">
      <Ticker />
      <Header cta={cta} />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

/** A plugin screenshot in the raised bezel. */
export function Frame({ src, alt, style }) {
  return <div className="v-frame" style={style}><img src={src} alt={alt} /></div>;
}
