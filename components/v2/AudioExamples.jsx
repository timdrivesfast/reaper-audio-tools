import { AudioDemo } from '../web';

/** The "Listen" section on a product page: DRY / WET players for rendered loops, side by side. */
export default function AudioExamples({ examples, tone, intro, note, title = 'Hear it' }) {
  if (!examples || examples.length === 0) return null;
  return (
    <section className="v-wrap v-section">
      <div className="v-listen__head">
        <h2 className="v-h2">{title}</h2>
        <div>
          <p className="v-body">{intro}</p>
          {note && <p className="v-listen__note">{note}</p>}
        </div>
      </div>
      <div className="ratw v-listen__grid" data-signature={tone}>
        {examples.map((a, i) => <AudioDemo key={a.title} title={a.title} drySrc={a.drySrc} wetSrc={a.wetSrc} peaks={a.peaks} tone={tone} seed={7 + i * 12} />)}
      </div>
    </section>
  );
}
