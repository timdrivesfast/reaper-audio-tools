import React from 'react';

/** A/B compare: two-slot switch plus a copy button (copies the active slot to the other). */
export function ABCompare({ value, defaultValue = 'A', onChange, onCopy, style }) {
  const [v, setV] = React.useState(value || defaultValue);
  React.useEffect(() => { if (value) setV(value); }, [value]);
  const [down, setDown] = React.useState(false);
  const pick = (n) => { setV(n); if (onChange) onChange(n); };
  const digit = (t) => <div style={{ position: 'relative', flex: 1, textAlign: 'center', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: v === t ? 'var(--text-primary)' : 'var(--text-inactive)' }}>{t}</div>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      <div role="radiogroup" aria-label="A/B compare" onClick={() => pick(v === 'A' ? 'B' : 'A')} style={{ position: 'relative', width: 72, height: 28, borderRadius: 14, background: 'var(--surface-inset)', boxShadow: 'var(--shadow-inset-sm)', display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
        <div style={{ position: 'absolute', top: 3, left: v === 'A' ? 3 : 36, width: 33, height: 22, borderRadius: 11, background: 'var(--pale-yellow)', boxShadow: 'var(--shadow-thumb)', transition: 'left var(--dur-base) var(--ease-standard)' }}></div>
        {digit('A')}{digit('B')}
      </div>
      <div role="button" title={'Copy ' + v + ' to ' + (v === 'A' ? 'B' : 'A')} onPointerDown={() => setDown(true)} onPointerUp={() => setDown(false)} onPointerLeave={() => setDown(false)} onClick={() => onCopy && onCopy(v)}
        style={{ height: 26, padding: '0 10px', borderRadius: 13, background: 'var(--surface-panel)', boxShadow: down ? 'var(--shadow-inset-sm)' : 'var(--shadow-raised-sm)', display: 'flex', alignItems: 'center', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 11, letterSpacing: '0.3px', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>{v + ' → ' + (v === 'A' ? 'B' : 'A')}</div>
    </div>
  );
}
