// Signed donation receipts. Each digital receipt carries a QR whose link holds the receipt's details
// and an Ed25519 signature over them. The private key is made from the issuer's passphrase each time
// and never stored or sent; the public keys are in src/content/receipt-keys.json, so /verify/ can
// check a receipt with no server. The details travel in the link's #fragment, which browsers never
// send to the server.

export interface SignedFields {
  serial: string;
  /** YYYY-MM-DD */
  date: string;
  amount: number;
  name: string;
  village: string;
  mode: string;
  reference: string;
  programme: string;
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

// The public key is published, so anyone can try passphrases offline against it: the passphrase
// must be strong (passphraseOk), and every guess costs PBKDF2_ROUNDS of SHA-256.
const PBKDF2_ROUNDS = 600_000;
const SALT = enc.encode('sanjeevaniparivar.org/receipt/v1');
/** PKCS#8 wrapper for a raw 32-byte Ed25519 private key (RFC 8410) */
const PKCS8_PREFIX = Uint8Array.from([0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20]);

/** 4 or more words, or 20 or more characters */
export function passphraseOk(passphrase: string): boolean {
  const p = passphrase.trim();
  return p.split(/[\s\-_.,]+/).filter((w) => w.length >= 2).length >= 4 || p.length >= 20;
}

/**
 * The issuer's signing key, made from their passphrase: the same passphrase always gives the same
 * key. Spaces and capitals don't matter. `publicKey` is what goes in receipt-keys.json.
 */
export async function deriveSigningKey(passphrase: string, extractable = false): Promise<{ key: CryptoKey; publicKey: string }> {
  const normal = passphrase.trim().toLowerCase().split(/[\s\-_.,]+/).join(' ');
  const base = await crypto.subtle.importKey('raw', enc.encode(normal), 'PBKDF2', false, ['deriveBits']);
  const seed = new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: SALT, iterations: PBKDF2_ROUNDS }, base, 256));
  const pkcs8 = new Uint8Array([...PKCS8_PREFIX, ...seed]);
  // Exported once to read the public half, then imported again so the stored key can't be read out
  const open = await crypto.subtle.importKey('pkcs8', pkcs8, ED25519, true, ['sign']);
  const { x } = await crypto.subtle.exportKey('jwk', open);
  const key = extractable ? open : await crypto.subtle.importKey('pkcs8', pkcs8, ED25519, false, ['sign']);
  return { key, publicKey: x! };
}

/** A public key as sent by an issuer: 32 bytes, base64url */
export function publicKeyOk(text: string): boolean {
  try { return /^[A-Za-z0-9_-]{43}$/.test(text) && fromB64url(text).length === 32; } catch { return false; }
}

/** Id of the public key matching this private key, if it's one of the trust's */
export function keyIdFor(publicKey: string, keys: PublicKeys): string | undefined {
  return Object.keys(keys).find((id) => keys[id].key === publicKey);
}

// The details are packed small so the QR stays easy to scan: a version byte, then each field with
// printable ASCII as itself, a Devanagari letter (U+0900–U+097F) as one byte 0x80–0xFF, anything
// else as 0x01 + its UTF-8, and 0x00 after each field.
const ESCAPE = 0x01;
const END = 0x00;

function packText(text: string, out: number[]) {
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (cp >= 0x20 && cp < 0x7f) out.push(cp);
    else if (cp >= 0x900 && cp < 0x980) out.push(0x80 + cp - 0x900);
    else out.push(ESCAPE, ...enc.encode(ch));
  }
  out.push(END);
}

/** The fields after the version byte, or undefined if the bytes aren't packed text */
function unpackTexts(bytes: Uint8Array): string[] | undefined {
  const utf8 = new TextDecoder('utf-8', { fatal: true });
  const texts: string[] = [];
  let text = '';
  for (let i = 1; i < bytes.length; i++) {
    const b = bytes[i];
    if (b === END) { texts.push(text); text = ''; }
    else if (b >= 0x80) text += String.fromCodePoint(0x900 + b - 0x80);
    else if (b >= 0x20 && b < 0x7f) text += String.fromCharCode(b);
    else if (b === ESCAPE && i + 1 < bytes.length) {
      const lead = bytes[i + 1];
      const size = lead < 0x80 ? 1 : lead >= 0xf0 ? 4 : lead >= 0xe0 ? 3 : 2;
      text += utf8.decode(bytes.subarray(i + 1, i + 1 + size));
      i += size;
    } else return undefined;
  }
  return text ? undefined : texts;
}

/** "<details>.<signature>", both base64url: goes after /verify/# */
export async function signReceipt(key: CryptoKey, keyId: string, f: SignedFields): Promise<string> {
  const bytes = [VERSION];
  for (const text of [keyId, f.serial, f.date, String(f.amount), f.name, f.village, f.mode, f.reference, f.programme, f.purpose]) packText(text, bytes);
  const payload = Uint8Array.from(bytes);
  const signature = new Uint8Array(await crypto.subtle.sign(ED25519, key, payload));
  return `${toB64url(payload)}.${toB64url(signature)}`;
}

/** The fields after the version byte, with the amount as a number */
function readPayload(payload: Uint8Array): any[] | undefined {
  if (payload[0] !== VERSION) return undefined;
  const texts = unpackTexts(payload);
  if (texts?.length !== 10 || !/^\d+(\.\d+)?$/.test(texts[3])) return undefined;
  return [...texts.slice(0, 3), Number(texts[3]), ...texts.slice(4)];
}

export async function verifyReceipt(token: string, keys: PublicKeys): Promise<Verdict> {
  let payload: Uint8Array<ArrayBuffer>, signature: Uint8Array<ArrayBuffer>, data: any[] | undefined;
  try {
    const [p, s, ...rest] = token.trim().split('.');
    if (!p || !s || rest.length) return { ok: false, reason: 'malformed' };
    payload = fromB64url(p);
    signature = fromB64url(s);
    data = readPayload(payload);
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (!data) return { ok: false, reason: 'malformed' };
  const [keyId, serial, date, amount, name, village, mode, reference, programme, purpose] = data;
  const known = typeof keyId === 'string' && Object.hasOwn(keys, keyId) ? keys[keyId] : undefined;
  if (!known) return { ok: false, reason: 'unknown-key' };

  const publicKey = await crypto.subtle.importKey('raw', fromB64url(known.key), ED25519, false, ['verify']);
  const valid = await crypto.subtle.verify(ED25519, publicKey, signature, payload).catch(() => false);
  if (!valid) return { ok: false, reason: 'bad-signature' };
  return { ok: true, keyId, fields: { serial, date, amount, name, village, mode, reference, programme, purpose } };
}
