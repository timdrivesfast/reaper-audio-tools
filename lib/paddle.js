'use client';

import { initializePaddle } from '@paddle/paddle-js';

let paddlePromise = null;

/** Paddle.js, loaded once from Paddle's CDN. Resolves to null when no client token is configured. */
export function getPaddle() {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  if (!token) return Promise.resolve(null);
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      environment: process.env.NEXT_PUBLIC_PADDLE_ENV === 'production' ? 'production' : 'sandbox',
      token,
      checkout: { settings: { displayMode: 'overlay', theme: 'light', locale: 'en' } },
    }).catch(() => null);
  }
  return paddlePromise;
}

/** Opens Paddle's overlay checkout for one price. Returns false when checkout isn't configured. */
export async function openCheckout({ priceId, slug }) {
  if (!priceId) return false;
  const paddle = await getPaddle();
  if (!paddle) return false;
  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    settings: { successUrl: `${window.location.origin}/thanks?plugin=${encodeURIComponent(slug)}` },
  });
  return true;
}
