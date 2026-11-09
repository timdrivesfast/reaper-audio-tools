'use client';

import React from 'react';
import WaitlistForm from './WaitlistForm';
import { launch } from '../../lib/site';

/** Sends the buyer to Stripe Checkout for a paid plugin. Before launch it's the waitlist form. */
export default function BuyButton(props) {
  // ?buy=test shows the real Buy button before launch, for test purchases (Stripe test mode).
  const [preview, setPreview] = React.useState(false);
  React.useEffect(() => { try { setPreview(new URLSearchParams(window.location.search).get('buy') === 'test'); } catch {} }, []);
  if (!launch.live && !preview) return <WaitlistForm id={`waitlist-${props.product.slug}`} variant={props.variant || 'dark'} />;
  return <Checkout {...props} />;
}

function Checkout({ product, label, size = 'lg', variant = 'dark' }) {
  const [note, setNote] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const buy = async () => {
    setBusy(true); setNote('');
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ product: product.slug }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Couldn't start checkout. Try again in a minute.");
      window.location.assign(data.url);
    } catch (err) {
      setNote(err.message); setBusy(false);
    }
  };
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 8 }}>
      <button type="button" className={`v-btn v-btn--${variant} v-btn--${size}`} onClick={buy} disabled={busy}>{busy ? 'Opening checkout' : (label || `Buy ${product.name} · ${product.priceLabel}`)}</button>
      {note && <span role="status" className="v-fine">{note}</span>}
    </span>
  );
}
