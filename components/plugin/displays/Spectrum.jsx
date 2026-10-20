import React from 'react';
import { Screen } from '../surfaces/Screen.jsx';

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

const N = 96, W = 1000, H = 400;
function frame(t, prev) {
  return Array.from({ length: N }, (_, i) => {
    const x = i / (N - 1);
    const bump = (c, w, a) => a * Math.exp(-Math.pow((x - c) / w, 2));
    let v = 0.78 - x * 0.42 + bump(0.12, 0.05, 0.16 + 0.1 * Math.sin(t * 6.2)) + bump(0.36, 0.08, 0.08 + 0.05 * Math.sin(t * 2.3)) + bump(0.62, 0.06, 0.06 + 0.04 * Math.sin(t * 3.7 + 1)) + (Math.random() - 0.5) * 0.09;
    v = Math.max(0.03, Math.min(0.97, v * (x > 0.92 ? 1 - (x - 0.92) * 6 : 1)));
    return prev ? prev[i] * 0.6 + v * 0.4 : v;
  });
}

/** Real-time spectrum analyzer: filled signal-cyan trace on the navy screen. bare = no screen (layer it under EQCurve). */
export function Spectrum({ animate = true, data, height = 200, bare = false, color = 'var(--screen-signal)', opacity = 1, style }) {
  const [bins, setBins] = React.useState(() => frame(0));
  useAnimationFrame(animate && !data, 30, (t) => setBins((p) => frame(t, p)));
  const b = data || bins;
  let d = '';
  b.forEach((v, i) => { d += (i ? ' L' : 'M') + (i / (N - 1) * W).toFixed(1) + ' ' + (H - v * H * 0.85).toFixed(1); });
  const svg = (
    <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}>
      <path d={d + ' L' + W + ' ' + H + ' L0 ' + H + ' Z'} style={{ fill: color, fillOpacity: 0.14 }}></path>
      <path d={d} vectorEffect="non-scaling-stroke" style={{ fill: 'none', stroke: color, strokeOpacity: 0.7, strokeWidth: 1.25 }}></path>
    </svg>
  );
  if (bare) return svg;
  return <Screen height={height} zeroLine={null} style={style}>{svg}</Screen>;
}
