// Signed donation receipts. Each digital receipt carries a QR whose link holds the receipt's details
// and an Ed25519 signature over them. The private key stays on the issuer's device; the public keys
// are in src/content/receipt-keys.json, so /verify/ can check a receipt with no server. The details
// travel in the link's #fragment, which browsers never send to the server.

export interface SignedFields {
  serial: string;
  /** YYYY-MM-DD */
  date: string;
  amount: number;
  name: string;
  mode: string;
  reference: string;
  purpose: string;
}

export interface PublicKeys { [id: string]: { key: string; who: string } }

export type Verdict =
  | { ok: true; keyId: string; fields: SignedFields }
  | { ok: false; reason: 'malformed' | 'unknown-key' | 'bad-signature' };

const VERSION = 1;
const ED25519 = { name: 'Ed25519' };
const enc = new TextEncoder();

export function toB64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromB64url(text: string): Uint8Array<ArrayBuffer> {
  const s = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

/** The private key as the issuer types it (base64url PKCS#8), with the public half to look up its id */
export async function importSigningKey(secret: string): Promise<{ key: CryptoKey; publicKey: string }> {
  const key = await crypto.subtle.importKey('pkcs8', fromB64url(secret.trim()), ED25519, true, ['sign']);
  const { x } = await crypto.subtle.exportKey('jwk', key);
  return { key, publicKey: x! };
}

/** Id of the public key matching this private key, if it's one of the trust's */
export function keyIdFor(publicKey: string, keys: PublicKeys): string | undefined {
  return Object.keys(keys).find((id) => keys[id].key === publicKey);
}

/** "<details>.<signature>", both base64url: goes after /verify/# */
export async function signReceipt(key: CryptoKey, keyId: string, f: SignedFields): Promise<string> {
  const payload = enc.encode(JSON.stringify([VERSION, keyId, f.serial, f.date, f.amount, f.name, f.mode, f.reference, f.purpose]));
  const signature = new Uint8Array(await crypto.subtle.sign(ED25519, key, payload));
  return `${toB64url(payload)}.${toB64url(signature)}`;
}

export async function verifyReceipt(token: string, keys: PublicKeys): Promise<Verdict> {
  let payload: Uint8Array<ArrayBuffer>, signature: Uint8Array<ArrayBuffer>, data: unknown;
  try {
    const [p, s, ...rest] = token.trim().split('.');
    if (!p || !s || rest.length) return { ok: false, reason: 'malformed' };
    payload = fromB64url(p);
    signature = fromB64url(s);
    data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(payload));
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (!Array.isArray(data) || data[0] !== VERSION || data.length !== 9) return { ok: false, reason: 'malformed' };
  const [, keyId, serial, date, amount, name, mode, reference, purpose] = data;
  const known = typeof keyId === 'string' && Object.hasOwn(keys, keyId) ? keys[keyId] : undefined;
  if (!known) return { ok: false, reason: 'unknown-key' };

  const publicKey = await crypto.subtle.importKey('raw', fromB64url(known.key), ED25519, false, ['verify']);
  const valid = await crypto.subtle.verify(ED25519, publicKey, signature, payload).catch(() => false);
  if (!valid) return { ok: false, reason: 'bad-signature' };
  return { ok: true, keyId, fields: { serial, date, amount, name, mode, reference, purpose } };
}
