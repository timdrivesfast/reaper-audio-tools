import { Shell } from '../../components/v2/Chrome';
import { products, site } from '../../lib/site';

export const metadata = { title: 'Thanks for your order', robots: { index: false } };

export default function Thanks({ searchParams }) {
  const p = products[String(searchParams?.plugin || '')];
  return (
    <Shell>
      <div className="v-wrap v-page">
        <div className="v-panel" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="v-eyebrow">Order complete</div>
          <h1 className="v-h2">Thanks{p ? ` for getting ${p.name}` : ''}.</h1>
          <p className="v-lede" style={{ fontSize: 18 }}>Two emails are on the way: your receipt from Link (Stripe's checkout), and your license key with download links from us.</p>
          <p className="v-fine">Your plugins and downloads are also on <a href="/account" style={{ textDecoration: 'underline' }}>your account page</a>. Sign in with the email you used at checkout. Nothing there after 10 minutes? Check spam, then email {site.supportEmail}.</p>
          <div className="v-row"><a className="v-btn v-btn--dark v-btn--md" href="/account">Your plugins</a><a className="v-link" href="/">Back to home</a></div>
        </div>
      </div>
    </Shell>
  );
}
