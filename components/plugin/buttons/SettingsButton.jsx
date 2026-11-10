import React from 'react';

/** The suite's settings control: an 11px gear riding the right end of the marquee. Ink on the ticker colour; inverts while its menu is open. */
export function SettingsButton({ open = false, onClick, title = 'Settings', style }) {
  const [hover, setHover] = React.useState(false);
  const ink = open ? 'var(--accent-ticker)' : 'var(--ink-900)';
  return (
    <div role="button" aria-label={title} title={title} aria-expanded={open} data-settings-button="1" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', background: open ? 'var(--ink-900)' : 'transparent', opacity: open || hover ? 1 : 0.78, transition: 'opacity var(--dur-fast), background var(--dur-fast)', ...style }}>
      <svg width="12" height="12" viewBox="0 0 14 14" style={{ display: 'block', transform: hover && !open ? 'rotate(30deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-standard)' }}>
        <circle cx="7" cy="7" r="5.3" fill="none" stroke={ink} strokeWidth="2.4" strokeDasharray="2.08 2.08"></circle>
        <circle cx="7" cy="7" r="3.5" fill="none" stroke={ink} strokeWidth="1.7"></circle>
      </svg>
    </div>
  );
}
