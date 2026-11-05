import { Shell } from '../../components/v2/Chrome';
import PluginCard from '../../components/v2/PluginCard';
import { products } from '../../lib/site';

export const metadata = {
  title: 'Shop',
  description: 'Every Reaper Audio Tools plugin: VST3 and AU for Mac and Windows. One-time purchases, no subscription.',
};

const suites = [
  { id: 'basic', name: 'Basic Suite', note: 'Light interface, quick to learn.' },
  { id: 'pro', name: 'Pro Suite', note: 'Deeper control and a dark interface.' },
];

export default function Shop() {
  const all = Object.values(products);
  return (
    <Shell>
      <section className="v-wrap v-section" style={{ paddingBottom: 0 }}>
        <div style={{ display: 'grid', gap: 14, maxWidth: 640 }}>
          <div className="v-eyebrow">Shop</div>
          <h1 className="v-h2">All plugins</h1>
          <p className="v-body">VST3 and AU for Mac and Windows. Every plugin is a one-time purchase with no subscription, and free ones only need your email.</p>
        </div>
      </section>
      {suites.filter((s) => all.some((p) => p.suite === s.id)).map((s, si, shown) => {
        const list = all.filter((p) => p.suite === s.id);
        if (list.length === 0) return null;
        return (
          <section key={s.id} id={s.id} className="v-wrap v-section" style={{ scrollMarginTop: 90, paddingBottom: si === shown.length - 1 ? 'var(--v-section)' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 28 }}>
              <h2 className="v-h3" style={{ fontSize: 28 }}>{s.name}</h2>
              <p className="v-body" style={{ maxWidth: 380 }}>{s.note}</p>
            </div>
            <div className="v-grid3">{list.map((p, i) => <PluginCard key={p.slug} product={p} index={i} />)}</div>
          </section>
        );
      })}
    </Shell>
  );
}
