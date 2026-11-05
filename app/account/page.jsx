import { Shell } from '../../components/v2/Chrome';
import SignInForm from '../../components/SignInForm';
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
    <div className="v-panel" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 className="v-h2">Your plugins</h1>
      {expired && <p role="alert" className="v-err">That sign-in link expired. Get a new one below.</p>}
      <p className="v-body" style={{ fontSize: 18 }}>
        {p ? `Sign in to download the latest ${p.name}. ` : ''}Use the email you got your plugins with. We'll email you a sign-in link, no password.
      </p>
      <SignInForm next={p ? `/account?product=${p.slug}` : '/account'} />
    </div>
  );
}

function LicenseCard({ license, release, highlight }) {
  const p = products[license.product];
  const acts = license.activations || [];
  const notes = release ? noteLines(release.notes) : [];
  const dl = (platform) => `/api/download?product=${encodeURIComponent(license.product)}&platform=${platform}&key=${encodeURIComponent(license.key)}`;
  return (
    <div className="v-panel" style={highlight ? { boxShadow: '0 0 0 2px var(--v-indigo)' } : undefined}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <h2 className="v-h3">{p.name} <span style={{ fontWeight: 400, fontSize: 17, color: 'var(--v-ink-4)', letterSpacing: 0 }}>{p.kind}</span></h2>
        {release && <span className="v-tag v-tag--dark">V{release.version}</span>}
      </div>
      {notes.length > 0 && (
        <div>
          <div className="v-label" style={{ marginBottom: 6 }}>New in {release.version}</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 16, lineHeight: 1.5, color: 'var(--v-ink-3)' }}>{notes.map((n) => <li key={n}>{n}</li>)}</ul>
        </div>
      )}
      {release ? (
        <>
          <div className="v-row" style={{ gap: 12 }}>
            {PLATFORMS.map(([pl, label]) => <a key={pl} className={`v-btn v-btn--md ${pl === 'mac' ? 'v-btn--dark' : 'v-btn--light'}`} style={pl === 'mac' ? undefined : { boxShadow: '0 0 0 1px var(--v-card-line)' }} href={dl(pl)}>{label}</a>)}
          </div>
          <p className="v-fine">Run the installer. It replaces any older version. Restart your DAW after.</p>
        </>
      ) : <p className="v-fine">Not released yet. We'll email you when it is.</p>}
      <div style={{ display: 'grid', gap: 8 }}>
        <div className="v-label">License key</div>
        <div><span className="v-key">{license.key}</span></div>
      </div>
      {!p.free && (
        <div style={{ display: 'grid', gap: 8 }}>
          <div className="v-label">Computers {acts.length} of {license.max_activations}</div>
          {acts.length === 0 && <p className="v-fine">Not activated on any computer yet.</p>}
          {acts.map((a) => (
            <form key={a.id} action="/api/account/activations" method="post" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16 }}>{a.machine_name || 'Unnamed computer'}</span>
              <input type="hidden" name="id" value={a.id} />
              <button type="submit" className="v-btn v-btn--light v-btn--sm" style={{ boxShadow: '0 0 0 1px var(--v-card-line)' }}>Remove</button>
            </form>
          ))}
          {acts.length > 0 && <p className="v-fine">Remove a computer you no longer use to free its slot.</p>}
        </div>
      )}
    </div>
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
          <h1 className="v-h2">Your plugins</h1>
          <form action="/api/auth/signout" method="post" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16, color: 'var(--v-ink-3)' }}>Signed in as {email}</span>
            <button type="submit" style={{ border: 0, background: 'none', padding: 0, font: 'inherit', fontSize: 16, textDecoration: 'underline', color: 'var(--v-ink)', cursor: 'pointer' }}>Sign out</button>
          </form>
        </div>
        {sorted.length === 0 ? (
          <div className="v-panel">
            <p style={{ margin: 0, fontSize: 18 }}>No plugins on this email yet.</p>
            <div className="v-row"><a className="v-btn v-btn--dark v-btn--md" href="/plugins/easyduck">Get EasyDuck free</a><a className="v-link" href="/#plugins">See all plugins <span className="v-mono">→</span></a></div>
          </div>
        ) : sorted.map((l) => <LicenseCard key={l.id} license={l} release={releases[l.product]} highlight={l.product === product} />)}
      </div>
    );
  }
  return (
    <Shell>
      <div className="v-wrap v-page">{content}</div>
    </Shell>
  );
}
