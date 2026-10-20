import React from 'react';
import { Knob } from './Knob.jsx';
import { Lcd } from '../readouts/Lcd.jsx';

/** Tinted card: label, dial knob, LCD value. The standard way to present one continuous parameter. */
const SIZES = { md: { w: 82, knob: 66 }, sm: { w: 70, knob: 52 } };

/* Fixed footprint — knob cells never stretch to fill a row. md 82px (knob 66) · sm 70px (knob 52). Labels ≤ 7 characters. */
export function KnobCell({ label, value, defaultValue = 50, min = 0, max = 100, unit = '', format, onChange, color = 'var(--param-cyan)', tickColor, tint = 0.10, variant = 'dial', size = 'md', card = true, style }) {
  const Z = SIZES[size] || SIZES.md;
  const [v, setV] = React.useState(value !== undefined ? value : defaultValue);
  React.useEffect(() => { if (value !== undefined) setV(value); }, [value]);
  const text = format ? format(v) : Math.round(v) + unit;
  return (
    <div style={{ background: card ? 'color-mix(in srgb, ' + color + ' ' + (tint * 100) + '%, var(--tint-base))' : 'transparent', borderRadius: 'var(--radius-panel)', padding: card ? '10px 6px 12px' : 0, boxShadow: card ? 'var(--shadow-raised)' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: Z.w, flex: 'none', boxSizing: 'border-box', ...style }}>
      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)' }}>{label}</div>
      <Knob value={v} min={min} max={max} variant={variant} size={Z.knob} color={color} tickColor={tickColor} ariaLabel={label} onChange={(n) => { setV(n); if (onChange) onChange(n); }} />
      <Lcd minWidth={52} padding="2px 4px" style={{ width: '86%' }}>{text}</Lcd>
    </div>
  );
}
