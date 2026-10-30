import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WORDS, suggestPassphrase } from './passphrase.ts';
import { passphraseOk } from './receipt-sign.ts';

test('512 different simple words, so picks are unbiased', () => {
  assert.equal(WORDS.length, 512);
  assert.equal(new Set(WORDS).size, 512);
  for (const w of WORDS) assert.match(w, /^[a-z]{3,10}$/);
});

test('suggestPassphrase gives 5 listed words that pass the strength check', () => {
  const p = suggestPassphrase();
  assert.equal(p.split(' ').length, 5);
  for (const w of p.split(' ')) assert.ok(WORDS.includes(w));
  assert.ok(passphraseOk(p));
});
