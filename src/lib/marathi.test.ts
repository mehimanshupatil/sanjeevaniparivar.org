import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mrNum, ordinalMr, dateParts, formatDate, formatTime, formatAt, formatRange, joinMr, parseDate, fillPlaceholders } from './marathi.ts';

test('mrNum converts digits', () => {
  assert.equal(mrNum(2026), '२०२६');
  assert.equal(mrNum('10.30'), '१०.३०');
});

test('formatDate computes the weekday', () => {
  assert.equal(formatDate('2026-10-31'), 'शनिवार, ३१ ऑक्टोबर २०२६');
  assert.equal(formatDate('2026-11-01'), 'रविवार, १ नोव्हेंबर २०२६');
  assert.equal(formatDate(new Date(Date.UTC(2027, 0, 26))), 'मंगळवार, २६ जानेवारी २०२७');
});

test('parseDate rejects bad dates', () => {
  assert.throws(() => parseDate('2026-02-30'), /Not a real date/);
  assert.throws(() => parseDate('31-10-2026'), /YYYY-MM-DD/);
});

test('formatTime picks the time-of-day word', () => {
  assert.equal(formatTime('05:30'), 'पहाटे ५.३०');
  assert.equal(formatTime('09:00'), 'सकाळी ९.००');
  assert.equal(formatTime('12:00'), 'दुपारी १२.००');
  assert.equal(formatTime('17:15'), 'सायंकाळी ५.१५');
  assert.equal(formatTime('22:00'), 'रात्री १०.००');
  assert.equal(formatTime('00:30'), 'रात्री १२.३०');
  assert.throws(() => formatTime('24:00'), /HH:MM/);
});

test('ordinalMr', () => {
  assert.equal(ordinalMr(1), 'पहिले');
  assert.equal(ordinalMr(3), 'तिसरे');
  assert.equal(ordinalMr(12), '१२वे');
});

test('dateParts', () => {
  assert.deepEqual(dateParts('2026-10-02'), { weekday: 'शुक्रवार', day: '२', month: 'ऑक्टोबर', year: '२०२६' });
});

test('formatAt', () => {
  assert.equal(formatAt('07:30'), 'सकाळी ७.३० वाजता');
  assert.equal(formatAt('18:00'), 'सायंकाळी ६.०० वाजता');
});

test('formatRange', () => {
  assert.equal(formatRange('16:00', '22:00'), 'दुपारी ४.०० ते रात्री १०.०० वाजेपर्यंत');
  assert.equal(formatRange('09:00'), 'सकाळी ९.०० वाजल्यापासून');
  assert.equal(formatRange('09:00', '11:00'), 'सकाळी ९.०० ते ११.०० वाजेपर्यंत');
});

test('joinMr', () => {
  assert.equal(joinMr([]), '');
  assert.equal(joinMr(['अ']), 'अ');
  assert.equal(joinMr(['अ', 'ब', 'क']), 'अ, ब आणि क');
});

test('fillPlaceholders', () => {
  assert.equal(fillPlaceholders('{{ fullTitle }}ची शोभा', { fullTitle: 'ग्राहक पेठ २०२६' }), 'ग्राहक पेठ २०२६ची शोभा');
  assert.throws(() => fillPlaceholders('{{ nope }}', {}), /Unknown placeholder/);
});
