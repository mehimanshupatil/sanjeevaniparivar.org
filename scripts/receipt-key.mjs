#!/usr/bin/env node
// Registers a person who issues digital donation receipts (/publicity/receipt/).
//
//   pnpm receipt-key "खजिनदार" <public key>
//
// The person opens the receipt page, types their passphrase (or "शब्द सुचवा" for a new one) and sends
// you the public key it shows. The passphrase never leaves their device. Confirm on a call that
// the key really is theirs, then run this, commit src/content/receipt-keys.json and deploy.
// To revoke (passphrase leaked, person leaves): delete their entry and deploy; every receipt they
// signed then shows as not valid.
import { readFile, writeFile } from 'node:fs/promises';

const [who, publicKey] = process.argv.slice(2).map((a) => a?.trim());
if (!who || !publicKey) {
  console.error('Usage: pnpm receipt-key "<who>" <public key from the receipt page>');
  process.exit(1);
}
if (!/^[A-Za-z0-9_-]{43}$/.test(publicKey) || Buffer.from(publicKey, 'base64url').length !== 32) {
  console.error('That is not a public key: copy the 43-character key the receipt page shows.');
  process.exit(1);
}
await crypto.subtle.importKey('raw', Buffer.from(publicKey, 'base64url'), { name: 'Ed25519' }, false, ['verify']);

const FILE = new URL('../src/content/receipt-keys.json', import.meta.url);
const keys = JSON.parse(await readFile(FILE, 'utf8'));
const taken = Object.entries(keys).find(([, k]) => k.key === publicKey);
if (taken) {
  console.error(`Already registered as ${taken[0]} (${taken[1].who}).`);
  process.exit(1);
}
const id = `k${Math.max(0, ...Object.keys(keys).map((k) => Number(k.slice(1)))) + 1}`;
keys[id] = { key: publicKey, who };
await writeFile(FILE, JSON.stringify(keys, null, 2) + '\n');
console.log(`Added ${id} (${who}) to src/content/receipt-keys.json — commit and deploy it.`);
