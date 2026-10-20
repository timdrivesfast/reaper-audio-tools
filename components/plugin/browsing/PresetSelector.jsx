import React from 'react';
import { RoundButton } from '../buttons/RoundButton.jsx';

function LcdList({ options, selected, onPick, width, align = 'right' }) {
  const [hov, setHov] = React.useState(-1);
  return (
    <div style={{ position: 'absolute', [align]: 0, top: 'calc(100% + 6px)', width, background: 'var(--lcd-bg)', border: '3px solid var(--lcd-border)', borderRadius: 4, padding: 4, zIndex: 50, boxShadow: 'var(--shadow-menu)', boxSizing: 'border-box' }}>
      {options.map((o, i) => (
        <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(-1)} onClick={(e) => { e.stopPropagation(); onPick(i); }}
          style={{ padding: '5px 8px', borderRadius: 2, fontFamily: 'var(--font-lcd)', fontSize: 13, color: i === selected ? 'var(--lcd-text)' : '#8E9098', background: i === selected ? 'var(--lcd-row-selected)' : i === hov ? 'var(--lcd-row-hover)' : 'transparent', cursor: 'pointer', whiteSpace: 'nowrap' }}>{String(o).toUpperCase()}</div>
      ))}
    </div>
  );
}
function useOutside(ref, open, close) {
  React.useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) close(); };
    document.addEventListener('pointerdown', h);
    return () => document.removeEventListener('pointerdown', h);
  }, [open]);
}

/** Preset stepper: ◀ LCD ▶. Click the LCD to open the LCD-styled list; arrows step and wrap. */
export function PresetSelector({ options = ['Disco', 'Boom Bap', 'Rock', 'Deep House', 'Techno', 'Trance'], value, defaultValue = 3, onChange, lcdWidth = 128, style }) {
  const [v, setV] = React.useState(value !== undefined ? value : defaultValue);
  React.useEffect(() => { if (value !== undefined) setV(value); }, [value]);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useOutside(ref, open, () => setOpen(false));
  const pick = (i) => { const n = (i + options.length) % options.length; setV(n); setOpen(false); if (onChange) onChange(n); };
  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', ...style }}>
      <RoundButton title="Previous preset" onClick={() => pick(v - 1)}>◀</RoundButton>
      <div onClick={() => setOpen(!open)} style={{ width: lcdWidth, background: 'var(--lcd-bg)', border: '3px solid var(--lcd-border)', borderRadius: 'var(--radius-lcd)', padding: '3px 12px', boxSizing: 'border-box', textAlign: 'center', fontFamily: 'var(--font-lcd)', fontSize: 15, lineHeight: 1.25, letterSpacing: '1px', color: 'var(--lcd-text)', boxShadow: 'var(--shadow-lcd)', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', userSelect: 'none' }}>{String(options[v]).toUpperCase()}</div>
      <RoundButton title="Next preset" onClick={() => pick(v + 1)}>▶</RoundButton>
      {open && <LcdList options={options} selected={v} onPick={pick} width={142} align="right" />}
    </div>
  );
}
