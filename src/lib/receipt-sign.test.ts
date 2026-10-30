import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveSigningKey, fromB64url, keyIdFor, passphraseOk, publicKeyOk, signReceipt, toB64url, verifyReceipt, type PublicKeys, type SignedFields } from './receipt-sign.ts';

const A = 'mango river kite window';
const B = 'tiger lamp cloud basket';

const FIELDS: SignedFields = {
  serial: '1400', date: '2026-09-19', amount: 20000, name: 'यतिश अशोक पाटील', village: 'भुईगांव', mode: 'bank', reference: 'NEFT 1234',
  programme: 'वार्षिक', purpose: 'संजीवनी परिवाराकरिता',
};

test('base64url round-trips', () => {
  const bytes = Uint8Array.from({ length: 256 }, (_, i) => i);
  assert.deepEqual(fromB64url(toB64url(bytes)), bytes);
  assert.doesNotMatch(toB64url(bytes), /[+/=]/);
});

test('passphraseOk wants 4 words or 20 characters', () => {
  for (const p of ['mahalakshmidahanu', 'sanjeevani1994', 'mango river kite']) assert.equal(passphraseOk(p), false, p);
  for (const p of [A, 'आंबा-खिडकी-नदी-पतंग', 'averylongpasswordwithnospaces']) assert.equal(passphraseOk(p), true, p);
});

test('the same passphrase always gives the same key; spaces and capitals do not matter', async () => {
  const a = await deriveSigningKey(A);
  assert.equal((await deriveSigningKey('  Mango-River  KITE window ')).publicKey, a.publicKey);
  assert.notEqual((await deriveSigningKey(B)).publicKey, a.publicKey);
  assert.ok(publicKeyOk(a.publicKey));
  assert.equal(publicKeyOk('abc'), false);
  assert.equal(a.key.extractable, false);
});

test('a signed receipt verifies, with its details', async () => {
  const { key, publicKey } = await deriveSigningKey(A);
  const keys: PublicKeys = { k1: { key: publicKey, who: 'test' } };
  assert.equal(keyIdFor(publicKey, keys), 'k1');

  const token = await signReceipt(key, 'k1', FIELDS);
  assert.deepEqual(await verifyReceipt(token, keys), { ok: true, keyId: 'k1', fields: FIELDS });
});

test('a changed amount, another key or a removed key fails', async () => {
  const [a, b] = [await deriveSigningKey(A), await deriveSigningKey(B)];
  const keys: PublicKeys = { k1: { key: a.publicKey, who: 'a' }, k2: { key: b.publicKey, who: 'b' } };
  const { key } = a;
  const token = await signReceipt(key, 'k1', FIELDS);

  const [payload, signature] = token.split('.');
  const json = new TextDecoder().decode(fromB64url(payload)).replace('20000', '200000');
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
