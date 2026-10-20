import React from 'react';

/** Play/stop: recessed housing around a raised inner button. Green triangle idle, accent square while playing. */
export function TransportButton({ playing, defaultPlaying = false, onToggle, size = 40, style }) {
  const [p, setP] = React.useState(playing !== undefined ? playing : defaultPlaying);
  React.useEffect(() => { if (playing !== undefined) setP(playing); }, [playing]);
  const inner = size * 0.75;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--surface-panel)', boxShadow: 'var(--shadow-inset-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', ...style }}>
      <div role="button" aria-label={p ? 'Stop' : 'Play'} onClick={() => { setP(!p); if (onToggle) onToggle(!p); }} style={{ width: inner, height: inner, borderRadius: '50%', background: 'var(--surface-panel)', boxShadow: p ? 'var(--shadow-inset-sm)' : 'var(--shadow-raised-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <svg width="12" height="12" viewBox="0 0 12 12">
          {p ? <rect x="3" y="3" width="6" height="6" rx="1" style={{ fill: 'var(--accent)' }}></rect>
             : <path d="M3.8 2 L10 6 L3.8 10 Z" style={{ fill: 'var(--transport-play)', stroke: 'var(--transport-play)', strokeWidth: 1, strokeLinejoin: 'round' }}></path>}
        </svg>
      </div>
    </div>
  );
}
