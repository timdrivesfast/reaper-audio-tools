import React from 'react';

/** Upright capsule toggle with a letter or short word (S, M, Ø, BYP). Off = faint tint raised; on = full pale fill pressed. */
export function CapsuleToggle({ children, on, defaultOn = false, onToggle, color = 'var(--pale-yellow)', width = 26, height = 46, title, style }) {
  const [o, setO] = React.useState(on !== undefined ? on : defaultOn);
  React.useEffect(() => { if (on !== undefined) setO(on); }, [on]);
  return (
    <div role="switch" aria-checked={o} title={title} aria-label={title} onClick={() => { setO(!o); if (onToggle) onToggle(!o); }}
      style={{ width, height, borderRadius: Math.min(width, height) / 2, background: o ? color : 'color-mix(in srgb, ' + color + ' 35%, var(--surface-panel))', boxShadow: o ? 'var(--shadow-inset-sm)' : 'var(--shadow-raised-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)', cursor: 'pointer', userSelect: 'none', flex: 'none', transition: 'box-shadow var(--dur-fast), background var(--dur-fast)', ...style }}>{children}</div>
  );
}
