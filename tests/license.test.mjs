// npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { generateLicenseKey, KEY_PATTERN, normalizeKey, signLicense, verifyLicense } from '../lib/server/license.js';
import { verifyStripeSignature, formEncode } from '../lib/server/stripe.js';

test('license keys match the format and are unique', () => {
  const keys = new Set();
  for (let i = 0; i < 5000; i++) {
    const k = generateLicenseKey();
    assert.match(k, KEY_PATTERN);
    keys.add(k);
  }
  assert.equal(keys.size, 5000);
});

test('normalizeKey tidies pasted keys', () => {
  assert.equal(normalizeKey('  rat-7kq2-m9xd-p4ht-w3nc \n'), 'RAT-7KQ2-M9XD-P4HT-W3NC');
});

test('a signed license verifies, and a tampered one does not', () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
  const payload = { v: 1, key: 'RAT-7KQ2-M9XD-P4HT-W3NC', product: 'easyduck', machineId: 'mac-abc12345', email: 'a@b.co', issuedAt: '2026-10-20T00:00:00Z' };
  const token = signLicense(payload, privateKey);
  assert.deepEqual(verifyLicense(token, publicKey), payload);
  const [body, sig] = token.split('.');
  const forged = Buffer.from(JSON.stringify({ ...payload, product: 'drumcrusher' })).toString('base64url');
  assert.equal(verifyLicense(`${forged}.${sig}`, publicKey), null);
  const other = crypto.generateKeyPairSync('ed25519').publicKey;
  assert.equal(verifyLicense(token, other), null);
  assert.ok(body.length > 0);
});

test('Stripe webhook signatures', () => {
  const secret = 'whsec_test_secret';
  const raw = JSON.stringify({ id: 'evt_1', type: 'checkout.session.completed' });
  const t = Math.floor(Date.now() / 1000);
  const v1 = crypto.createHmac('sha256', secret).update(`${t}.${raw}`).digest('hex');
  assert.equal(verifyStripeSignature(raw, `t=${t},v1=${v1}`, secret), true);
  assert.equal(verifyStripeSignature(raw + ' ', `t=${t},v1=${v1}`, secret), false, 'body changed');
  assert.equal(verifyStripeSignature(raw, `t=${t},v1=${v1}`, 'wrong'), false, 'wrong secret');
  const old = t - 3600;
  assert.equal(verifyStripeSignature(raw, `t=${old},v1=${crypto.createHmac('sha256', secret).update(`${old}.${raw}`).digest('hex')}`, secret), false, 'too old');
  assert.equal(verifyStripeSignature(raw, null, secret), false);
  assert.equal(verifyStripeSignature(raw, `t=${t},v1=deadbeef,v1=${v1}`, secret), true, 'any v1 may match during secret rotation');
  assert.equal(verifyStripeSignature(raw, `t=${t},v0=${v1}`, secret), false, 'v0 is not a real signature');
});

test('Stripe form encoding', () => {
  const s = formEncode({ mode: 'payment', line_items: [{ price: 'price_1', quantity: 1 }], managed_payments: { enabled: true }, skip: undefined }).toString();
  assert.equal(decodeURIComponent(s), 'mode=payment&line_items[0][price]=price_1&line_items[0][quantity]=1&managed_payments[enabled]=true');
});
