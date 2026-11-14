'use client';

import React from 'react';
import WaitlistForm from './WaitlistForm';
import { launch } from '../../lib/site';
import { cart, useCart } from '../../lib/cart';
import { track } from '../../lib/track';

/** Sends the buyer to Stripe Checkout for a paid plugin. Before launch it's the waitlist form. */
export default function BuyButton(props) {
  // ?buy=test shows the real Buy button before launch, for test purchases (Stripe test mode).
  const [preview, setPreview] = React.useState(false);
  React.useEffect(() => { try { setPreview(new URLSearchParams(window.location.search).get('buy') === 'test'); } catch {} }, []);
  if (!launch.live && !preview) return <WaitlistForm id={`waitlist-${props.product.slug}`} variant={props.variant || 'dark'} />;
  return <Checkout {...props} />;
}

function Checkout({ product, label, size = 'lg', variant = 'dark', addToCart = false }) {
  const { items } = useCart();
  const inCart = items.includes(product.slug);
  const add = () => { cart.add(product.slug); track('add_to_cart', { products: [product.slug], value: product.price }); };
  const [note, setNote] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const buy = async () => {
    setBusy(true); setNote('');
    try {
      track('begin_checkout', { products: [product.slug], value: product.price, from: 'buy_now' });
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ products: [product.slug], from: 'buy_now' }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout. Try again in a minute.");
      window.location.assign(data.url);
    } catch (err) {
      setNote(err.message); setBusy(false);
    }
  };
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 8 }}>
      <span className="v-buyrow">
        <button type="button" className={`v-btn v-btn--${variant} v-btn--${size}`} onClick={buy} disabled={busy}>{busy ? 'Opening checkout' : (label || `Buy ${product.name} · ${product.priceLabel}`)}</button>
        {addToCart && (inCart
          ? <button type="button" className={`v-addcart v-addcart--${variant}`} onClick={() => cart.show(true)}>In cart · View</button>
          : <button type="button" className={`v-addcart v-addcart--${variant}`} onClick={add}>Add to cart</button>)}
      </span>
      {note && <span role="status" className="v-fine">{note}</span>}
    </span>
  );
}
