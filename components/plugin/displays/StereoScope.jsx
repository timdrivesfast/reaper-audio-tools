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

function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

/** Goniometer / vectorscope. Mono collapses to a vertical line; width 0..1.5 spreads the cloud. Navy screen, signal-cyan dots. */
export function StereoScope({ size = 200, width = 0.6, animate = true, points = 360, style }) {
  const gen = () => Array.from({ length: points }, () => [gauss() * 0.3 * width, gauss() * 0.3]);
  const [pts, setPts] = React.useState(gen);
  useAnimationFrame(animate, 20, () => setPts(gen()));
  React.useEffect(() => { setPts(gen()); }, [width]);
  const c = size / 2, R = size * 0.46;
  const lab = { position: 'absolute', fontFamily: 'var(--font-lcd)', fontSize: 9, color: 'rgba(255,255,255,0.42)' };
  return (
    <div style={{ position: 'relative', width: size, height: size, borderRadius: 8, overflow: 'hidden', background: 'radial-gradient(circle, rgba(58,74,104,0.55) 0.7px, transparent 1.1px) 0 0 / 9px 9px, var(--screen-navy)', flex: 'none', ...style }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={c} cy={c} r={R} style={{ fill: 'none', stroke: '#2A3A54', strokeWidth: 1 }}></circle>
        <line x1={c - R * 0.707} y1={c - R * 0.707} x2={c + R * 0.707} y2={c + R * 0.707} style={{ stroke: '#2A3A54', strokeWidth: 1 }}></line>
        <line x1={c + R * 0.707} y1={c - R * 0.707} x2={c - R * 0.707} y2={c + R * 0.707} style={{ stroke: '#2A3A54', strokeWidth: 1 }}></line>
        <line x1={c} y1={c - R} x2={c} y2={c + R} style={{ stroke: 'rgba(255,255,255,0.16)', strokeWidth: 1 }}></line>
        {pts.map(([x, y], i) => { const px = c + x * R, py = c - y * R; if (Math.hypot(px - c, py - c) > R) return null; return <circle key={i} cx={px} cy={py} r="1.1" style={{ fill: 'var(--screen-signal)', fillOpacity: 0.55 }}></circle>; })}
      </svg>
      <div style={{ ...lab, left: 10, top: 8 }}>L</div><div style={{ ...lab, right: 10, top: 8 }}>R</div><div style={{ ...lab, left: c - 3, top: 4 }}>M</div>
    </div>
  );
}
