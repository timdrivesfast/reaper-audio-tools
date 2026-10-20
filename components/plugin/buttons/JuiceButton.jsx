import React from 'react';

// Face artwork stored in the Reaper Audio Tools design system (assets/Juice). Pass `faces` or `assetBase` when used elsewhere.
const STORED_FACES = { off: '/images/juice-off.png', on: '/images/juice-on.png' };

/** JUICE — the suite's character toggle. Coral face off; angry red face with glow on. Ships in every plugin. */
export function JuiceButton({ on, defaultOn = false, onToggle, label = 'JUICE', showLabel = true, faceSize = 32, assetBase, faces, style }) {
  const [o, setO] = React.useState(on !== undefined ? on : defaultOn);
  const [press, setPress] = React.useState(false);
  React.useEffect(() => { if (on !== undefined) setO(on); }, [on]);
  const box = faceSize * 1.625;
  const d = faceSize * (press ? 0.93 : 1);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...style }}>
      <div role="switch" aria-checked={o} aria-label={label} onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)} onClick={() => { setO(!o); if (onToggle) onToggle(!o); }}
        style={{ width: box, height: box, margin: -(box - faceSize) / 2, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none', background: o ? 'radial-gradient(circle, rgba(255,59,59,0.75) 0%, rgba(255,59,59,0.6) 38%, rgba(255,59,59,0.12) 80%, rgba(255,59,59,0) 100%)' : 'transparent' }}>
        <img alt="" src={faces ? (o ? faces.on : faces.off) : assetBase !== undefined ? assetBase + (o ? 'assets/juice-on.png' : 'assets/juice-off.png') : (o ? STORED_FACES.on : STORED_FACES.off)} draggable="false" style={{ width: d, height: d, borderRadius: '50%', boxShadow: o ? 'none' : '2px 2px 5px var(--shade-dark), -2px -2px 5px var(--shade-light)', transition: 'width 80ms, height 80ms' }} />
      </div>
      {showLabel && <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: o ? 'var(--juice-label-on)' : 'var(--text-primary)', marginLeft: (box - faceSize) / 2 }}>{label}</div>}
    </div>
  );
}
