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
const ABS = { position: 'absolute', borderRadius: '50%' };
const PLATE_SHADOW = '0.4em 0.45em 0.9em var(--k-lo), -0.35em -0.35em 0.8em var(--k-hi)';

/** Rotary knob. Refined ring (1a) for dial, fill, plain and juice; ceramic pastel (1e) for the mini dot knob.
 *  Vertical drag, 150px = full sweep, -135°..+135°. Sizes are em-based: the box font-size is size/10. */
export function Knob({ value, defaultValue = 50, min = 0, max = 100, onChange, onDragStart, onDragEnd, variant = 'dial', size, color = 'var(--accent)', tickColor, disabled = false, ariaLabel, style }) {
  const S = size || (variant === 'dot' ? 34 : variant === 'fill' || variant === 'plain' ? 88 : 66);
  const [v, setV] = useValue(value, defaultValue, onChange);
  const t = max > min ? (v - min) / (max - min) : 0;
  const rot = -135 + t * 270;
  const down = (e) => {
    if (disabled) return;
    const start = v;
    if (onDragStart) onDragStart();
    startDrag(e, (dx, dy) => setV(clamp(start + (-dy / 150) * (max - min), min, max)), () => { if (onDragEnd) onDragEnd(); });
  };
  const kc = variant === 'plain' ? '#A3A6AE' : variant === 'juice' ? '#B9A3F4' : color;
  const aria = { role: 'slider', 'aria-label': ariaLabel, 'aria-valuemin': min, 'aria-valuemax': max, 'aria-valuenow': Math.round(v) };
  const box = { '--kc': kc, position: 'relative', width: S, height: S, fontSize: S / 10, cursor: disabled ? 'default' : 'ns-resize', touchAction: 'none', flex: 'none', userSelect: 'none', opacity: disabled ? 0.45 : 1, ...style };
  const rotor = (child) => <div style={{ position: 'absolute', inset: 0, transform: 'rotate(' + rot + 'deg)' }}>{child}</div>;

  if (variant === 'dot') {
    const ticks = Array.from({ length: 11 }, (_, i) => {
      const a = -135 + 27 * i, on = i / 10 <= t + 0.001, major = i % 5 === 0;
      return <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: '0.2em', height: major ? '0.75em' : '0.5em', marginLeft: '-0.1em', marginTop: major ? '-0.375em' : '-0.25em', borderRadius: '0.1em', background: on ? 'var(--kc)' : 'var(--k-print)', transform: 'rotate(' + a + 'deg) translateY(-4.5em)' }}></div>;
    });
    return (
      <div {...aria} onPointerDown={down} style={box}>
        {ticks}
        <div style={{ ...ABS, inset: '14%', background: 'radial-gradient(circle at 36% 28%, color-mix(in srgb, var(--kc) 30%, #fff) 0%, var(--kc) 55%, color-mix(in srgb, var(--kc) 80%, #000) 100%)', boxShadow: '0.3em 0.5em 0.9em rgba(0,0,0,0.25), 0 0.1em 0.15em rgba(0,0,0,0.18), inset -0.1em -0.15em 0.3em rgba(0,0,0,0.1)' }}></div>
        {rotor(<div style={{ position: 'absolute', left: '46.5%', top: '18%', width: '7%', height: '19%', borderRadius: '0.35em', background: tickColor || 'rgba(20,20,30,0.5)', boxShadow: 'inset 0 0.06em 0.08em rgba(0,0,0,0.5), 0 0.04em 0 rgba(255,255,255,0.4)' }}></div>)}
        <div style={{ ...ABS, left: '25%', top: '20%', width: '30%', height: '17%', background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%)', transform: 'rotate(-32deg)' }}></div>
      </div>
    );
  }

  const k = variant === 'fill' || variant === 'juice' ? 0.13 : 0;
  const plate = variant === 'fill'
    ? 'radial-gradient(circle at 40% 30%, color-mix(in srgb, var(--kc) 50%, #fff), var(--kc) 72%)'
    : variant === 'juice' ? JUICE_RING : null;
  return (
    <div {...aria} onPointerDown={down} style={box}>
      {plate && <div style={{ ...ABS, inset: 0, background: plate, boxShadow: PLATE_SHADOW }}></div>}
      <div style={{ position: 'absolute', inset: k * 100 + '%', fontSize: S * (1 - 2 * k) / 10 }}>
        <div style={{ ...ABS, inset: 0, background: 'linear-gradient(160deg, color-mix(in srgb, var(--kc) 62%, #fff), var(--kc) 50%, color-mix(in srgb, var(--kc) 82%, #000))', boxShadow: '0.5em 0.55em 1.1em var(--k-lo), -0.45em -0.45em 1em var(--k-hi), inset 0 0.06em 0.05em rgba(255,255,255,0.5), inset 0 -0.08em 0.12em rgba(0,0,0,0.15)' }}></div>
        <div style={{ ...ABS, inset: '8%', background: 'radial-gradient(circle at 40% 28%, var(--k-face1), var(--k-face2) 78%)', boxShadow: '0 0.22em 0.45em rgba(0,0,0,0.28), 0 0.05em 0.08em rgba(0,0,0,0.2), inset 0 0.07em 0.05em rgba(255,255,255,0.75), inset 0 -0.18em 0.3em rgba(0,0,0,0.07)' }}></div>
        {rotor(<div style={{ position: 'absolute', left: '47%', top: '15%', width: '6%', height: '22%', borderRadius: '0.3em', background: tickColor || 'color-mix(in srgb, var(--kc) 80%, #000)', boxShadow: 'inset 0 0.04em 0.06em rgba(0,0,0,0.35)' }}></div>)}
        <div style={{ ...ABS, inset: '39%', background: 'radial-gradient(circle at 50% 70%, var(--k-face1), var(--k-face2))', boxShadow: 'inset 0 0.06em 0.12em rgba(0,0,0,0.2), 0 0.04em 0 rgba(255,255,255,0.6)' }}></div>
      </div>
    </div>
  );
}
