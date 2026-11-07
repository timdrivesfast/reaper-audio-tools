'use client';

import React from 'react';
import { launch } from '../../lib/site';

/** Launch waitlist: email + button, posts to /api/waitlist (list `launch`). */
export default function WaitlistForm({ id = 'waitlist-email', variant = 'dark', label = 'Join the waitlist', note }) {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState('idle');
  const submit = async (e) => {
    e.preventDefault(); setState('sending');
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, list: launch.list }) });
      if (!res.ok) throw new Error();
      setState('done');
    } catch { setState('error'); }
  };
  if (state === 'done') {
    return <div role="status" className="v-wait__done"><span>✓</span>You're on the list. We'll email you when it's out.</div>;
  }
  return (
    <form className="v-form v-wait" onSubmit={submit}>
      <label htmlFor={id} className="sr-only">Email</label>
      <input id={id} className="v-input" type="email" required autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit" className={`v-btn v-btn--${variant}`} disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : label}</button>
      {state === 'error' && <p role="alert" className="v-err">That didn't go through. Try again in a minute.</p>}
      {note && <p className="v-fine" style={{ width: '100%' }}>{note}</p>}
    </form>
  );
}
