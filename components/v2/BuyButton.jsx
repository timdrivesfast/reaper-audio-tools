'use client';

import React from 'react';

/** Sends the buyer to Stripe Checkout for a paid plugin. */
export default function BuyButton({ product, label, size = 'lg', variant = 'dark' }) {
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
