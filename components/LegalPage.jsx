import { Shell } from './v2/Chrome';

/** Plain document page for terms, privacy, refunds and contact. */
export default function LegalPage({ title, updated, children }) {
  return (
    <Shell>
      <div className="v-wrap v-page">
        <article className="v-doc">
          <h1>{title}</h1>
          {updated && <p className="v-fine">Last updated {updated}</p>}
          {children}
        </article>
      </div>
    </Shell>
  );
}
