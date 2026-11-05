'use client';

import React from 'react';

/** Email form that sends a sign-in link for the account page. */
export default function SignInForm({ next = '/account' }) {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState('idle');
  const [error, setError] = React.useState('');
  const submit = async (e) => {
    e.preventDefault(); setState('sending'); setError('');
    try {
      const res = await fetch('/api/auth/request', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, next }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "That didn't go through. Try again in a minute.");
      setState('done');
    } catch (err) { setError(err.message); setState('error'); }
  };
  if (state === 'done') return <p role="status" className="v-ok">Sent. Open the link in the email we sent to {email}. It works for 30 minutes.</p>;
  return (
    <form className="v-form" onSubmit={submit}>
      <label htmlFor="signin-email" className="sr-only">Email</label>
      <input id="signin-email" className="v-input" type="email" autoComplete="email" required placeholder="you@studio.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" className="v-btn v-btn--dark" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : 'Email me a link'}</button>
      {state === 'error' && <p role="alert" className="v-err">{error}</p>}
    </form>
  );
}
