import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { jpegSize, jpegToPdf, pagesToPdf } from './pdf.ts';

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

test('pagesToPdf: several images per page, cut lines, links and text placed within their image', async () => {
  const img = await jpeg(400, 200);
  const receipt = (y: number) => ({ jpeg: img, x: 50, y, w: 400, links: [{ x: 0.5, y: 0.5, w: 0.25, h: 0.25, url: 'https://x.org' }], texts: [{ x: 0, y: 0, w: 0.5, h: 0.1, text: 'अ' }] });
  const pdf = pagesToPdf([
    { width: 500, height: 600, images: [receipt(50), receipt(300)], cuts: [300] },
    { width: 500, height: 600, images: [receipt(50)] },
  ]);
  const text = new TextDecoder().decode(pdf);
  // Page 1: objects 3 (page), 4–5 (images), 6 (content); page 2: 7, 8, 9; the font from 10
  assert.match(text, /\/Kids \[3 0 R 7 0 R\] \/Count 2/);
  assert.match(text, /\/XObject << \/Im0 4 0 R \/Im1 5 0 R >> \/Font << \/F1 10 0 R >> >> \/Contents 6 0 R/);
  // A 400×200 image at (50, 300) from the top of a 600pt page: 200pt high, bottom edge 100pt up
  assert.match(text, /q 400 0 0 200 50 100 cm \/Im1 Do Q/);
  assert.match(text, /\[4 3\] 0 d 14 300 m 486 300 l S/);
  // The second image's link: x 250–350, y 300+100…300+150 from the top
  assert.match(text, /\/Rect \[250 150 350 200\]/);
  // Its text line: 20pt high at its top left, baseline 0.8 down
  assert.match(text, /\/F1 20 Tf 1000 Tz 1 0 0 1 50 284 Tm <0001> Tj/);
  // One character, one glyph, shared by both pages
  assert.match(text, /1 beginbfchar\n<0001> <0905>/);
  const raw = new TextDecoder('latin1').decode(pdf);
  const xref = Number(/startxref\n(\d+)/.exec(raw)![1]);
  const offsets = [...raw.slice(xref).matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]));
  assert.equal(offsets.length, 13);
  offsets.forEach((o, i) => assert.ok(raw.slice(o).startsWith(`${i + 1} 0 obj`), `object ${i + 1}`));
});
