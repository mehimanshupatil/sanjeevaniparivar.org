import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { jpegSize, jpegToPdf } from './pdf.ts';

const jpeg = async (width: number, height: number, progressive = false) =>
  new Uint8Array(await sharp({ create: { width, height, channels: 3, background: '#C41E3A' } }).jpeg({ progressive }).toBuffer());

test('jpegSize reads baseline and progressive JPEGs', async () => {
  assert.deepEqual(jpegSize(await jpeg(300, 200)), { width: 300, height: 200 });
  assert.deepEqual(jpegSize(await jpeg(120, 340, true)), { width: 120, height: 340 });
  assert.throws(() => jpegSize(new Uint8Array([0x89, 0x50, 0x4e, 0x47])));
});

test('jpegToPdf: page keeps the image shape, xref points at each object', async () => {
  const img = await jpeg(800, 1000);
  const pdf = jpegToPdf(img, 400);
  const text = new TextDecoder('latin1').decode(pdf);
  assert.ok(text.startsWith('%PDF-1.4'));
  assert.ok(text.endsWith('%%EOF\n'));
  assert.match(text, /\/MediaBox \[0 0 400 500\]/);
  assert.match(text, new RegExp(`/Length ${img.length} >>`));

  const xref = Number(/startxref\n(\d+)/.exec(text)![1]);
  assert.ok(text.slice(xref).startsWith('xref'));
  const offsets = [...text.slice(xref).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
  assert.equal(offsets.length, 5);
  offsets.forEach((o, i) => assert.ok(text.slice(o).startsWith(`${i + 1} 0 obj`), `object ${i + 1}`));
  assert.doesNotMatch(text, /\/Annots/);
});

test('jpegToPdf: links become URI annotations, measured from the bottom', async () => {
  const pdf = jpegToPdf(await jpeg(800, 1000), 400, [{ x: 0.5, y: 0.1, w: 0.25, h: 0.2, url: 'https://x.org/v/#a(b)' }]);
  const text = new TextDecoder('latin1').decode(pdf);
  assert.match(text, /\/Annots \[<< \/Type \/Annot \/Subtype \/Link \/Rect \[200 350 300 450\]/);
  assert.ok(text.includes('/URI (https://x.org/v/#a\\(b\\))'));
});

test('jpegToPdf: text layer is invisible, sized to each line, and maps glyphs back to Unicode', async () => {
  const pdf = jpegToPdf(await jpeg(800, 1000), 400, [], [
    { x: 0.1, y: 0.2, w: 0.5, h: 0.04, text: 'संजीवनी परिवार' },
    { x: 0.1, y: 0.3, w: 0.2, h: 0.04, text: '12,000/-' },
    { x: 0, y: 0, w: 0, h: 0, text: 'hidden' },
  ]);
  const text = new TextDecoder().decode(pdf);
  assert.match(text, /\/Font << \/F1 6 0 R >>/);
  assert.match(text, /BT 3 Tr \/F1 20 Tf /);
  // 'संजीवनी परिवार' is 14 characters, 1 em (20pt) each, stretched to 200pt: 71.43%
  assert.match(text, /\/F1 20 Tf 71\.43 Tz 1 0 0 1 40 384 Tm <0001000200030004000500060004000700080009000A0005000B0009> Tj/);
  assert.match(text, /<0001> <0938>/); // स
  assert.match(text, /<0007> <0020>/); // space
  // 17 distinct characters in the two lines; the empty box adds none
  assert.match(text, /17 beginbfchar/);
  const xref = Number(/startxref\n(\d+)/.exec(text)![1]);
  const raw = new TextDecoder('latin1').decode(pdf);
  const offsets = [...raw.slice(xref).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
  assert.equal(offsets.length, 9);
  offsets.forEach((o, i) => assert.ok(raw.slice(o).startsWith(`${i + 1} 0 obj`), `object ${i + 1}`));
  assert.match(raw, /\/Size 10 /);
});
