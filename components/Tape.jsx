import { Ticker } from './web';

/**
 * The ticker as background tape: a strip slapped diagonally across a section.
 * Decorative only. The host section needs className="tape-host".
 */
export default function Tape({ items = ['REAPER AUDIO TOOLS', 'PRECISION AUDIO TOOLS'], tone = 'coral', angle = -6, top = '30%', bottom, speed = 70, dark = false }) {
  return (
    <div className="tape" aria-hidden="true" style={{ ...(bottom !== undefined ? { bottom } : { top }), transform: `rotate(${angle}deg)` }}>
      <Ticker items={items} tone={tone} speed={speed} background={dark ? 'var(--ink)' : undefined} style={dark ? { color: 'var(--accent-ticker)' } : undefined} />
    </div>
  );
}
