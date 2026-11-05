'use client';

import React from 'react';
import { nav } from '../../lib/site';

/** Sticky indigo header: typemark, links, and a menu button on small screens. */
export default function Header({ cta = { label: 'Buy DrumCrusher', href: '/plugins/drumcrusher#buy' } }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const key = (e) => { if (e.key === 'Escape') setOpen(false); };
    const down = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    window.addEventListener('keydown', key); window.addEventListener('pointerdown', down);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', down); };
  }, [open]);
  return (
    <header className="v-header" ref={ref}>
      <div className="v-wrap v-header__in">
        <a href="/" className="v-header__logo" aria-label="Reaper Audio Tools home"><img src="/images/v2/typemark.png" alt="Reaper Audio Tools" /></a>
        <nav className="v-nav" aria-label="Main">
          {nav.map((l) => <a key={l.href} className="v-nav__link" href={l.href}>{l.label}</a>)}
          <a className="v-btn v-btn--light v-btn--sm" href={cta.href}>{cta.label}</a>
          <button type="button" className="v-burger" aria-expanded={open} aria-controls="v-menu" aria-label="Menu" onClick={() => setOpen(!open)}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">{open ? <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}</svg>
          </button>
        </nav>
      </div>
      <nav id="v-menu" className="v-menu" data-open={open} aria-label="Menu">
        {nav.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
      </nav>
    </header>
  );
}
