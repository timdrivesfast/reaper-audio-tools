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

const VW = 372, VH = 128, PAD = 10, X0 = 44, YT = 18, YB = 110, YM = 64, SC = (VW - X0 - PAD) / 900;
const KICKS = { 'Disco': [130, 55, 45, 0.5], 'Boom Bap': [90, 42, 90, 0.25], 'Rock': [150, 70, 35, 0.65], 'Deep House': [100, 45, 70, 0.3], 'Techno': [160, 48, 30, 0.8], 'Trance': [120, 50, 55, 0.45] };

/** Draggable ducking/ADSR-style envelope over a faint "phantom" source waveform, on the navy screen. */
export function EnvelopeEditor({ attack = 12, length = 60, decay = 220, depth = 80, onChange, preset = 'Deep House', showSource = true, height = 190, style }) {
  const [env, setEnv] = React.useState({ attack, length, decay, depth });
  React.useEffect(() => setEnv({ attack, length, decay, depth }), [attack, length, decay, depth]);
  const [active, setActive] = React.useState(-1);
  const ref = React.useRef(null);
  const yD = YT + env.depth / 100 * (YB - YT);
  const xA = X0 + env.attack * SC, xB = xA + env.length * SC, xC = Math.min(xB + env.decay * SC, VW - PAD);
  let kick = '';
  if (showSource) {
    const [f0, f1, tau, clickAmp] = KICKS[preset] || KICKS['Deep House'];
    const dur = Math.min(env.attack + env.length + env.decay, 900), ampTau = dur / 3.2, maxAmp = 14 + env.depth / 100 * 30;
    kick = 'M0 ' + YM + ' L' + X0 + ' ' + YM;
    let ph = 0; const dt = 900 / 220;
    for (let i = 0; i <= 220; i++) {
      const t = i * dt; let y = YM;
      if (t <= dur) {
        const f = f1 + (f0 - f1) * Math.exp(-t / tau); ph += f * dt / 1000;
        y = YM - (maxAmp * Math.exp(-t / ampTau) * Math.sin(2 * Math.PI * ph) + clickAmp * maxAmp * Math.exp(-t / 6) * Math.sin(2 * Math.PI * t / 2.7));
      }
      kick += ' L' + (X0 + t * SC).toFixed(1) + ' ' + y.toFixed(1);
    }
    kick += ' L' + VW + ' ' + YM;
  }
  const line = 'M0 ' + YT + ' L' + X0 + ' ' + YT + ' L' + xA + ' ' + yD + ' L' + xB + ' ' + yD + ' Q' + (xB + (xC - xB) * 0.35) + ' ' + yD + ' ' + xC + ' ' + YT + ' L' + VW + ' ' + YT;
  const grab = (i) => (e) => {
    setActive(i);
    const r = ref.current.getBoundingClientRect();
    startDrag(e, (dx, dy, ev) => {
      const vx = (ev.clientX - r.left) / r.width * VW, vy = (ev.clientY - r.top) / r.height * VH;
      setEnv((cur) => {
        const a = X0 + cur.attack * SC, b = a + cur.length * SC;
        let p;
        if (i === 0) p = { attack: clamp((vx - X0) / SC, 1, 150), depth: clamp((vy - YT) / (YB - YT) * 100, 5, 100) };
        else if (i === 1) p = { length: clamp((vx - a) / SC, 0, 300) };
        else p = { decay: clamp((vx - b) / SC, 20, 600) };
        const n = { ...cur, ...p }; if (onChange) onChange(n); return n;
      });
    }, () => setActive(-1));
  };
  const pts = [[xA, yD], [xB, yD], [xC, YT]];
  return (
    <Screen height={height} zeroLine={YM / VH} style={style}>
      <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
        <svg viewBox={'0 0 ' + VW + ' ' + VH} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {showSource && <path d={kick} vectorEffect="non-scaling-stroke" style={{ fill: 'none', stroke: 'var(--screen-signal)', strokeOpacity: 0.5, strokeWidth: 1 }}></path>}
          <path d={line + ' L' + VW + ' ' + VH + ' L0 ' + VH + ' Z'} style={{ fill: 'var(--screen-trace)', fillOpacity: 0.07 }}></path>
          <path d={line} vectorEffect="non-scaling-stroke" style={{ fill: 'none', stroke: 'var(--screen-trace)', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}></path>
        </svg>
        {pts.map(([x, y], i) => <Handle key={i} x={x / VW * 100} y={y / VH * 100} active={active === i} onPointerDown={grab(i)} title={['Attack / Depth', 'Length', 'Decay'][i]} />)}
      </div>
    </Screen>
  );
}
