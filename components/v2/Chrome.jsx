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

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" /></svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13.5 3v11.6a3.6 3.6 0 1 1-3.6-3.6" /><path d="M13.5 3c.4 2.7 2.4 4.6 5.2 4.8" /></svg>
);
const ICONS = { Instagram: InstagramIcon, TikTok: TikTokIcon };
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M4 7l8 6 8-6" /></svg>
);

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="v-footer">
      <div className="v-wrap v-footer__in">
        <div className="v-footer__cols">
          <div className="v-footer__brand">
            <img src="/images/v2/typemark.png" alt="Reaper Audio Tools" />
            <div className="v-footer__contact">
              <div className="v-footer__social">
                {(site.social || []).map((s) => { const Icon = ICONS[s.label]; return <a key={s.href} href={s.href} rel="me noopener" target="_blank" aria-label={`${s.label} ${s.handle}`}>{Icon && <Icon />}{s.label}</a>; })}
              </div>
              <a href={`mailto:${site.supportEmail}`}><MailIcon />{site.supportEmail}</a>
            </div>
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
