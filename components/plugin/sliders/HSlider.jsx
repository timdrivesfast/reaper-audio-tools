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

/** Horizontal slider: label · grooved track with fill · grip-lined fader cap · LCD readout (e.g. VELOCITY). */
export function HSlider({ label, value, defaultValue = 100, min = 0, max = 100, onChange, accentLabel = false, labelWidth = 76, valueWidth = 52, format, fillColor = 'var(--accent-fill)', style }) {
  const [v, setV] = useValue(value, defaultValue, onChange);
  const [hot, setHot] = React.useState(false);
  const ref = React.useRef(null);
  const pct = max > min ? (v - min) / (max - min) * 100 : 0;
  const setFromX = (x) => { const r = ref.current.getBoundingClientRect(); setV(Math.round(clamp(min + (x - r.left - 20) / Math.max(1, r.width - 40) * (max - min), min, max))); };
  const down = (e) => { setHot(true); setFromX(e.clientX); startDrag(e, (dx, dy, ev) => setFromX(ev.clientX), () => setHot(false)); };
  const text = format ? format(v) : String(Math.round(v)).padStart(3, '0');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, ...style }}>
      {label && <div style={{ width: labelWidth, flex: 'none', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: accentLabel ? 'var(--accent)' : 'var(--text-primary)' }}>{label}</div>}
      <div ref={ref} onPointerDown={down} onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)} style={{ flex: 1, minWidth: 40, height: 26, display: 'flex', alignItems: 'center', cursor: 'ew-resize', touchAction: 'none' }}>
        <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'var(--surface-track)', boxShadow: 'var(--shadow-track)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 'calc((100% - 40px) * ' + (pct / 100) + ' + 20px)', borderRadius: 4, background: fillColor }}></div>
          <div style={{ position: 'absolute', left: 'calc((100% - 40px) * ' + (pct / 100) + ')', top: '50%', width: 40, height: 22, marginTop: -11, borderRadius: 'var(--radius-cap)', background: 'linear-gradient(180deg, var(--cap-white), var(--cap-grey))', boxShadow: 'var(--shadow-cap)' + (hot ? ', 0 0 9px color-mix(in srgb, var(--accent) 30%, transparent)' : ''), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <div style={{ width: 1.5, height: 10, background: 'var(--cap-grip)' }}></div><div style={{ width: 1.5, height: 10, background: 'var(--cap-grip)' }}></div><div style={{ width: 1.5, height: 10, background: 'var(--cap-grip)' }}></div>
          </div>
        </div>
      </div>
      <div style={{ width: valueWidth, flex: 'none', background: 'var(--lcd-bg)', border: '3px solid var(--lcd-border)', borderRadius: 'var(--radius-lcd)', padding: '2px 4px', boxSizing: 'border-box', textAlign: 'center', fontFamily: 'var(--font-lcd)', fontSize: 13, lineHeight: 1.25, color: 'var(--lcd-text)', boxShadow: 'var(--shadow-lcd)' }}>{text}</div>
    </div>
  );
}
