'use client';

import React from 'react';
import { launch } from '../../lib/site';

const pad = (n) => String(n).padStart(2, '0');

/** Days / hours / minutes / seconds until launch.at. Renders dashes until mounted (no hydration mismatch). */
export default function Countdown({ dark = false, size = 'md', inline = false }) {
  const target = React.useMemo(() => new Date(launch.at).getTime(), []);
  const [now, setNow] = React.useState(null);
  React.useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const left = now == null ? null : Math.max(0, target - now);
  const parts = left == null ? ['--', '--', '--', '--'] : [Math.floor(left / 864e5), Math.floor(left / 36e5) % 24, Math.floor(left / 6e4) % 60, Math.floor(left / 1e3) % 60].map(pad);
  if (inline) {
    const txt = left == null ? '' : left === 0 ? 'Out now' : `${+parts[0] ? +parts[0] + 'd ' : ''}${+parts[1]}h ${parts[2]}m`;
    return <span className="v-count-inline" suppressHydrationWarning>{txt ? `Launches in ${txt}` : `Launches ${launch.label}`}</span>;
  }
  return (
    <div className={`v-count v-count--${size}${dark ? ' v-count--dark' : ''}`} role="timer" aria-label={left == null ? 'Countdown to launch' : `${parts[0]} days ${parts[1]} hours ${parts[2]} minutes until launch`}>
      {['Days', 'Hrs', 'Min', 'Sec'].map((l, i) => (
        <div key={l} className="v-count__cell"><span className="v-count__n">{parts[i]}</span><span className="v-count__l">{l}</span></div>
      ))}
    </div>
  );
}
