'use client';

import React from 'react';
import { cart, useCart } from '../../lib/cart';
import { track } from '../../lib/track';
import { products, launch } from '../../lib/site';

const money = (n) => `$${Number(n).toFixed(2).replace(/\.00$/, '')}`;

/** Header button: a bag with the number of plugins in the cart. */
export function CartButton() {
  const { items } = useCart();
  if (!launch.live) return null;
  return (
    <button type="button" className="v-cartbtn" aria-label={`Cart, ${items.length} item${items.length === 1 ? '' : 's'}`} onClick={() => cart.show(true)}>
      <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7h12l-1 10H5L4 7zM7 7V5.5a3 3 0 0 1 6 0V7" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinejoin="round" strokeLinecap="round" /></svg>
      {items.length > 0 && <span className="v-cartbtn__n">{items.length}</span>}
    </button>
  );
}

/** Slide-over cart. Mounted once in the header so it's on every page. */
export function CartDrawer() {
  const { items, open } = useCart();
  const [busy, setBusy] = React.useState(false);
  const [note, setNote] = React.useState('');
  const panel = React.useRef(null);

  React.useEffect(() => { // ?cart=open (Stripe's back link from a cart checkout) reopens it
    try { if (new URLSearchParams(window.location.search).get('cart') === 'open') cart.show(true); } catch {}
  }, []);
  React.useEffect(() => {
    if (!open) return undefined;
    track('view_cart', { products: items, value: cart.total(items) });
    panel.current?.focus();
    const key = (e) => { if (e.key === 'Escape') cart.show(false); };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkout = async () => {
    setBusy(true); setNote('');
    track('begin_checkout', { products: items, value: cart.total(items), from: 'cart' });
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ products: items, from: 'cart' }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout. Try again in a minute.");
      window.location.assign(data.url);
    } catch (err) { setNote(err.message); setBusy(false); }
  };

  return (
    <div className="v-cart" data-open={open} aria-hidden={!open}>
      <div className="v-cart__scrim" onClick={() => cart.show(false)} />
      <aside ref={panel} tabIndex={-1} className="v-cart__panel" role="dialog" aria-modal="true" aria-label="Cart">
        <div className="v-cart__head">
          <span className="v-eyebrow" style={{ color: 'var(--v-ink-2)' }}>Cart{items.length ? ` · ${items.length}` : ''}</span>
          <button type="button" className="v-cart__x" aria-label="Close cart" onClick={() => cart.show(false)}>
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        {items.length === 0 ? (
          <div className="v-cart__empty">
            <p className="v-body">Your cart is empty.</p>
            <a className="v-link" href="/pro" onClick={() => cart.show(false)}>See the Pro suite <span className="v-mono">→</span></a>
          </div>
        ) : (
          <>
            <ul className="v-cart__list">
              {items.map((s) => { const p = products[s]; return (
                <li key={s} className="v-cart__item">
                  <a href={`/plugins/${s}`} className="v-cart__thumb" onClick={() => cart.show(false)}><img src={p.ui} alt="" /></a>
                  <div className="v-cart__meta">
                    <a href={`/plugins/${s}`} className="v-cart__name" onClick={() => cart.show(false)}>{p.name}</a>
                    <span className="v-fine">{p.formats}</span>
                    <button type="button" className="v-cart__rm" onClick={() => cart.remove(s)}>Remove</button>
                  </div>
                  <span className="v-cart__price">{p.priceLabel}</span>
                </li>
              ); })}
            </ul>
            <div className="v-cart__foot">
              <div className="v-cart__total"><span>Subtotal</span><span>{money(cart.total(items))}</span></div>
              <p className="v-fine">One-time purchase. Tax is worked out at checkout. Your license keys come by email.</p>
              <button type="button" className="v-btn v-btn--dark v-btn--lg" style={{ width: '100%' }} onClick={checkout} disabled={busy}>{busy ? 'Opening checkout' : 'Check out'}</button>
              {note && <span role="status" className="v-fine">{note}</span>}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/** Thanks page: empties the cart and records the purchase once per order. */
export function PurchaseDone({ slugs, session }) {
  React.useEffect(() => {
    cart.clear();
    try {
      const k = `rat_tracked_${session || slugs.join(',')}`;
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, '1');
    } catch {}
    track('purchase', { products: slugs, value: slugs.reduce((n, s) => n + (products[s]?.price || 0), 0) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
