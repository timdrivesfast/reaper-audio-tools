'use client';

import React from 'react';
import { Button } from './web';

/** Email form for a free plugin: sends the license key and download links. */
export default function GetFreeForm({ product, label }) {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState('idle');
  const [error, setError] = React.useState('');
  const submit = async (e) => {
    e.preventDefault();
    setState('sending'); setError('');
    try {
      const res = await fetch('/api/free-license', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, product: product.slug }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "That didn't go through. Try again in a minute.");
      setState('done');
    } catch (err) {
      setError(err.message); setState('error');
    }
  };
  if (state === 'done') {
    return <p role="status" className="getfree__done">Sent. Check {email} for your license key and download links.</p>;
  }
  return (
    <form id="get" className="getfree" onSubmit={submit}>
      <label htmlFor="getfree-email" className="sr-only">Email</label>
      <input id="getfree-email" name="email" type="email" autoComplete="email" required className="ratw-input" placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit" variant="color" tone={product.tone} size="lg" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : (label || `Get ${product.name}`)}</Button>
      {state === 'error' && <p role="alert" className="getfree__error">{error}</p>}
    </form>
  );
}
