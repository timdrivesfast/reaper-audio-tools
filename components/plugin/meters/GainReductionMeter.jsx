import React from 'react';

function useAnimationFrame(active, fps, fn) {
  const ref = React.useRef(fn); ref.current = fn;
  React.useEffect(() => {
    if (!active) return;
    let raf, last = 0;
    const loop = (t) => { if (t - last > 1000 / fps) { last = t; ref.current(t / 1000); } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, fps]);
}

/** Gain-reduction meter: bar grows from 0 dB toward -range in the signature accent, on the navy screen. */
export function GainReductionMeter({ value, range = 24, orientation = 'horizontal', length = 260, thickness = 22, demo = false, label = 'GR', style }) {
  const [live, setLive] = React.useState(6);
  useAnimationFrame(demo && value === undefined, 30, (t) => setLive(Math.max(0, 7 + 5 * Math.sin(t * 3.2) + 2 * Math.sin(t * 11))));
  const gr = Math.min(range, Math.abs(value !== undefined ? value : live));
  const p = gr / range * 100;
  const ticks = [0, 3, 6, 12, range].filter((x, i, a) => x <= range && a.indexOf(x) === i);
  const horiz = orientation === 'horizontal';
  const scr = { position: 'relative', borderRadius: 6, overflow: 'hidden', background: 'radial-gradient(circle, rgba(58,74,104,0.55) 0.7px, transparent 1.1px) 0 0 / 9px 9px, var(--screen-navy)' };
  const bar = { position: 'absolute', background: 'linear-gradient(' + (horiz ? 'to left' : 'to bottom') + ', var(--accent-fill), var(--accent))', boxShadow: '0 0 10px color-mix(in srgb, var(--accent) 40%, transparent)', transition: 'all 60ms linear' };
  const stripes = { position: 'absolute', inset: 0, background: 'repeating-linear-gradient(' + (horiz ? 'to right' : 'to bottom') + ', transparent 0 3px, rgba(20,27,46,0.55) 3px 4px)' };
  const tickTxt = { fontFamily: 'var(--font-lcd)', fontSize: 9, color: 'var(--text-secondary)', position: 'absolute' };
  if (horiz) {
    return (
      <div style={{ width: length, flex: 'none', ...style }}>
        <div style={{ ...scr, height: thickness }}>
          <div style={{ ...bar, right: 0, top: 3, bottom: 3, width: p + '%' }}></div><div style={stripes}></div>
        </div>
        <div style={{ position: 'relative', height: 14, marginTop: 3 }}>
          {ticks.map((tk) => <div key={tk} style={{ ...tickTxt, right: (tk / range * 100) + '%', transform: tk === 0 ? 'none' : tk === range ? 'translateX(100%)' : 'translateX(50%)' }}>{tk === 0 ? '0' : '-' + tk}</div>)}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 6, flex: 'none', ...style }}>
      <div style={{ ...scr, width: thickness, height: length }}>
        <div style={{ ...bar, top: 0, left: 3, right: 3, height: p + '%' }}></div><div style={stripes}></div>
      </div>
      <div style={{ position: 'relative', width: 20, height: length }}>
        {ticks.map((tk) => <div key={tk} style={{ ...tickTxt, top: (tk / range * 100) + '%', transform: tk === 0 ? 'none' : tk === range ? 'translateY(-100%)' : 'translateY(-50%)' }}>{tk === 0 ? '0' : '-' + tk}</div>)}
      </div>
    </div>
  );
}
