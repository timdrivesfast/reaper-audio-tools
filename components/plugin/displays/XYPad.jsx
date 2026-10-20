import React from 'react';

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

/** Two-parameter pad on the navy screen: drag anywhere; crosshair follows the node. x/y are 0..1 (y up). */
export function XYPad({ x = 0.5, y = 0.5, onChange, width = 220, height = 220, labelX = 'X', labelY = 'Y', color = 'var(--accent)', style }) {
  const [p, setP] = React.useState({ x, y });
  React.useEffect(() => setP({ x, y }), [x, y]);
  const [on, setOn] = React.useState(false);
  const ref = React.useRef(null);
  const setFrom = (ev) => { const r = ref.current.getBoundingClientRect(); const n = { x: clamp((ev.clientX - r.left) / r.width, 0, 1), y: clamp(1 - (ev.clientY - r.top) / r.height, 0, 1) }; setP(n); if (onChange) onChange(n); };
  const down = (e) => { setOn(true); setFrom(e); startDrag(e, (dx, dy, ev) => setFrom(ev), () => setOn(false)); };
  const lab = { position: 'absolute', fontFamily: 'var(--font-lcd)', fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', pointerEvents: 'none' };
  return (
    <div ref={ref} onPointerDown={down} style={{ position: 'relative', width, height, borderRadius: 8, overflow: 'hidden', cursor: 'crosshair', touchAction: 'none', background: 'radial-gradient(circle, rgba(58,74,104,0.55) 0.7px, transparent 1.1px) 0 0 / 9px 9px, var(--screen-navy)', flex: 'none', ...style }}>
      {[0.25, 0.5, 0.75].map((g) => <React.Fragment key={g}><div style={{ position: 'absolute', top: 0, bottom: 0, left: g * 100 + '%', width: 1, background: 'rgba(42,58,84,0.6)' }}></div><div style={{ position: 'absolute', left: 0, right: 0, top: g * 100 + '%', height: 1, background: 'rgba(42,58,84,0.6)' }}></div></React.Fragment>)}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: p.x * 100 + '%', width: 1, background: 'color-mix(in srgb, ' + color + ' 45%, transparent)' }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: (1 - p.y) * 100 + '%', height: 1, background: 'color-mix(in srgb, ' + color + ' 45%, transparent)' }}></div>
      <Handle x={p.x * 100} y={(1 - p.y) * 100} color={color} active={on} size={5} />
      <div style={{ ...lab, right: 8, bottom: 6 }}>{labelX}</div>
      <div style={{ ...lab, left: 8, top: 6 }}>{labelY}</div>
    </div>
  );
}
