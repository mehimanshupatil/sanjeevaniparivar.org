import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fromB64url, importSigningKey, keyIdFor, signReceipt, toB64url, verifyReceipt, type PublicKeys, type SignedFields } from './receipt-sign.ts';

async function keyPair() {
  const pair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']) as CryptoKeyPair;
  return {
    secret: toB64url(new Uint8Array(await crypto.subtle.exportKey('pkcs8', pair.privateKey))),
    publicKey: toB64url(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))),
  };
}

const FIELDS: SignedFields = {
  serial: '1234', date: '2026-10-30', amount: 12500, name: 'श्री. रमेश पाटील', mode: 'upi', reference: '432198765012', purpose: 'सर्वसाधारण',
};

test('base64url round-trips', () => {
  const bytes = Uint8Array.from({ length: 256 }, (_, i) => i);
  assert.deepEqual(fromB64url(toB64url(bytes)), bytes);
  assert.doesNotMatch(toB64url(bytes), /[+/=]/);
});

test('a signed receipt verifies, with its details', async () => {
  const k = await keyPair();
  const keys: PublicKeys = { k1: { key: k.publicKey, who: 'test' } };
  const { key, publicKey } = await importSigningKey(k.secret);
  assert.equal(keyIdFor(publicKey, keys), 'k1');

  const token = await signReceipt(key, 'k1', FIELDS);
  assert.deepEqual(await verifyReceipt(token, keys), { ok: true, keyId: 'k1', fields: FIELDS });
});

test('a changed amount, another key or a removed key fails', async () => {
  const [a, b] = [await keyPair(), await keyPair()];
  const keys: PublicKeys = { k1: { key: a.publicKey, who: 'a' }, k2: { key: b.publicKey, who: 'b' } };
  const { key } = await importSigningKey(a.secret);
  const token = await signReceipt(key, 'k1', FIELDS);

  const [payload, signature] = token.split('.');
  const json = new TextDecoder().decode(fromB64url(payload)).replace('12500', '125000');
  const forged = `${toB64url(new TextEncoder().encode(json))}.${signature}`;
  assert.deepEqual(await verifyReceipt(forged, keys), { ok: false, reason: 'bad-signature' });

  // Signed with key a but claiming to be key b
  const claimsB = new TextDecoder().decode(fromB64url(payload)).replace('"k1"', '"k2"');
  assert.deepEqual(await verifyReceipt(`${toB64url(new TextEncoder().encode(claimsB))}.${signature}`, keys), { ok: false, reason: 'bad-signature' });

  assert.deepEqual(await verifyReceipt(token, { k2: keys.k2 }), { ok: false, reason: 'unknown-key' });
});

test('junk is malformed', async () => {
  for (const t of ['', 'abc', 'a.b.c', '!!!.###', `${toB64url(new TextEncoder().encode('[2]'))}.AAAA`]) {
    assert.deepEqual(await verifyReceipt(t, {}), { ok: false, reason: 'malformed' }, t);
  }
});

test('a private key that is not Ed25519 PKCS#8 is refused', async () => {
  await assert.rejects(importSigningKey('not-a-key'));
});
