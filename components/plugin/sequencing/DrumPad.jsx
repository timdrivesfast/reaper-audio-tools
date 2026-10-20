import React from 'react';

/** Pastel trigger pad. Raised at rest; pressed + brightened while hit. */
export function DrumPad({ label, color = 'var(--pale-pink)', size = 96, active = false, onTrigger, style }) {
  const [hit, setHit] = React.useState(false);
  const on = hit || active;
  return (
    <div role="button" aria-label={label} onPointerDown={() => { setHit(true); if (onTrigger) onTrigger(); }} onPointerUp={() => setHit(false)} onPointerLeave={() => setHit(false)}
      style={{ width: size, height: size, borderRadius: 4, background: color, boxShadow: on ? 'inset 3px 3px 7px rgba(0,0,0,0.14), inset -2px -2px 5px var(--shade-light)' : '3px 3px 7px var(--shade-dark), -2px -2px 5px var(--shade-light)', filter: on ? 'brightness(1.05) saturate(1.2)' : 'none', position: 'relative', cursor: 'pointer', userSelect: 'none', flex: 'none', transition: 'box-shadow 60ms, filter 60ms', ...style }}>
      {label && <div style={{ position: 'absolute', left: 8, bottom: 6, fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 12, letterSpacing: '0.3px', color: 'var(--ink-900)', opacity: 0.7 }}>{label}</div>}
    </div>
  );
}
