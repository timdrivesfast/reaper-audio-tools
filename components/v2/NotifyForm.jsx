'use client';

import React from 'react';

/** Newsletter signup: posts to /api/waitlist. */
export default function NotifyForm({ list = 'newsletter' }) {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState('idle');
  const submit = async (e) => {
    e.preventDefault(); setState('sending');
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, list }) });
      if (!res.ok) throw new Error();
      setState('done');
    } catch { setState('error'); }
  };
  if (state === 'done') {
    return <div role="status" style={{ marginTop: 6, height: 50, display: 'flex', alignItems: 'center', gap: 10, fontWeight: 500, fontSize: 15 }}><span style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--v-cyan)', color: '#14323A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>✓</span>You're on the list.</div>;
  }
  return (
    <form className="v-form" onSubmit={submit} style={{ marginTop: 6 }}>
      <label htmlFor="notify-email" className="sr-only">Email</label>
      <input id="notify-email" className="v-input" type="email" required autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ boxShadow: 'none' }} />
      <button type="submit" className="v-btn v-btn--cyan" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : 'Notify me'}</button>
      {state === 'error' && <p role="alert" className="v-err" style={{ color: '#FFB4AB' }}>That didn't go through. Try again in a minute.</p>}
    </form>
  );
}
