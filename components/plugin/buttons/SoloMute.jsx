import React from 'react';
import { CapsuleToggle } from './CapsuleToggle.jsx';

/** Channel S / M capsule pair. Solo = pale yellow, Mute = pale cyan. */
export function SoloMute({ solo, mute, onSolo, onMute, size = 'md', gap = 12, style }) {
  const dims = size === 'sm' ? { width: 22, height: 36 } : { width: 26, height: 46 };
  return (
    <div style={{ display: 'flex', gap, ...style }}>
      <CapsuleToggle {...dims} on={solo} onToggle={onSolo} color="var(--pale-yellow)" title="Solo">S</CapsuleToggle>
      <CapsuleToggle {...dims} on={mute} onToggle={onMute} color="var(--pale-cyan)" title="Mute">M</CapsuleToggle>
    </div>
  );
}
