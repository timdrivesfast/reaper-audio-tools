// npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { cartSlugs, sessionSlugs, checkoutParams } from '../lib/server/checkout.js';
import { formEncode } from '../lib/server/stripe.js';

test('cartSlugs keeps paid plugins on sale, once each', () => {
  assert.deepEqual(cartSlugs(['modfx-pro', 'MODFX-PRO', 'easyduck', 'nope', '']), ['modfx-pro']);
  assert.deepEqual(cartSlugs('modfx-pro'), ['modfx-pro']); // older { product } body
  assert.deepEqual(cartSlugs(undefined), []);
  assert.deepEqual(cartSlugs(['drumcrusher']), []); // free plugins aren't sold
});

test('sessionSlugs reads cart orders and older single-plugin orders', () => {
  assert.deepEqual(sessionSlugs({ products: 'modfx-pro' }), ['modfx-pro']);
  assert.deepEqual(sessionSlugs({ product: 'modfx-pro' }), ['modfx-pro']);
  assert.deepEqual(sessionSlugs({ products: 'modfx-pro,ghost' }), ['modfx-pro']);
  assert.deepEqual(sessionSlugs({}), []);
});

test('checkoutParams: one line per plugin, metadata the webhook reads', () => {
  const p = checkoutParams({ slugs: ['modfx-pro'], prices: { 'modfx-pro': 'price_1' }, siteUrl: 'https://x.com', from: 'buy_now' });
  assert.deepEqual(p.line_items, [{ price: 'price_1', quantity: 1 }]);
  assert.equal(p.metadata.products, 'modfx-pro');
  assert.equal(p.metadata.product, 'modfx-pro');
  assert.equal(p.cancel_url, 'https://x.com/plugins/modfx-pro');
  assert.match(p.success_url, /plugin=modfx-pro&session_id=\{CHECKOUT_SESSION_ID\}$/);
  const c = checkoutParams({ slugs: ['modfx-pro'], prices: { 'modfx-pro': 'price_1' }, siteUrl: 'https://x.com', from: 'cart' });
  assert.equal(c.cancel_url, 'https://x.com/?cart=open');
  assert.equal(c.metadata.from, 'cart');
  const body = formEncode(c).toString();
  assert.match(body, /line_items%5B0%5D%5Bprice%5D=price_1/);
  assert.match(body, /managed_payments%5Benabled%5D=true/);
});
