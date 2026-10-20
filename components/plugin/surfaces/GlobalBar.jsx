import React from 'react';
import { JuiceButton } from '../buttons/JuiceButton.jsx';

/** The bottom global bar every plugin carries: JUICE on the left, transport / tempo / utility cluster on the right. */
export function GlobalBar({ children, left, juice = true, juiceOn, onJuice, assetBase, faces, style }) {
  return (
    <div style={{ background: 'var(--surface-panel)', borderRadius: 'var(--radius-panel)', boxShadow: 'var(--shadow-raised)', padding: '10px 18px', minHeight: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {juice && <JuiceButton on={juiceOn} onToggle={onJuice} assetBase={assetBase} faces={faces} />}
        {left}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', justifyContent: 'flex-end' }}>{children}</div>
    </div>
  );
}
