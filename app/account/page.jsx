import { Header, Footer } from '../../components/SiteChrome';
import SignInForm from '../../components/SignInForm';
import { Button, Lcd, Panel } from '../../components/web';
import { db } from '../../lib/server/supabase';
import { likeExact, sessionEmail } from '../../lib/server/auth';
import { latestRelease, noteLines } from '../../lib/server/releases';
import { products } from '../../lib/site';

export const metadata = { title: 'Your plugins', robots: { index: false } };
export const dynamic = 'force-dynamic';

const PLATFORMS = [['mac', 'Download for Mac'], ['windows', 'Download for Windows']];

async function loadAccount(email) {
  const supabase = db();
  const { data: licenses } = await supabase
    .from('licenses')
    .select('id, key, product, status, max_activations, created_at, activations ( id, machine_name, last_seen_at )')
    .ilike('email', likeExact(email))
    .eq('status', 'active')
    .order('created_at', { ascending: true });
  const list = (licenses || []).filter((l) => products[l.product]);
  const slugs = [...new Set(list.map((l) => l.product))];
  const releases = Object.fromEntries(await Promise.all(slugs.map(async (s) => [s, await latestRelease(s)])));
  return { licenses: list, releases };
}

function SignIn({ product, expired }) {
  const p = product && products[product];
  return (
    <Panel style={{ maxWidth: 640, margin: '0 auto', padding: 40 }}>
      <h1 style={{ margin: 0, font: '700 clamp(36px, 5vw, 48px)/1 var(--font-ui)', letterSpacing: '-1.4px' }}>Your plugins</h1>
      {expired && <p role="alert" style={{ margin: 0, fontSize: 17, color: 'var(--ink)' }}>That sign-in link expired. Get a new one below.</p>}
      <p style={{ margin: 0, fontSize: 18, color: 'var(--ink-soft)' }}>
        {p ? `Sign in to download the latest ${p.name}. ` : ''}Use the email you got your plugins with. We'll email you a sign-in link, no password.
      </p>
      <SignInForm next={p ? `/account?product=${p.slug}` : '/account'} />
    </Panel>
  );
}

function LicenseCard({ license, release, highlight }) {
  const p = products[license.product];
  const acts = license.activations || [];
  const notes = release ? noteLines(release.notes) : [];
  const dl = (platform) => `/api/download?product=${encodeURIComponent(license.product)}&platform=${platform}&key=${encodeURIComponent(license.key)}`;
  return (
    <Panel tone={p.tone} tinted={highlight} style={{ padding: 'clamp(24px, 4vw, 36px)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, font: '700 28px/1.05 var(--font-ui)', letterSpacing: '-.6px' }}>{p.name} <span style={{ fontWeight: 400, fontSize: 18, color: 'var(--ink-muted)', letterSpacing: 0 }}>{p.kind}</span></h2>
        {release && <Lcd small>V{release.version}</Lcd>}
      </div>
      {notes.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.5px', marginBottom: 6 }}>NEW IN {release.version}</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 16, lineHeight: 1.5, color: 'var(--ink-soft)' }}>{notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
      )}
      {release ? (
        <>
          <div className="row">
            {PLATFORMS.map(([pl, label]) => <Button key={pl} variant={pl === 'mac' ? 'color' : 'soft'} tone={p.tone} href={dl(pl)}>{label}</Button>)}
          </div>
          <p className="fine">Run the installer. It replaces any older version. Restart your DAW after.</p>
        </>
      ) : <p className="fine">Not released yet. We'll email you when it is.</p>}
      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.5px' }}>LICENSE KEY</div>
        <div><Lcd style={{ userSelect: 'all' }}>{license.key}</Lcd></div>
      </div>
      {!p.free && (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.5px' }}>COMPUTERS {acts.length} OF {license.max_activations}</div>
          {acts.length === 0 && <p className="fine">Not activated on any computer yet.</p>}
          {acts.map((a) => (
            <form key={a.id} action="/api/account/activations" method="post" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16 }}>{a.machine_name || 'Unnamed computer'}</span>
              <input type="hidden" name="id" value={a.id} />
              <Button type="submit" variant="soft">Remove</Button>
            </form>
          ))}
          {acts.length > 0 && <p className="fine">Remove a computer you no longer use to free its slot.</p>}
        </div>
      )}
    </Panel>
  );
}

export default async function Account({ searchParams }) {
  const email = sessionEmail();
  const product = typeof searchParams?.product === 'string' ? searchParams.product.toLowerCase() : '';
  let content;
  if (!email) {
    content = <SignIn product={products[product] ? product : ''} expired={searchParams?.link === 'expired'} />;
  } else {
    const { licenses, releases } = await loadAccount(email);
    const sorted = [...licenses].sort((a, b) => (b.product === product) - (a.product === product));
    content = (
      <div style={{ maxWidth: 820, margin: '0 auto', display: 'grid', gap: 'var(--space-5)' }}>
        <div style={{ display: 'grid', gap: 10 }}>
          <h1 style={{ margin: 0, font: '700 clamp(36px, 5vw, 48px)/1 var(--font-ui)', letterSpacing: '-1.4px' }}>Your plugins</h1>
          <form action="/api/auth/signout" method="post" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16, color: 'var(--ink-soft)' }}>Signed in as {email}</span>
            <button type="submit" style={{ border: 0, background: 'none', padding: 0, font: 'inherit', fontSize: 16, textDecoration: 'underline', color: 'var(--ink)', cursor: 'pointer' }}>Sign out</button>
          </form>
        </div>
        {sorted.length === 0 ? (
          <Panel style={{ padding: 32 }}>
            <p style={{ margin: 0, fontSize: 18 }}>No plugins on this email yet.</p>
            <div className="row"><Button variant="color" tone="coral" href="/plugins/easyduck">Get EasyDuck</Button></div>
          </Panel>
        ) : sorted.map((l) => <LicenseCard key={l.id} license={l} release={releases[l.product]} highlight={l.product === product} />)}
      </div>
    );
  }
  return (
    <div className="ratw" data-signature="coral">
      <Header ticker={['YOUR PLUGINS', 'REAPER AUDIO TOOLS']} />
      <main className="wrap section" style={{ paddingTop: 'var(--space-8)' }}>{content}</main>
      <Footer />
    </div>
  );
}
