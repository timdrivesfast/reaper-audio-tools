import React from 'react';

function useAnimationFrame(active, fps, fn) {
  const ref = React.useRef(fn); ref.current = fn;
  React.useEffect(() => {
    if (!active) return;
    let raf, last = 0;
    const loop = (t) => { if (t - last > 1000 / fps) { last = t; ref.current(t / 1000); } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, fps]);
}

const GRAD = 'linear-gradient(to top, var(--screen-signal) 0%, var(--screen-signal) 72%, var(--screen-hot) 72%, var(--screen-hot) 90%, var(--screen-clip) 90%)';
const STRIPES = 'repeating-linear-gradient(to top, transparent 0 2px, rgba(20,27,46,0.6) 2px 3px)';

/** Vertical LED-style level meter on the navy screen. levels/peaks are 0..1 meter-scale positions (top 10% = clip zone). */
export function LevelMeter({ levels, peaks, channels = 2, height = 240, width = 64, scale = true, demo = false, style }) {
  const [live, setLive] = React.useState(() => Array.from({ length: channels }, () => 0.6));
  const peakRef = React.useRef(Array.from({ length: channels }, () => 0));
  useAnimationFrame(demo && !levels, 30, (t) => {
    setLive(Array.from({ length: channels }, (_, i) => Math.max(0.05, Math.min(0.97, 0.62 + 0.18 * Math.sin(t * 2.1 + i * 0.7) + 0.12 * Math.sin(t * 7.3 + i) + (Math.random() - 0.5) * 0.08))));
  });
  const lv = levels || live;
  peakRef.current = lv.map((l, i) => Math.max(l, (peakRef.current[i] || 0) - 0.006));
  const pk = peaks || peakRef.current;
  const marks = [['0', 0.1], ['-6', 0.28], ['-12', 0.45], ['-24', 0.66], ['-48', 0.88]];
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'stretch', flex: 'none', ...style }}>
      <div style={{ width, height, borderRadius: 8, padding: 4, boxSizing: 'border-box', background: 'radial-gradient(circle, rgba(58,74,104,0.55) 0.7px, transparent 1.1px) 0 0 / 9px 9px, var(--screen-navy)', display: 'flex', gap: 2 }}>
        {lv.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, background: 'rgba(255,255,255,0.14)' }}></div>}
            <div style={{ position: 'relative', flex: 1, borderRadius: 3, overflow: 'hidden', background: 'rgba(42,58,84,0.35)' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: (l * 100) + '%', background: GRAD, backgroundSize: '100% ' + (height - 8) + 'px', backgroundPosition: 'bottom', boxShadow: '0 0 10px rgba(127,221,245,0.25)' }}></div>
              <div style={{ position: 'absolute', inset: 0, background: STRIPES }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: (pk[i] * 100) + '%', height: 2, background: pk[i] > 0.9 ? 'var(--screen-clip)' : '#FFFFFF', opacity: 0.85 }}></div>
            </div>
          </React.Fragment>
        ))}
      </div>
      {scale && (
        <div style={{ position: 'relative', width: 20, height }}>
          {marks.map(([m, p]) => <div key={m} style={{ position: 'absolute', top: (p * 100) + '%', transform: 'translateY(-50%)', fontFamily: 'var(--font-lcd)', fontSize: 9, color: 'var(--text-secondary)' }}>{m}</div>)}
        </div>
      )}
    </div>
  );
}
