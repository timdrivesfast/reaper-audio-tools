import React from 'react';

/** Label-less latching switch: a raised button in the plugin surface colour with a recessed lamp well — accent when on, wash when off. */
export function StaticSwitch({ on, defaultOn = false, onToggle, size = 36, shape = 'round', color = 'var(--accent)', wash, title, style }) {
  const [o, setO] = React.useState(on !== undefined ? on : defaultOn);
  React.useEffect(() => { if (on !== undefined) setO(on); }, [on]);
  const [down, setDown] = React.useState(false);
  const pill = shape === 'pill';
  const W = pill ? size * 1.6 : size, H = size;
  const r = shape === 'square' ? 8 : H / 2;
  const off = wash || 'color-mix(in srgb, ' + color + ' 18%, var(--surface-panel))';
  return (
    <div role="switch" aria-checked={o} aria-label={title} title={title}
      onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      onClick={() => { setO(!o); if (onToggle) onToggle(!o); }}
      style={{ width: W, height: H, borderRadius: r, background: 'var(--surface-panel)', boxShadow: down ? 'var(--shadow-raised-sm), inset 1px 1px 3px var(--shade-dark)' : 'var(--shadow-raised-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', transform: down ? 'scale(0.97)' : 'none', transition: 'transform 80ms', ...style }}>
      <div style={{ width: W - H * 0.44, height: H * 0.56, borderRadius: shape === 'square' ? 4 : H * 0.28, background: o ? color : off, boxShadow: o ? 'inset 1px 1px 3px rgba(0,0,0,0.22), 0 0 8px color-mix(in srgb, ' + color + ' 45%, transparent)' : 'var(--shadow-inset-sm)', transition: 'background var(--dur-fast), box-shadow var(--dur-fast)' }}></div>
    </div>
  );
}
