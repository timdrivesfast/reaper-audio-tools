import crypto from 'node:crypto';

// No 0/O or 1/I so keys are easy to read back over email.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const KEY_PATTERN = /^RAT(-[A-HJ-NP-Z2-9]{4}){4}$/;

/** A new license key like RAT-7KQ2-M9XD-P4HT-W3NC (80 bits of randomness). */
export function generateLicenseKey() {
  const groups = [];
  for (let g = 0; g < 4; g++) {
    let s = '';
    for (let i = 0; i < 4; i++) s += ALPHABET[crypto.randomInt(ALPHABET.length)];
    groups.push(s);
  }
  return 'RAT-' + groups.join('-');
}

export function normalizeKey(raw) {
  return String(raw || '').trim().toUpperCase().replace(/\s+/g, '');
}

/** Maps a Paddle price ID to a product slug, from the NEXT_PUBLIC_PADDLE_PRICE_* env vars. */
export function productForPriceId(priceId) {
  const map = {
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_EASYDUCK || '']: 'easyduck',
    [process.env.NEXT_PUBLIC_PADDLE_PRICE_DRUMCRUSHER || '']: 'drumcrusher',
  };
  delete map[''];
  return map[priceId] || null;
}

export function maxActivations() {
  const n = parseInt(process.env.LICENSE_MAX_ACTIVATIONS || '2', 10);
  return Number.isFinite(n) && n > 0 ? n : 2;
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function privateKey() {
  const pem = (process.env.LICENSE_SIGNING_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!pem.includes('PRIVATE KEY')) throw new Error('LICENSE_SIGNING_PRIVATE_KEY is not set. Run npm run license:keys.');
  return crypto.createPrivateKey(pem);
}

/**
 * Signs what the plugin stores after activating: "<base64url JSON payload>.<base64url Ed25519 signature>".
 * The plugin checks the signature with the public key compiled into it, then checks
 * payload.product and payload.machineId match itself. Works offline after that.
 */
export function signLicense(payload, key = privateKey()) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8');
  const sig = crypto.sign(null, body, key);
  return `${b64url(body)}.${b64url(sig)}`;
}

/** The same check the plugin does. Used in tests. */
export function verifyLicense(token, publicKey) {
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return null;
  const ok = crypto.verify(null, Buffer.from(body, 'base64url'), publicKey, Buffer.from(sig, 'base64url'));
  return ok ? JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) : null;
}
