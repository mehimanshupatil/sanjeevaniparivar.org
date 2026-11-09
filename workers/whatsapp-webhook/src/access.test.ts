import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canReply, claimsOk, parseJwt, replyInput, verifyAccess, MAX_REPLY, type Jwk } from './access.ts';

const cfg = { team: 'sanjeevani', aud: 'aud-tag' };
const now = 1_793_030_000;
const b64url = (data: Uint8Array | string) => Buffer.from(data).toString('base64url');

async function signer() {
  const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk: Jwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid: 'k1' };
  const sign = async (claims: object, header: object = { alg: 'RS256', kid: 'k1' }) => {
    const head = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
    const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(head));
    return `${head}.${b64url(new Uint8Array(sig))}`;
  };
  return { jwk, sign };
}

const good = { aud: ['aud-tag'], exp: now + 3600, iss: 'https://sanjeevani.cloudflareaccess.com', email: 'member@example.org' };

test('claimsOk: audience, expiry, issuer', () => {
  assert.equal(claimsOk(good, cfg, now), true);
  assert.equal(claimsOk({ ...good, aud: 'aud-tag' }, cfg, now), true);
  assert.equal(claimsOk({ ...good, aud: ['other'] }, cfg, now), false);
  assert.equal(claimsOk({ ...good, exp: now - 1 }, cfg, now), false);
  assert.equal(claimsOk({ ...good, iss: 'https://evil.cloudflareaccess.com' }, cfg, now), false);
  assert.equal(claimsOk({ ...good, nbf: now + 600 }, cfg, now), false);
});

test('verifyAccess: the email of a valid token only', async () => {
  const { jwk, sign } = await signer();
  let fetched = 0;
  const keys = async (refresh: boolean) => { if (refresh) fetched++; return refresh ? [jwk] : []; };
  assert.equal(await verifyAccess(await sign(good), cfg, keys, now), 'member@example.org');
  assert.equal(fetched, 1, 'unknown key id: fetched again');
  const known = async () => [jwk];
  // Tampered claims, wrong algorithm, other audience, no token, Access not set up
  const token = await sign(good);
  const [h, , s] = token.split('.');
  assert.equal(await verifyAccess(`${h}.${b64url(JSON.stringify({ ...good, email: 'x@evil.org' }))}.${s}`, cfg, known, now), undefined);
  assert.equal(await verifyAccess(await sign(good, { alg: 'none', kid: 'k1' }), cfg, known, now), undefined);
  assert.equal(await verifyAccess(await sign({ ...good, aud: ['other'] }), cfg, known, now), undefined);
  assert.equal(await verifyAccess(null, cfg, known, now), undefined);
  assert.equal(await verifyAccess(token, { team: '', aud: '' }, known, now), undefined);
  assert.equal(await verifyAccess('not.a.jwt', cfg, known, now), undefined);
  assert.equal(parseJwt('x'), undefined);
});

test('canReply and replyInput', () => {
  assert.equal(canReply(now - 3600, now), true);
  assert.equal(canReply(now - 25 * 3600, now), false);
  assert.equal(canReply(null, now), false);
  assert.deepEqual(replyInput({ n: '919800000001', text: '  नमस्कार  ' }), { n: '919800000001', text: 'नमस्कार' });
  assert.ok('error' in replyInput({ n: '+91 98', text: 'x' }));
  assert.ok('error' in replyInput({ n: '919800000001', text: '   ' }));
  assert.ok('error' in replyInput({ n: '919800000001', text: 'x'.repeat(MAX_REPLY + 1) }));
  assert.ok('error' in replyInput(null));
});
