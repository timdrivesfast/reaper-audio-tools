'use client';

import React from 'react';
import { nav, suites, products } from '../../lib/site';

const inSuite = (id) => Object.values(products).filter((p) => p.suite === id);

/** Sticky indigo header: typemark, a Suites dropdown, links, and a menu button on small screens. */
const defaultCta = { label: 'Get EasyDuck free', href: '/plugins/easyduck' };

export default function Header({ cta = defaultCta }) {
  const [open, setOpen] = React.useState(false);       // mobile menu
  const [drop, setDrop] = React.useState(false);       // desktop Suites dropdown
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open && !drop) return undefined;
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); setDrop(false); } };
    const down = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setDrop(false); } };
    window.addEventListener('keydown', key); window.addEventListener('pointerdown', down);
    return () => { window.removeEventListener('keydown', key); window.removeEventListener('pointerdown', down); };
  }, [open, drop]);
  return (
    <header className="v-header" ref={ref}>
      <div className="v-wrap v-header__in">
        <a href="/" className="v-header__logo" aria-label="Reaper Audio Tools home"><img src="/images/v2/typemark.png" alt="Reaper Audio Tools" /></a>
        <nav className="v-nav" aria-label="Main">
          {nav.map((l) => l.suites ? (
            <div key="suites" className="v-drop v-nav__link" onMouseEnter={() => setDrop(true)} onMouseLeave={() => setDrop(false)}>
              <button type="button" className="v-drop__btn" aria-expanded={drop} aria-controls="v-drop" onClick={() => setDrop(!drop)}>
                {l.label}
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ transform: drop ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}><path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div id="v-drop" className="v-drop__panel" data-open={drop}>
                {suites.map((s) => (
                  <div key={s.id} className="v-drop__col">
                    <a href={s.href} className="v-drop__suite" onClick={() => setDrop(false)}>{s.name}<span>{s.note}</span></a>
                    {inSuite(s.id).map((p) => (
                      <a key={p.slug} href={`/plugins/${p.slug}`} className="v-drop__item" onClick={() => setDrop(false)}>{p.name}<span className="v-mono">{p.free ? 'FREE' : p.priceLabel}</span></a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : <a key={l.href} className="v-nav__link" href={l.href}>{l.label}</a>)}
          <a className="v-btn v-btn--light v-btn--sm" href={cta.href}>{cta.label}</a>
          <button type="button" className="v-burger" aria-expanded={open} aria-controls="v-menu" aria-label="Menu" onClick={() => setOpen(!open)}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">{open ? <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}</svg>
          </button>
        </nav>
      </div>
      <nav id="v-menu" className="v-menu" data-open={open} aria-label="Menu">
        {nav.flatMap((l) => l.suites
          ? suites.map((s) => <a key={s.href} href={s.href} onClick={() => setOpen(false)}>{s.name}</a>)
          : [<a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>])}
      </nav>
    </header>
  );
}
