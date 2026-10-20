import React from 'react';
import { Pill } from './Pill.jsx';

/** Single-select row of independent pills (e.g. NOTE 1/4 · 1/8 · 1/16). */
export function PillGroup({ options = [], value, defaultValue = 0, onChange, onColor = 'var(--accent-soft)', gap = 10, padX = 12, style }) {
  const [v, setV] = React.useState(value !== undefined ? value : defaultValue);
  React.useEffect(() => { if (value !== undefined) setV(value); }, [value]);
  return (
    <div role="radiogroup" style={{ display: 'flex', gap, flexWrap: 'wrap', ...style }}>
      {options.map((o, i) => <Pill key={i} on={i === v} onColor={onColor} padX={padX} onClick={() => { setV(i); if (onChange) onChange(i); }}>{o}</Pill>)}
    </div>
  );
}
