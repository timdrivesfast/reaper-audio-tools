import React from 'react';

/** Neumorphic pill. Off = raised panel; on = pressed + pale tint. Text stays dark — the shadow carries the state. */
export function Pill({ children, on = false, onClick, onColor = 'var(--accent-soft)', padX = 12, height = 30, disabled = false, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div role="button" aria-pressed={on} onClick={disabled ? undefined : onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: '0 ' + padX + 'px', height, borderRadius: height / 2, background: on ? onColor : 'var(--surface-panel)', boxShadow: on ? 'var(--shadow-inset-sm)' : 'var(--shadow-raised-sm)', filter: hover && !on && !disabled ? 'brightness(0.98)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.45 : 1, userSelect: 'none', flex: 'none', boxSizing: 'border-box', transition: 'box-shadow var(--dur-fast), background var(--dur-fast)', ...style }}>{children}</div>
  );
}
