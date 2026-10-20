// npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { generateLicenseKey, KEY_PATTERN, normalizeKey, signLicense, verifyLicense } from '../lib/server/license.js';
import { verifyPaddleSignature } from '../lib/server/paddle.js';

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

test('Paddle webhook signatures', () => {
  const secret = 'pdl_ntfset_test_secret';
  const raw = JSON.stringify({ event_id: 'evt_1', event_type: 'transaction.completed' });
  const ts = Math.floor(Date.now() / 1000);
  const h1 = crypto.createHmac('sha256', secret).update(`${ts}:${raw}`).digest('hex');
  assert.equal(verifyPaddleSignature(raw, `ts=${ts};h1=${h1}`, secret), true);
  assert.equal(verifyPaddleSignature(raw + ' ', `ts=${ts};h1=${h1}`, secret), false, 'body changed');
  assert.equal(verifyPaddleSignature(raw, `ts=${ts};h1=${h1}`, 'wrong'), false, 'wrong secret');
  assert.equal(verifyPaddleSignature(raw, `ts=${ts - 3600};h1=${crypto.createHmac('sha256', secret).update(`${ts - 3600}:${raw}`).digest('hex')}`, secret), false, 'too old');
  assert.equal(verifyPaddleSignature(raw, null, secret), false);
  assert.equal(verifyPaddleSignature(raw, `ts=${ts};h1=deadbeef;h1=${h1}`, secret), true, 'any h1 may match during secret rotation');
});
