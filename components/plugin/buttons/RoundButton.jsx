import React from 'react';

/** Small raised circular button for a glyph (◀ ▶, undo, settings). Presses in on mousedown. */
export function RoundButton({ children, size = 26, onClick, active = false, glyphSize = 11, title, style }) {
  const [down, setDown] = React.useState(false);
  const pressed = down || active;
  return (
    <div role="button" title={title} aria-label={title} onClick={onClick} onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)}
      style={{ width: size, height: size, borderRadius: '50%', background: 'var(--surface-panel)', boxShadow: pressed ? 'var(--shadow-inset-sm)' : 'var(--shadow-raised-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: glyphSize, color: active ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none', flex: 'none', fontFamily: 'var(--font-ui)', fontWeight: 600, ...style }}>{children}</div>
  );
}
