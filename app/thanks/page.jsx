import { Header, Footer } from '../../components/SiteChrome';
import { Badge, Button, Panel } from '../../components/web';
import { site } from '../../lib/site';

export const metadata = { title: 'Thanks for your order', robots: { index: false } };

export default function Thanks() {
  return (
    <div className="ratw" data-signature="coral">
      <Header ticker={['ORDER COMPLETE', 'REAPER AUDIO TOOLS']} />
      <main className="wrap section" style={{ paddingTop: 'var(--space-8)' }}>
        <Panel style={{ maxWidth: 720, margin: '0 auto', padding: 40 }}>
          <div><Badge kind="cart">ORDER COMPLETE</Badge></div>
          <h1 style={{ margin: 0, font: '700 clamp(36px, 5vw, 48px)/1 var(--font-ui)', letterSpacing: '-1.4px' }}>Thanks.</h1>
          <p style={{ margin: 0, fontSize: 18, color: 'var(--ink-soft)' }}>Two emails are on the way: your receipt from Paddle, and your license key with download links from us.</p>
          <p className="fine">Nothing there after 10 minutes? Check spam, then email {site.supportEmail}.</p>
          <div className="row"><Button variant="soft" href="/">Back to home</Button></div>
        </Panel>
      </main>
      <Footer />
    </div>
  );
}
