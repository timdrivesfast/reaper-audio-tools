import React from 'react';

const RING = 'conic-gradient(from 200deg, #B9A3F4, #7FDDF5, #A9EE85, #FAC38F, #FFB3C7, #B9A3F4)';
const ABS = { position: 'absolute', borderRadius: '50%' };

/** JUICE as shipped from EasyDuck 1.2.3: the knob family's pastel ring around a knob-face cap. Latching.
 *  Off: cap raised. Pressed or on: cap sinks to 94%, concave. On: the ring saturates and glows. Mirrors RingButton.h. */
export function RingButton({ on, defaultOn = false, onToggle, label = 'JUICE', size = 36, style }) {
  const [o, setO] = React.useState(on !== undefined ? on : defaultOn);
  const [press, setPress] = React.useState(false);
  React.useEffect(() => { if (on !== undefined) setO(on); }, [on]);
  const D = size, sunk = o || press, s = sunk ? 0.94 : 1;
  const cap = D * 0.72 * s, dim = D * 0.24 * s;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...style }}>
      <div role="switch" aria-checked={o} aria-label={label} onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
        onClick={() => { setO(!o); if (onToggle) onToggle(!o); }}
        style={{ position: 'relative', width: D, height: D, flex: 'none', cursor: 'pointer' }}>
        <div style={{ ...ABS, inset: -D * 0.1, background: RING, filter: `saturate(1.3) blur(${D * 0.06}px)`, opacity: o ? 0.6 : 0, transition: 'opacity 180ms ease' }}></div>
        <div style={{ ...ABS, inset: 0, background: RING, boxShadow: `${D * 0.04}px ${D * 0.045}px ${D * 0.09}px var(--k-lo), ${-D * 0.035}px ${-D * 0.035}px ${D * 0.08}px var(--k-hi)` }}></div>
        <div style={{ ...ABS, inset: 0, background: RING, filter: 'saturate(1.35) brightness(1.04)', opacity: o ? 1 : 0, transition: 'opacity 180ms ease' }}></div>
        <div style={{ ...ABS, width: cap, height: cap, left: (D - cap) / 2, top: (D - cap) / 2, transition: 'all 80ms ease',
          background: sunk ? 'radial-gradient(circle at 50% 60%, var(--k-face2), var(--k-face1) 90%)' : 'radial-gradient(circle at 40% 28%, var(--k-face1), var(--k-face2) 78%)',
          boxShadow: sunk ? `inset ${D * 0.02}px ${D * 0.026}px ${D * 0.045}px rgba(0,0,0,.3), inset ${-D * 0.012}px ${-D * 0.014}px ${D * 0.03}px rgba(255,255,255,.55)`
            : `0 ${D * 0.022}px ${D * 0.045}px rgba(0,0,0,.28), 0 ${D * 0.005}px ${D * 0.008}px rgba(0,0,0,.2), inset 0 ${D * 0.007}px ${D * 0.005}px rgba(255,255,255,.75), inset 0 ${-D * 0.018}px ${D * 0.03}px rgba(0,0,0,.07)` }}></div>
        <div style={{ ...ABS, width: dim, height: dim, left: (D - dim) / 2, top: (D - dim) / 2, transition: 'all 80ms ease', background: 'radial-gradient(circle at 50% 70%, var(--k-face1), var(--k-face2))',
          boxShadow: `0 ${D * 0.004}px 0 rgba(255,255,255,${sunk ? 0.4 : 0.6}), inset 0 ${D * (sunk ? 0.008 : 0.006)}px ${D * (sunk ? 0.016 : 0.012)}px rgba(0,0,0,${sunk ? 0.28 : 0.2})` }}></div>
      </div>
      {label && <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)' }}>{label}</div>}
    </div>
  );
}
