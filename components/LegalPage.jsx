import { Header, Footer } from './SiteChrome';

/** Plain document page for terms, privacy, refunds and contact. */
export default function LegalPage({ title, updated, children }) {
  return (
    <div className="ratw" data-signature="coral">
      <Header ticker={['REAPER AUDIO TOOLS', title.toUpperCase()]} />
      <main className="wrap">
        <article className="legal">
          <h1>{title}</h1>
          {updated && <p className="fine">Last updated {updated}</p>}
          <p className="placeholder-note">Template. Replace every [bracketed] item and have it checked before launch. This is not legal advice.</p>
          {children}
        </article>
      </main>
      <Footer />
    </div>
  );
}
