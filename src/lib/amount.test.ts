import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amountWordsMr, amountWordsEn, formatRupees, MAX_AMOUNT } from './amount.ts';

test('amountWordsMr', () => {
  assert.equal(amountWordsMr(1), 'एक');
  assert.equal(amountWordsMr(51), 'एक्कावन्न');
  assert.equal(amountWordsMr(100), 'शंभर');
  assert.equal(amountWordsMr(101), 'एकशे एक');
  assert.equal(amountWordsMr(150), 'एकशे पन्नास');
  assert.equal(amountWordsMr(500), 'पाचशे');
  assert.equal(amountWordsMr(1000), 'एक हजार');
  assert.equal(amountWordsMr(1100), 'एक हजार एकशे');
  assert.equal(amountWordsMr(12500), 'बारा हजार पाचशे');
  assert.equal(amountWordsMr(100000), 'एक लाख');
  assert.equal(amountWordsMr(250001), 'दोन लाख पन्नास हजार एक');
  assert.equal(amountWordsMr(12345678), 'एक कोटी तेवीस लाख पंचेचाळीस हजार सहाशे अठ्ठ्याहत्तर');
});

test('amountWordsEn', () => {
  assert.equal(amountWordsEn(1), 'One');
  assert.equal(amountWordsEn(21), 'Twenty-One');
  assert.equal(amountWordsEn(100), 'One Hundred');
  assert.equal(amountWordsEn(12500), 'Twelve Thousand Five Hundred');
  assert.equal(amountWordsEn(250001), 'Two Lakh Fifty Thousand One');
  assert.equal(amountWordsEn(12345678), 'One Crore Twenty-Three Lakh Forty-Five Thousand Six Hundred Seventy-Eight');
});

test('rejects amounts that are not whole rupees in range', () => {
  for (const n of [0, -5, 10.5, NaN, MAX_AMOUNT + 1]) assert.throws(() => amountWordsMr(n));
});

test('formatRupees uses Indian grouping', () => {
  assert.equal(formatRupees(1250000), '12,50,000');
});
