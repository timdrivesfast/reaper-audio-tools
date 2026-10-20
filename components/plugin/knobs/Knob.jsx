import React from 'react';

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function useValue(value, fallback, onChange) {
  const [v, setV] = React.useState(value !== undefined ? value : fallback);
  React.useEffect(() => { if (value !== undefined) setV(value); }, [value]);
  return [v, (n) => { setV(n); if (onChange) onChange(n); }];
}
function startDrag(e, onMove, onEnd) {
  e.preventDefault();
  const sx = e.clientX, sy = e.clientY;
  const mv = (ev) => onMove(ev.clientX - sx, ev.clientY - sy, ev);
  const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (onEnd) onEnd(); };
  window.addEventListener('pointermove', mv);
  window.addEventListener('pointerup', up);
}

const JUICE_RING = 'conic-gradient(from 200deg, #B9A3F4, #7FDDF5, #A9EE85, #FAC38F, #FFB3C7, #B9A3F4)';
const JUICE_FACE = 'radial-gradient(circle, #FFE3D2 0%, #F9BFC4 38%, #CDB9F5 66%, #E6E6E8 82%)';

/** Rotary knob. Variants: dial (coloured ring), dot (small pad), fill (coloured disc), plain (no colour), juice (the one gradient). Vertical drag, 150px = full sweep, -135°..+135°. */
export function Knob({ value, defaultValue = 50, min = 0, max = 100, onChange, onDragStart, onDragEnd, variant = 'dial', size, color = 'var(--accent)', tickColor, disabled = false, ariaLabel, style }) {
  const S = size || (variant === 'dot' ? 34 : variant === 'fill' || variant === 'plain' ? 88 : 66);
  const [v, setV] = useValue(value, defaultValue, onChange);
  const [drag, setDrag] = React.useState(false);
  const t = max > min ? (v - min) / (max - min) : 0;
  const rot = -135 + t * 270;
  const tick = tickColor || color;
  const down = (e) => {
    if (disabled) return;
    const start = v;
    setDrag(true);
    if (onDragStart) onDragStart();
    startDrag(e, (dx, dy) => setV(clamp(start + (-dy / 150) * (max - min), min, max)), () => { setDrag(false); if (onDragEnd) onDragEnd(); });
  };
  const glow = drag ? ', 0 0 0 2px color-mix(in srgb, ' + tick + ' 22%, transparent)' : '';
  const base = { width: S, height: S, borderRadius: '50%', boxSizing: 'border-box', cursor: disabled ? 'default' : 'ns-resize', touchAction: 'none', flex: 'none', opacity: disabled ? 0.45 : 1, position: 'relative', ...style };
  const aria = { role: 'slider', 'aria-label': ariaLabel, 'aria-valuemin': min, 'aria-valuemax': max, 'aria-valuenow': Math.round(v) };
  const cap = (d) => <div style={{ position: 'absolute', left: '50%', top: '50%', width: d, height: d, margin: (-d / 2) + 'px 0 0 ' + (-d / 2) + 'px', borderRadius: '50%', background: 'var(--knob-cap-fill)', boxShadow: 'var(--shadow-knob-cap)' }}></div>;
  const rotor = (child) => <div style={{ position: 'absolute', inset: 0, transform: 'rotate(' + rot + 'deg)' }}>{child}</div>;
  const face = 'radial-gradient(circle at 40% 35%, var(--knob-face-1), var(--knob-face-2))';

  if (variant === 'dot') {
    const d = S * 0.647;
    return (
      <div {...aria} onPointerDown={down} style={{ ...base, background: 'var(--surface-panel)', boxShadow: 'var(--shadow-raised-md)' + glow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: d, height: d, borderRadius: '50%', background: color, position: 'relative', transform: 'rotate(' + rot + 'deg)' }}>
          <div style={{ position: 'absolute', left: '50%', top: d * 0.136, width: d * 0.18, height: d * 0.18, marginLeft: -d * 0.09, borderRadius: '50%', background: '#FFFFFF' }}></div>
        </div>
      </div>
    );
  }
  if (variant === 'fill') {
    const d = S * 0.66;
    return (
      <div {...aria} onPointerDown={down} style={{ ...base, background: 'var(--surface-panel)', boxShadow: 'var(--shadow-knob)' + glow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: d, height: d, borderRadius: '50%', position: 'relative', background: 'radial-gradient(circle, color-mix(in srgb, ' + color + ' 30%, #FFFFFF) 0%, ' + color + ' 72%)', boxShadow: 'inset 0 -3px 6px rgba(0,0,0,0.08)' }}>
          {rotor(<div style={{ position: 'absolute', left: '50%', top: d * 0.09, width: d * 0.11, height: d * 0.11, marginLeft: -d * 0.055, borderRadius: '50%', background: 'var(--knob-cap-fill)', boxShadow: 'var(--shadow-knob-cap)' }}></div>)}
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: d * 0.4, height: d * 0.4, margin: (-d * 0.2) + 'px 0 0 ' + (-d * 0.2) + 'px', borderRadius: '50%', background: 'color-mix(in srgb, var(--knob-cap-fill) 60%, #FFFFFF)', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}></div>
          {cap(d * 0.24)}
        </div>
      </div>
    );
  }
  if (variant === 'plain') {
    return (
      <div {...aria} onPointerDown={down} style={{ ...base, background: 'var(--surface-panel)', padding: S * 0.035, boxShadow: 'var(--shadow-knob)' + glow }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: face, position: 'relative', boxShadow: 'var(--shadow-knob-face)' }}>
          {rotor(<div style={{ position: 'absolute', left: '50%', top: S * 0.07, width: S * 0.1, height: S * 0.16, marginLeft: -S * 0.05, borderRadius: S * 0.05, background: 'var(--knob-cap-fill)', boxShadow: 'var(--shadow-knob-cap)' }}></div>)}
          {cap(S * 0.27)}
        </div>
      </div>
    );
  }
  const isJuice = variant === 'juice';
  return (
    <div {...aria} onPointerDown={down} style={{ ...base, background: isJuice ? JUICE_RING : color, padding: Math.max(3, S * 0.06), boxShadow: 'var(--shadow-knob)' + glow }}>
      <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: isJuice ? JUICE_FACE : face, position: 'relative', boxShadow: 'var(--shadow-knob-face)' }}>
        {rotor(isJuice
          ? <div style={{ position: 'absolute', left: '50%', top: S * 0.08, width: S * 0.08, height: S * 0.08, marginLeft: -S * 0.04, borderRadius: '50%', background: 'var(--knob-cap-fill)' }}></div>
          : <div style={{ position: 'absolute', left: '50%', top: S * 0.076, width: S * 0.106, height: S * 0.197, marginLeft: -S * 0.053, borderRadius: S * 0.06, background: tick }}></div>)}
        {cap(S * 0.27)}
      </div>
    </div>
  );
}
