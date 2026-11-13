import { Shell } from '../../components/v2/Chrome';
import { products, site } from '../../lib/site';
import { PurchaseDone } from '../../components/v2/Cart';

export const metadata = { title: 'Thanks for your order', robots: { index: false } };

export default function Thanks({ searchParams }) {
  const slugs = String(searchParams?.plugin || '').split(',').filter((s) => products[s]);
  const names = slugs.map((s) => products[s].name);
  const what = names.length ? ` for getting ${names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0]}` : '';
  return (
    <Shell>
      <div className="v-wrap v-page">
        <PurchaseDone slugs={slugs} session={String(searchParams?.session_id || '')} />
        <div className="v-panel" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="v-eyebrow">Order complete</div>
          <h1 className="v-h2">Thanks{what}.</h1>
          <p className="v-lede" style={{ fontSize: 18 }}>Two emails are on the way: your receipt from Link (Stripe's checkout), and your license key{slugs.length > 1 ? 's' : ''} with download links from us.</p>
          <p className="v-fine">Your plugins and downloads are also on <a href="/account" style={{ textDecoration: 'underline' }}>your account page</a>. Sign in with the email you used at checkout. Nothing there after 10 minutes? Check spam, then email {site.supportEmail}.</p>
          <div className="v-row"><a className="v-btn v-btn--dark v-btn--md" href="/account">Your plugins</a><a className="v-link" href="/">Back to home</a></div>
        </div>
      </div>
    </Shell>
  );
}
