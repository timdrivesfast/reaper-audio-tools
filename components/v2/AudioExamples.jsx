import { AudioDemo } from '../web';

/** The "Listen" section on a product page: DRY / WET players for rendered loops. */
export default function AudioExamples({ examples, tone, intro, title = 'Audio examples' }) {
  if (!examples || examples.length === 0) return null;
  return (
    <section className="v-wrap v-section">
      <div className="v-grid2" style={{ alignItems: 'center', gap: 'clamp(32px, 5vw, 72px)' }}>
        <div style={{ display: 'grid', gap: 14, maxWidth: 460 }}>
          <div className="v-eyebrow">Listen</div>
          <h2 className="v-h2">{title}</h2>
          {intro.map((p) => <p key={p} className="v-body">{p}</p>)}
        </div>
        <div className="ratw" data-signature={tone} style={{ display: 'grid', gap: 16, background: 'transparent' }}>
          {examples.map((a, i) => <AudioDemo key={a.title} title={a.title} drySrc={a.drySrc} wetSrc={a.wetSrc} peaks={a.peaks} tone={tone} seed={7 + i * 12} />)}
        </div>
      </div>
    </section>
  );
}
