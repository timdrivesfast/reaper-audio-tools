import React from 'react';
import { Screen } from '../surfaces/Screen.jsx';

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function startDrag(e, onMove, onEnd) {
  e.preventDefault(); e.stopPropagation();
  const sx = e.clientX, sy = e.clientY;
  const mv = (ev) => onMove(ev.clientX - sx, ev.clientY - sy, ev);
  const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (onEnd) onEnd(); };
  window.addEventListener('pointermove', mv);
  window.addEventListener('pointerup', up);
}

function Handle({ x, y, color = 'var(--screen-trace)', active, size = 4, onPointerDown, onWheel, title }) {
  const r = active ? size * 1.125 : size;
  const g = r * (active ? 4.2 : 3.4);
  return (
    <div title={title} onPointerDown={onPointerDown} onWheel={onWheel} style={{ position: 'absolute', left: x + '%', top: y + '%', width: g * 2, height: g * 2, margin: (-g) + 'px 0 0 ' + (-g) + 'px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab', touchAction: 'none', background: 'radial-gradient(circle, color-mix(in srgb, ' + color + ' ' + (active ? 55 : 40) + '%, transparent) 0%, transparent 70%)' }}>
      <div style={{ width: r * 2, height: r * 2, borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: r * 1.1, height: r * 1.1, borderRadius: '50%', background: color }}></div>
      </div>
    </div>
  );
}

const W = 1000, H = 400, RANGE = 18, PADY = 24;
const fx = (f) => Math.log10(f / 20) / 3 * W;
const xf = (x) => 20 * Math.pow(10, x / W * 3);
const gy = (g) => H / 2 - g / RANGE * (H / 2 - PADY);
const yg = (y) => (H / 2 - y) / (H / 2 - PADY) * RANGE;
function bandDb(b, f) {
  const q = b.q || 1;
  switch (b.type) {
    case 'lowshelf': return b.gain / (1 + Math.pow(f / b.freq, 2 * q));
    case 'highshelf': return b.gain / (1 + Math.pow(b.freq / f, 2 * q));
    case 'highpass': return Math.max(-30, -10 * Math.log10(1 + Math.pow(b.freq / f, 4 * q)));
    case 'lowpass': return Math.max(-30, -10 * Math.log10(1 + Math.pow(f / b.freq, 4 * q)));
    default: { const o = Math.log2(f / b.freq); return b.gain * Math.exp(-o * o * q * q * 1.4); }
  }
}
const DEFAULT_BANDS = [
  { type: 'highpass', freq: 30, gain: 0, q: 1, color: 'var(--text-inactive)' },
  { type: 'lowshelf', freq: 110, gain: 3, q: 0.8, color: 'var(--param-cyan)' },
  { type: 'bell', freq: 480, gain: -4, q: 1.2, color: 'var(--param-indigo)' },
  { type: 'bell', freq: 2600, gain: 4.5, q: 1, color: 'var(--param-orange)' },
  { type: 'highshelf', freq: 9000, gain: 2, q: 0.8, color: 'var(--param-red)' },
];
const PASS = (t) => t === 'highpass' || t === 'lowpass';

