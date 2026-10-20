import React from 'react';

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function useValue(value, fallback, onChange) {
  const [v, setV] = React.useState(value !== undefined ? value : fallback);
  React.useEffect(() => { if (value !== undefined) setV(value); }, [value]);
  return [v, (n) => { setV(n); if (onChange) onChange(n); }];
}
function startDrag(e, onMove, onEnd) {
  e.preventDefault();
  const sx = e.clientX, sy = e.clientY;
  const mv = (ev) => onMove(ev.clientX - sx, ev.clientY - sy, ev);
  const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (onEnd) onEnd(); };
  window.addEventListener('pointermove', mv);
  window.addEventListener('pointerup', up);
}

/** Vertical fader. channel = sculpted white cap with a colour glow (WET, band gain); master = flat notched cap in a tall raised pill well (OUT). */
export function Fader({ value, defaultValue = 0.75, onChange, variant = 'channel', height = 200, color = 'var(--accent)', label, style }) {
  const [v, setV] = useValue(value, defaultValue, onChange);
  const ref = React.useRef(null);
  const master = variant === 'master';
  const capH = master ? 18 : 46;
  const setFromY = (y) => { const r = ref.current.getBoundingClientRect(); setV(clamp(1 - (y - r.top - capH / 2) / (r.height - capH), 0, 1)); };
  const down = (e) => { setFromY(e.clientY); startDrag(e, (dx, dy, ev) => setFromY(ev.clientY)); };
  const top = (1 - v) * (height - capH);
  const lab = label && <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)' }}>{label}</div>;
  const track = (
    <div ref={ref} onPointerDown={down} role="slider" aria-label={label} aria-valuenow={Math.round(v * 100)} style={{ position: 'relative', width: master ? 56 : 46, height, cursor: 'ns-resize', touchAction: 'none', flex: 'none' }}>
      <div style={{ position: 'absolute', left: '50%', top: capH / 2 - 4, bottom: capH / 2 - 4, width: 8, marginLeft: -4, borderRadius: 4, background: 'linear-gradient(90deg, #6E7078, #A3A5AC 55%, #7A7C84)', boxShadow: 'var(--shadow-track)' }}></div>
      {master ? (
        <div style={{ position: 'absolute', left: '50%', top, width: 54, height: 18, marginLeft: -27, borderRadius: 9, background: 'linear-gradient(180deg, var(--cap-white), var(--cap-grey))', boxShadow: 'var(--shadow-cap)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <div style={{ width: 3, height: 6, borderRadius: 2, border: '1px solid var(--cap-grip)' }}></div><div style={{ width: 2, height: 12, background: 'var(--cap-grip)' }}></div><div style={{ width: 3, height: 6, borderRadius: 2, border: '1px solid var(--cap-grip)' }}></div>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: '50%', top, width: 38, height: 46, marginLeft: -19, borderRadius: '11px 11px 14px 14px / 9px 9px 18px 18px', background: 'linear-gradient(180deg, var(--cap-white) 30%, var(--cap-grey))', boxShadow: 'var(--shadow-cap), 0 8px 14px color-mix(in srgb, ' + color + ' 30%, transparent)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, paddingBottom: 8, boxSizing: 'border-box' }}>
          <div style={{ width: 20, height: 2, borderRadius: 1, background: 'var(--cap-grip)' }}></div><div style={{ width: 20, height: 2, borderRadius: 1, background: 'var(--cap-grip)' }}></div><div style={{ width: 16, height: 2, borderRadius: 1, background: 'var(--cap-grip)' }}></div>
        </div>
      )}
    </div>
  );
  if (master) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '22px 16px 34px', borderRadius: 999, background: 'var(--surface-panel)', boxShadow: 'var(--shadow-raised)', flex: 'none', ...style }}>{lab}{track}</div>
    );
  }
  return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, flex: 'none', ...style }}>{lab}{track}</div>;
}
