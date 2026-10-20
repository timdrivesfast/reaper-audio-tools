import React from 'react';

/** Dark navy dot-grid display — the base for every graph, meter and analyzer. Same in light and dark themes. */
export function Screen({ children, width = '100%', height = 160, radius = 8, dotPitch = 9, columns = 4, zeroLine = 0.5, style }) {
  const cols = [];
  for (let i = 1; i < columns; i++) cols.push(i / columns);
  return (
    <div style={{ position: 'relative', width, height, borderRadius: radius, overflow: 'hidden', background: 'radial-gradient(circle, rgba(58,74,104,0.55) 0.7px, transparent 1.1px) 0 0 / ' + dotPitch + 'px ' + dotPitch + 'px, var(--screen-navy)', boxSizing: 'border-box', flex: 'none', ...style }}>
      {cols.map((c) => <div key={c} style={{ position: 'absolute', top: 0, bottom: 0, left: c * 100 + '%', width: 1, background: 'rgba(42,58,84,0.6)' }}></div>)}
      {zeroLine != null && <div style={{ position: 'absolute', left: 0, right: 0, top: zeroLine * 100 + '%', height: 1, background: 'var(--screen-zero)' }}></div>}
      <div style={{ position: 'absolute', inset: 0 }}>{children}</div>
    </div>
  );
}
