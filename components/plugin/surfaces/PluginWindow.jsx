import React from 'react';
import { Ticker } from './Ticker.jsx';

/** The plugin window shell: theme + signature scope, marquee ticker, padded body. */
export function PluginWindow({ name = 'EASYDUCK', brand = 'REAPER AUDIO TOOLS', ticker, signature = 'coral', theme = 'light', width = 1040, padding = 18, framed = false, tickerPaused = false, children, style }) {
  return (
    <div data-theme={theme} data-signature={signature} style={{ width: width === 'auto' ? 'max-content' : width, flex: 'none', background: 'var(--surface-window)', fontFamily: 'var(--font-ui)', color: 'var(--text-primary)', borderRadius: framed ? 'var(--radius-window)' : 0, boxShadow: framed ? 'var(--shadow-window)' : 'none', overflow: 'hidden', boxSizing: 'border-box', ...style }}>
      <Ticker items={ticker || [name, brand]} paused={tickerPaused} style={{ width: 0, minWidth: '100%' }} />
      <div style={{ padding, boxSizing: 'border-box' }}>{children}</div>
    </div>
  );
}
