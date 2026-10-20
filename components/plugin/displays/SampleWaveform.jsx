import React from 'react';

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
function startDrag(e, onMove, onEnd) {
  e.preventDefault(); e.stopPropagation();
  const sx = e.clientX, sy = e.clientY;
  const mv = (ev) => onMove(ev.clientX - sx, ev.clientY - sy, ev);
  const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (onEnd) onEnd(); };
  window.addEventListener('pointermove', mv);
  window.addEventListener('pointerup', up);
}

function peaks(seed, n) {
  let s = seed * 9301 + 49297; const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const hits = [0.02, 0.27, 0.5, 0.63, 0.77];
  return Array.from({ length: n }, (_, i) => {
    const x = i / n; let a = 0.04;
    hits.forEach((h, k) => { if (x >= h) a += (k % 2 ? 0.55 : 0.95) * Math.exp(-(x - h) * (k % 2 ? 22 : 9)); });
    return Math.min(1, a * (0.55 + rnd() * 0.45));
  });
}

/** Sample waveform with a draggable start/end region and optional playhead. Region 0..1. */
export function SampleWaveform({ start = 0.1, end = 0.7, onChange, playhead, seed = 3, bars = 200, height = 120, style }) {
  const [r, setR] = React.useState({ start, end });
  React.useEffect(() => setR({ start, end }), [start, end]);
  const ref = React.useRef(null);
  const data = React.useMemo(() => peaks(seed, bars), [seed, bars]);
  const emit = (n) => { setR(n); if (onChange) onChange(n); };
  const drag = (which) => (e) => {
    const rect = ref.current.getBoundingClientRect(); const s0 = r;
    startDrag(e, (dx, dy, ev) => {
      const x = clamp((ev.clientX - rect.left) / rect.width, 0, 1);
      if (which === 'start') emit({ ...s0, start: Math.min(x, s0.end - 0.02) });
      else if (which === 'end') emit({ ...s0, end: Math.max(x, s0.start + 0.02) });
      else { const w = s0.end - s0.start; const d = clamp(dx / rect.width, -s0.start, 1 - s0.end); emit({ start: s0.start + d, end: s0.start + d + w }); }
    });
  };
  const handle = (pos, which) => (
    <div onPointerDown={drag(which)} style={{ position: 'absolute', top: 0, bottom: 0, left: pos * 100 + '%', width: 14, marginLeft: -7, cursor: 'ew-resize', touchAction: 'none' }}>
      <div style={{ position: 'absolute', left: 6, top: 0, bottom: 0, width: 2, background: 'var(--accent)' }}></div>
      <div style={{ position: 'absolute', left: which === 'start' ? 7 : -3, top: 0, width: 10, height: 14, background: 'var(--accent)', borderRadius: which === 'start' ? '0 3px 3px 0' : '3px 0 0 3px' }}></div>
    </div>
  );
  return (
    <div ref={ref} style={{ position: 'relative', height, borderRadius: 8, overflow: 'hidden', background: 'radial-gradient(circle, rgba(58,74,104,0.55) 0.7px, transparent 1.1px) 0 0 / 9px 9px, var(--screen-navy)', ...style }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: 'var(--screen-zero)' }}></div>
      <svg viewBox={'0 0 ' + bars + ' 100'} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {data.map((a, i) => <rect key={i} x={i + 0.15} width="0.7" y={50 - a * 44} height={Math.max(0.6, a * 88)} style={{ fill: 'var(--screen-signal)', fillOpacity: 0.8 }}></rect>)}
      </svg>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: r.start * 100 + '%', background: 'rgba(20,27,46,0.62)' }}></div>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: r.end * 100 + '%', right: 0, background: 'rgba(20,27,46,0.62)' }}></div>
      <div onPointerDown={drag('move')} style={{ position: 'absolute', top: 0, bottom: 0, left: r.start * 100 + '%', width: (r.end - r.start) * 100 + '%', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', cursor: 'grab', touchAction: 'none' }}></div>
      {playhead != null && <div style={{ position: 'absolute', top: 0, bottom: 0, left: playhead * 100 + '%', width: 1.5, background: '#FFFFFF', boxShadow: '0 0 6px rgba(255,255,255,0.6)' }}></div>}
      {handle(r.start, 'start')}{handle(r.end, 'end')}
    </div>
  );
}
