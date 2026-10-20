import React from 'react';

/** Raised neumorphic section card with an optional title row. */
export function Panel({ title, headerRight, children, padding = 14, gap = 14, tint, style, bodyStyle }) {
  const bg = tint ? 'color-mix(in srgb, ' + tint + ' 8%, var(--surface-panel))' : 'var(--surface-panel)';
  return (
    <div style={{ background: bg, borderRadius: 'var(--radius-panel)', padding, boxShadow: 'var(--shadow-raised)', display: 'flex', flexDirection: 'column', gap, boxSizing: 'border-box', minWidth: 0, ...style }}>
      {(title || headerRight) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 30, gap: 12 }}>
          {title && <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 16, letterSpacing: '-0.4px', color: 'var(--text-primary)' }}>{title}</div>}
          {headerRight && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>{headerRight}</div>}
        </div>
      )}
      {children !== undefined && <div style={{ display: 'flex', flexDirection: 'column', gap, flex: 1, minHeight: 0, ...bodyStyle }}>{children}</div>}
    </div>
  );
}
