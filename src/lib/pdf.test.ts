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
});
