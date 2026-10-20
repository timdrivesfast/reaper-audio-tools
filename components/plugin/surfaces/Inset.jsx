import React from 'react';

/** Recessed well — the surface a grid, switch track or light display sits inside. */
export function Inset({ children, padding = 6, radius = 8, size = 'md', style }) {
  return (
    <div style={{ background: 'var(--surface-inset)', borderRadius: radius, boxShadow: size === 'sm' ? 'var(--shadow-inset-sm)' : 'var(--shadow-inset)', padding, boxSizing: 'border-box', minWidth: 0, ...style }}>{children}</div>
  );
}
