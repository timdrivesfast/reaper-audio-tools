// Creates the Ed25519 key pair that signs plugin licenses.
//   npm run license:keys
// Put the private key in Vercel as LICENSE_SIGNING_PRIVATE_KEY (keep it secret, never commit it).
// Compile the public key into each plugin so it can check licenses offline.
// Generate this ONCE. A new pair invalidates every license already activated.
import crypto from 'node:crypto';

const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
const rawPublic = publicKey.export({ format: 'jwk' }).x; // base64url, 32 bytes
const hex = Buffer.from(rawPublic, 'base64url').toString('hex');

console.log('\nLICENSE_SIGNING_PRIVATE_KEY (paste into Vercel, one line):\n');
console.log(pem.trim().replace(/\n/g, '\\n'));
console.log('\nPublic key for the plugin (32 bytes, hex):\n');
console.log(hex);
console.log('\nSame public key as a C++ array:\n');
console.log('const uint8_t kLicensePublicKey[32] = { ' + Buffer.from(hex, 'hex').toJSON().data.map((b) => '0x' + b.toString(16).padStart(2, '0')).join(', ') + ' };\n');