/** Parametric EQ display: summed response curve + draggable colour-coded band nodes (drag = freq/gain, wheel = Q). children render underneath (e.g. <Spectrum bare/>). */
export function EQCurve({ bands = DEFAULT_BANDS, onChange, selected, onSelect, height = 240, axis = true, children, style }) {
  const [bs, setBs] = React.useState(bands);
  React.useEffect(() => setBs(bands), [bands]);
  const [sel, setSel] = React.useState(selected !== undefined ? selected : 2);
  React.useEffect(() => { if (selected !== undefined) setSel(selected); }, [selected]);
  const ref = React.useRef(null);
  const update = (i, patch) => setBs((cur) => { const n = cur.map((b, j) => j === i ? { ...b, ...patch } : b); if (onChange) onChange(n); return n; });
  const curve = (list) => { let d = ''; for (let x = 0; x <= W; x += 5) { const f = xf(x); let g = 0; list.forEach((b) => { g += bandDb(b, f); }); d += (x ? ' L' : 'M') + x + ' ' + gy(Math.max(-RANGE - 4, Math.min(RANGE + 4, g))).toFixed(1); } return d; };
  const total = curve(bs);
  const selCurve = bs[sel] && !PASS(bs[sel].type) ? curve([bs[sel]]) : null;
  const grab = (i) => (e) => {
    setSel(i); if (onSelect) onSelect(i);
    const r = ref.current.getBoundingClientRect();
    startDrag(e, (dx, dy, ev) => {
      const x = clamp((ev.clientX - r.left) / r.width * W, 0, W), y = clamp((ev.clientY - r.top) / r.height * H, 0, H);
      update(i, PASS(bs[i].type) ? { freq: Math.round(xf(x)) } : { freq: Math.round(xf(x)), gain: Math.round(clamp(yg(y), -RANGE, RANGE) * 10) / 10 });
    });
  };
  const wheel = (i) => (e) => { update(i, { q: clamp((bs[i].q || 1) * (e.deltaY < 0 ? 1.1 : 0.9), 0.2, 8) }); };
  const freqs = [[50, 0], [100, 1], [200, 0], [500, 0], [1000, 1], [2000, 0], [5000, 0], [10000, 1]];
  const lab = { position: 'absolute', fontFamily: 'var(--font-lcd)', fontSize: 9, color: 'rgba(255,255,255,0.42)', pointerEvents: 'none' };
  return (
    <Screen height={height} columns={0} zeroLine={0.5} style={style}>
      <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
        {children && <div style={{ position: 'absolute', inset: 0 }}>{children}</div>}
        <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {freqs.map(([f, major]) => <line key={f} x1={fx(f)} x2={fx(f)} y1="0" y2={H} vectorEffect="non-scaling-stroke" style={{ stroke: '#2A3A54', strokeOpacity: major ? 0.9 : 0.45, strokeWidth: 1 }}></line>)}
          {[-12, -6, 6, 12].map((g) => <line key={g} x1="0" x2={W} y1={gy(g)} y2={gy(g)} vectorEffect="non-scaling-stroke" style={{ stroke: '#2A3A54', strokeOpacity: 0.6, strokeWidth: 1, strokeDasharray: '2 4' }}></line>)}
          {selCurve && <path d={selCurve + ' L' + W + ' ' + H / 2 + ' L0 ' + H / 2 + ' Z'} style={{ fill: bs[sel].color, fillOpacity: 0.16 }}></path>}
          <path d={total + ' L' + W + ' ' + H + ' L0 ' + H + ' Z'} style={{ fill: 'var(--screen-trace)', fillOpacity: 0.07 }}></path>
          <path d={total} vectorEffect="non-scaling-stroke" style={{ fill: 'none', stroke: 'var(--screen-trace)', strokeWidth: 2, strokeLinejoin: 'round' }}></path>
        </svg>
        {axis && freqs.filter((f) => f[1]).map(([f]) => <div key={f} style={{ ...lab, left: fx(f) / W * 100 + '%', bottom: 4, marginLeft: 4 }}>{f >= 1000 ? f / 1000 + 'k' : f}</div>)}
        {axis && [12, 6, -6, -12].map((g) => <div key={g} style={{ ...lab, right: 6, top: gy(g) / H * 100 + '%', transform: 'translateY(-50%)' }}>{g > 0 ? '+' + g : g}</div>)}
        {bs.map((b, i) => <Handle key={i} x={fx(b.freq) / W * 100} y={(PASS(b.type) ? gy(0) : gy(b.gain)) / H * 100} color={b.color} active={i === sel} onPointerDown={grab(i)} onWheel={wheel(i)} title={b.type + ' ' + b.freq + ' Hz'} />)}
      </div>
    </Screen>
  );
}
