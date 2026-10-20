import React from 'react';

/** Black LCD value box with yellow Share Tech Mono digits. Every numeric value and preset name renders through it. */
export function Lcd({ children, size = 13, color = 'var(--lcd-text)', minWidth, width, align = 'center', tracking = 0, padding = '2px 8px', onClick, style }) {
  // Like JUCE drawFittedText: shrink the text (down to 50%) rather than clip it.
  const ref = React.useRef(null);
  const [fs, setFs] = React.useState(size);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    let f = size; el.style.fontSize = f + 'px';
    while (el.scrollWidth > el.clientWidth + 0.5 && f > size * 0.5) { f -= 0.5; el.style.fontSize = f + 'px'; }
    if (f !== fs) setFs(f);
  });
  return (
    <div ref={ref} onClick={onClick} style={{ background: 'var(--lcd-bg)', border: '3px solid var(--lcd-border)', borderRadius: 'var(--radius-lcd)', padding, minWidth, width, boxSizing: 'border-box', textAlign: align, fontFamily: 'var(--font-lcd)', fontSize: fs, lineHeight: 1.25, letterSpacing: tracking, color, boxShadow: 'var(--shadow-lcd)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip', cursor: onClick ? 'pointer' : 'default', userSelect: 'none', flex: 'none', ...style }}>{children}</div>
  );
}
