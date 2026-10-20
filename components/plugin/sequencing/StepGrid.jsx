import React from 'react';

/** Velocity step sequencer. Click empty = add (100); click filled = select; click selected = delete; vertical drag on a filled step = velocity. steps = velocities (0 = empty). */
export function StepGrid({ steps, defaultSteps = [100, 0, 0, 0, 100, 0, 0, 0, 100, 0, 0, 0, 100, 0, 0, 0], selected, onChange, onSelect, stepsPerBeat = 4, stepsPerBar = 16, swing = 0, playStep = -1, height = 130, style }) {
  const [s, setS] = React.useState(steps || defaultSteps);
  React.useEffect(() => { if (steps) setS(steps); }, [steps]);
  const [sel, setSel] = React.useState(selected !== undefined ? selected : -1);
  React.useEffect(() => { if (selected !== undefined) setSel(selected); }, [selected]);
  const commit = (n) => { setS(n); if (onChange) onChange(n); };
  const select = (i) => { setSel(i); if (onSelect) onSelect(i); };
  const total = s.length, dense = total > 32;
  const gap = total > 64 ? 1 : dense ? 2 : 5;
  const perBeatInt = Math.abs(stepsPerBeat - Math.round(stepsPerBeat)) < 0.001;
  const down = (i) => (e) => {
    e.preventDefault();
    const y0 = e.clientY, v0 = s[i]; let dragged = false;
    const mv = (ev) => {
      if (!s[i]) return; const dy = y0 - ev.clientY;
      if (!dragged && Math.abs(dy) < 4) return; dragged = true;
      const n = s.slice(); n[i] = Math.max(1, Math.min(100, Math.round(v0 + dy * 0.9))); commit(n); select(i);
    };
    const up = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      if (dragged) return;
      const n = s.slice();
      if (!s[i]) { n[i] = 100; commit(n); } else if (sel !== i) select(i); else { n[i] = 0; commit(n); select(-1); }
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };
  return (
    <div style={{ background: 'var(--surface-inset)', borderRadius: 'var(--radius-inset)', boxShadow: 'var(--shadow-inset)', padding: '12px 10px', display: 'flex', height, boxSizing: 'border-box', minWidth: 0, ...style }}>
      {s.map((vel, i) => {
        const bar = i > 0 && i % stepsPerBar === 0;
        const beat = !bar && i > 0 && perBeatInt && i % Math.round(stepsPerBeat) === 0;
        const g = i === 0 ? 0 : bar ? gap + 4 : beat ? gap * 2 + 2 : gap;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', minWidth: 0, marginLeft: bar ? g / 2 : g, borderLeft: bar ? '2px solid var(--shade-dark-tight)' : 'none', paddingLeft: bar ? g / 2 : 0 }}>
            <div onPointerDown={down(i)} style={{ flex: 1, position: 'relative', borderRadius: 'var(--radius-cell)', background: vel ? 'var(--accent-wash)' : 'var(--surface-cell)', boxShadow: dense ? '0 1px 1px var(--shade-dark)' : 'var(--shadow-cell)', overflow: 'hidden', cursor: vel ? 'ns-resize' : 'pointer', touchAction: 'none', transform: i % 2 ? 'translateX(' + swing * 0.32 + '%)' : 'none' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: (vel || 0) + '%', background: 'var(--accent-fill)' }}></div>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.45)', opacity: playStep === i ? 1 : 0, transition: 'opacity 60ms' }}></div>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 'var(--radius-cell)', boxShadow: sel === i && vel ? 'inset 0 0 0 3px var(--accent)' : 'none', pointerEvents: 'none' }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
