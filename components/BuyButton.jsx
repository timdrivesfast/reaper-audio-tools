'use client';

import React from 'react';
import { Button } from './web';
import { getPaddle, openCheckout } from '../lib/paddle';

/** Opens Paddle checkout for a product. Shows a short note instead when Paddle isn't configured yet. */
export default function BuyButton({ product, label = 'Buy now', size = 'lg', variant = 'color' }) {
  const [note, setNote] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { getPaddle(); }, []);
  const buy = async () => {
    setBusy(true);
    const ok = await openCheckout({ priceId: product.priceId, slug: product.slug });
    setBusy(false);
    if (!ok) setNote('Checkout opens here once Paddle is connected.');
  };
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 8 }}>
      <Button variant={variant} tone={product.tone} size={size} onClick={buy} disabled={busy}>{label}</Button>
      {note && <span role="status" style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{note}</span>}
    </span>
  );
}
