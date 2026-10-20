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

/** Phase correlation, -1..+1. Marker fills from centre; positive = signal cyan, negative = clip red. */
export function CorrelationMeter({ value, width = 260, height = 22, demo = false, style }) {
  const [live, setLive] = React.useState(0.6);
  useAnimationFrame(demo && value === undefined, 24, (t) => setLive(0.55 + 0.3 * Math.sin(t * 1.3) + 0.08 * Math.sin(t * 9)));
  const c = Math.max(-1, Math.min(1, value !== undefined ? value : live));
  const pos = (c + 1) / 2 * 100;
  const col = c >= 0 ? 'var(--screen-signal)' : 'var(--screen-clip)';
  const txt = { fontFamily: 'var(--font-lcd)', fontSize: 9, color: 'var(--text-secondary)' };
  return (
    <div style={{ width, flex: 'none', ...style }}>
      <div style={{ position: 'relative', height, borderRadius: 6, overflow: 'hidden', background: 'radial-gradient(circle, rgba(58,74,104,0.55) 0.7px, transparent 1.1px) 0 0 / 9px 9px, var(--screen-navy)' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'var(--screen-zero)' }}></div>
        <div style={{ position: 'absolute', top: 5, bottom: 5, left: Math.min(50, pos) + '%', width: Math.abs(pos - 50) + '%', background: col, opacity: 0.35 }}></div>
        <div style={{ position: 'absolute', top: 3, bottom: 3, left: pos + '%', width: 4, marginLeft: -2, borderRadius: 2, background: col, boxShadow: '0 0 8px ' + col }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}><span style={txt}>-1</span><span style={txt}>0</span><span style={txt}>+1</span></div>
    </div>
  );
}
