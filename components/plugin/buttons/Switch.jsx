import React from 'react';

/** Recessed track with a sliding raised thumb; every option label always visible (e.g. BARS 1|2). */
export function Switch({ options = ['1', '2'], value, defaultValue = 0, onChange, thumbColor = 'var(--pale-cyan)', width, height = 28, style }) {
  const [v, setV] = React.useState(value !== undefined ? value : defaultValue);
  React.useEffect(() => { if (value !== undefined) setV(value); }, [value]);
  const n = options.length;
  const W = width || (n === 2 ? 72 : n * 36);
  const tw = (W - 6) / n;
  const pick = (i) => { setV(i); if (onChange) onChange(i); };
  return (
    <div role="radiogroup" onClick={n === 2 ? () => pick(v === 0 ? 1 : 0) : undefined} style={{ position: 'relative', width: W, height, borderRadius: height / 2, background: 'var(--surface-inset)', boxShadow: 'var(--shadow-inset-sm)', display: 'flex', alignItems: 'center', cursor: 'pointer', userSelect: 'none', flex: 'none', ...style }}>
      <div style={{ position: 'absolute', top: 3, left: 3 + v * tw, width: tw, height: height - 6, borderRadius: (height - 6) / 2, background: thumbColor, boxShadow: 'var(--shadow-thumb)', transition: 'left var(--dur-base) var(--ease-standard)' }}></div>
      {options.map((o, i) => (
        <div key={i} role="radio" aria-checked={i === v} onClick={n === 2 ? undefined : () => pick(i)} style={{ position: 'relative', flex: 1, textAlign: 'center', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: i === v ? 'var(--text-primary)' : 'var(--text-inactive)' }}>{o}</div>
      ))}
    </div>
  );
}
