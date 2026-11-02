import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crc32, zip } from './zip.ts';

const enc = new TextEncoder();

test('crc32: the standard check value', () => {
  assert.equal(crc32(enc.encode('123456789')), 0xcbf43926);
  assert.equal(crc32(new Uint8Array()), 0);
});

test('zip: Marathi names, repeats renamed, and a central directory that points at each file', () => {
  const files = [
    { name: 'पावती-आनंद-1427.pdf', data: enc.encode('one') },
    { name: 'पावती-आनंद-1427.pdf', data: enc.encode('two') },
    { name: 'notes', data: new Uint8Array() },
  ];
  const archive = zip(files);
  const view = new DataView(archive.buffer);
  const dec = new TextDecoder();
  // End record: 3 entries, and where the central directory starts
  const end = archive.length - 22;
  assert.equal(view.getUint32(end, true), 0x06054b50);
  assert.equal(view.getUint16(end + 10, true), 3);
  let at = view.getUint32(end + 16, true);
  const read = [];
  for (let i = 0; i < 3; i++) {
    assert.equal(view.getUint32(at, true), 0x02014b50);
    assert.equal(view.getUint16(at + 8, true), 0x0800);  // UTF-8 names
    const nameLength = view.getUint16(at + 28, true);
    const name = dec.decode(archive.subarray(at + 46, at + 46 + nameLength));
    // The local header it points at holds the same name, then the file, whose CRC matches
    const local = view.getUint32(at + 42, true);
    assert.equal(view.getUint32(local, true), 0x04034b50);
    assert.equal(dec.decode(archive.subarray(local + 30, local + 30 + nameLength)), name);
    const size = view.getUint32(at + 24, true);
    const data = archive.subarray(local + 30 + nameLength, local + 30 + nameLength + size);
    assert.equal(crc32(data), view.getUint32(at + 16, true));
    read.push([name, dec.decode(data)]);
    at += 46 + nameLength;
  }
  assert.deepEqual(read, [['पावती-आनंद-1427.pdf', 'one'], ['पावती-आनंद-1427 (2).pdf', 'two'], ['notes', '']]);
});
