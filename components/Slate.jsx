'use client';

import React from 'react';

/**
 * A plugin interface mounted on a floating hardware slate: a machined base with
 * corner screws, a stacked edge for thickness and a soft shadow underneath.
 * The plugin renders at its native width and is scaled to fit the container.
 *
 * tilt: lay the slate back in perspective (hero use). interactive: let people use the controls.
 */
export default function Slate({ nativeWidth = 1040, maxScale = 1, tilt = false, interactive = false, children, label, sticker, style }) {
  const outer = React.useRef(null);
  const inner = React.useRef(null);
  const [box, setBox] = React.useState({ scale: 0.5, h: 0, ready: false });
  const pad = 22;

  React.useLayoutEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return;
      const avail = outer.current.clientWidth;
      const scale = Math.min(maxScale, avail / (nativeWidth + pad * 2));
      setBox({ scale, h: inner.current.offsetHeight * scale, ready: true });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer.current);
    ro.observe(inner.current);
    return () => ro.disconnect();
  }, [nativeWidth, maxScale]);

  return (
    <div ref={outer} className={'slate' + (tilt ? ' slate--tilt' : '')} style={style}>
      <div className="slate__stage" style={{ height: box.h || undefined, visibility: box.ready ? 'visible' : 'hidden' }}>
        <div
          ref={inner}
          className="slate__body"
          role={interactive ? undefined : 'img'}
          aria-label={interactive ? undefined : label}
          style={{ width: nativeWidth + pad * 2, padding: pad, transform: `scale(${box.scale})`, pointerEvents: interactive ? 'auto' : 'none' }}
        >
          <span className="slate__screw slate__screw--tl" aria-hidden="true"></span>
          <span className="slate__screw slate__screw--tr" aria-hidden="true"></span>
          <span className="slate__screw slate__screw--bl" aria-hidden="true"></span>
          <span className="slate__screw slate__screw--br" aria-hidden="true"></span>
          <div className="slate__plugin" aria-hidden={interactive ? undefined : 'true'}>{children}</div>
        </div>
        {sticker}
      </div>
    </div>
  );
}
