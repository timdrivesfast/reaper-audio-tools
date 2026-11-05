'use client';

import React from 'react';
import { getPaddle, openCheckout } from '../../lib/paddle';

/** Opens Paddle checkout for a paid plugin. */
export default function BuyButton({ product, label, size = 'lg', variant = 'dark' }) {
  const [note, setNote] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { getPaddle(); }, []);
  const buy = async () => {
    setBusy(true); setNote('');
    const ok = await openCheckout({ priceId: product.priceId, slug: product.slug });
    setBusy(false);
    if (!ok) setNote("Checkout isn't connected yet. Email us and we'll sort you out.");
  };
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 8 }}>
      <button type="button" className={`v-btn v-btn--${variant} v-btn--${size}`} onClick={buy} disabled={busy}>{label || `Buy ${product.name} · ${product.priceLabel}`}</button>
      {note && <span role="status" className="v-fine">{note}</span>}
    </span>
  );
}
