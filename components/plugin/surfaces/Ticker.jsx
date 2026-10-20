import React from 'react';

/** Scrolling marquee strip — the suite's brand motif. Every plugin runs one edge to edge across the top. */
export function Ticker({ items = ['EASYDUCK', 'REAPER AUDIO TOOLS'], speed = 22, height = 20, background = 'var(--accent-ticker)', color = 'var(--ink-900)', paused = false, style }) {
  const unitRef = React.useRef(null);
  const trackRef = React.useRef(null);
  React.useEffect(() => {
    if (paused) return;
    let raf, last = 0, x = 0;
    const tick = (t) => {
      if (last) x += Math.min(0.1, (t - last) / 1000) * speed;
      last = t;
      const w = unitRef.current ? unitRef.current.offsetWidth : 200;
      if (trackRef.current) trackRef.current.style.transform = 'translateX(' + (-(x % w)) + 'px)';
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [speed, paused]);
  const unit = (k, ref) => (
    <div key={k} ref={ref} style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
      {items.map((t, i) => (
        <React.Fragment key={i}>
          <span style={{ whiteSpace: 'nowrap' }}>{t}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: color, margin: '0 4.5px', flex: 'none' }}></span>
        </React.Fragment>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" style={{ height, background, overflow: 'hidden', display: 'flex', alignItems: 'center', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 9.5, letterSpacing: '1px', color, userSelect: 'none', ...style }}>
      <div ref={trackRef} style={{ display: 'flex', willChange: 'transform' }}>
        {Array.from({ length: 14 }, (_, i) => unit(i, i === 0 ? unitRef : undefined))}
      </div>
    </div>
  );
}
