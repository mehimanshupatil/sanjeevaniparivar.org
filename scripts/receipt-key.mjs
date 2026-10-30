#!/usr/bin/env node
// Makes a key for one person who issues digital donation receipts (/publicity/receipt/).
//
//   pnpm receipt-key "खजिनदार"
//
// The public half is added to src/content/receipt-keys.json: commit and deploy it, then /verify/
// accepts that person's receipts. The private key is printed once, here only. Give it to that
// person directly (in person or on a call) and don't keep it in the repo, chats or email: anyone
// who has it can issue receipts that verify. If it leaks, delete its entry from the JSON and
// deploy: every receipt it signed then shows as not valid, so make the person a new key.
import { readFile, writeFile } from 'node:fs/promises';

const who = process.argv[2]?.trim();
if (!who) {
  console.error('Usage: pnpm receipt-key "<who holds this key>"');
  process.exit(1);
}

const FILE = new URL('../src/content/receipt-keys.json', import.meta.url);
const keys = JSON.parse(await readFile(FILE, 'utf8'));
const used = Object.keys(keys).map((id) => Number(id.slice(1)));
const id = `k${Math.max(0, ...used) + 1}`;

const b64url = (buf) => Buffer.from(buf).toString('base64url');
const pair = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign', 'verify']);
keys[id] = { key: b64url(await crypto.subtle.exportKey('raw', pair.publicKey)), who };
await writeFile(FILE, JSON.stringify(keys, null, 2) + '\n');

console.log(`Added ${id} (${who}) to src/content/receipt-keys.json — commit and deploy it.\n`);
console.log(`Private key for ${who} (shown once, keep it secret):\n`);
console.log(b64url(await crypto.subtle.exportKey('pkcs8', pair.privateKey)));
