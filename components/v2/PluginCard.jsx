import { Frame } from './Chrome';
import { launch } from '../../lib/site';
import Countdown from './Countdown';

/** One plugin as a catalogue card: the UI on stone, then name, price, tagline and a button. */
export default function PluginCard({ product: p, index = 0 }) {
  return (
    <article id={p.slug} className="v-card">
      <a href={`/plugins/${p.slug}`} className="v-card__media v-stone" style={{ backgroundPosition: index % 2 ? '70% 60%' : '30% 40%' }} aria-label={p.name}><Frame src={p.ui} alt={`${p.name} plugin`} /></a>
      <div className="v-card__body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><h3 className="v-h3">{p.name}</h3><span className="v-tag">{p.free ? 'FREE' : p.priceLabel}</span></div>
        <p className="v-body">{p.tagline}</p>
        {!p.free && !launch.live && <Countdown inline />}
        <div className="v-card__foot">
          <span className="v-mono" style={{ fontSize: 12, letterSpacing: '.06em', color: 'var(--v-ink-4)' }}>{p.formats}</span>
          <a className="v-btn v-btn--dark v-btn--md" href={`/plugins/${p.slug}`}>{p.free ? `Get ${p.name}` : launch.live ? `Buy ${p.name}` : 'Join waitlist'}</a>
        </div>
      </div>
    </article>
  );
}
