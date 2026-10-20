import React from 'react';

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

/** LCD-styled dropdown for routing, input/output, oversampling, mode. Optional control label on the left. */
export function LcdSelect({ label, options = ['IN 1/2', 'IN 3/4', 'SIDECHAIN'], value, defaultValue = 0, onChange, width = 132, style }) {
  const [v, setV] = React.useState(value !== undefined ? value : defaultValue);
  React.useEffect(() => { if (value !== undefined) setV(value); }, [value]);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  useOutside(ref, open, () => setOpen(false));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...style }}>
      {label && <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)' }}>{label}</div>}
      <div ref={ref} style={{ position: 'relative' }}>
        <div onClick={() => setOpen(!open)} style={{ width, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, background: 'var(--lcd-bg)', border: '3px solid var(--lcd-border)', borderRadius: 'var(--radius-lcd)', padding: '2px 8px', boxSizing: 'border-box', fontFamily: 'var(--font-lcd)', fontSize: 13, lineHeight: 1.25, color: 'var(--lcd-text)', boxShadow: 'var(--shadow-lcd)', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
          <span style={{ overflow: 'hidden' }}>{String(options[v]).toUpperCase()}</span><span style={{ fontSize: 9, opacity: 0.8 }}>▼</span>
        </div>
        {open && <LcdList options={options} selected={v} width={width} align="left" onPick={(i) => { setV(i); setOpen(false); if (onChange) onChange(i); }} />}
      </div>
    </div>
  );
}
