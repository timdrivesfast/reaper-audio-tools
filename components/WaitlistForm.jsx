'use client';

import { EmailCapture } from './web';

/** Waitlist signup posting to /api/waitlist. */
export default function WaitlistForm({ list, ...props }) {
  const submit = async (email) => {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, list }),
    });
    if (!res.ok) throw new Error('waitlist failed');
  };
  return <EmailCapture onSubmit={submit} {...props} />;
}
