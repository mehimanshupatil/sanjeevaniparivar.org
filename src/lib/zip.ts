// A ZIP archive made in the browser, files stored as they are (PDFs and images are compressed already).
// Names are UTF-8 (flag bit 11), so Marathi file names survive.

const enc = new TextEncoder();

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of data) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** The files in one archive; a repeated name gets " (2)", " (3)", … before its extension */
export function zip(files: { name: string; data: Uint8Array }[], date = new Date()): Uint8Array {
  // MS-DOS date and time, as unzip tools show them
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1);
  const day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  const used = new Map<string, number>();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const n = (used.get(file.name) ?? 0) + 1;
    used.set(file.name, n);
    const name = enc.encode(n === 1 ? file.name : file.name.replace(/(\.[^.]*)?$/, ` (${n})$1`));
    const crc = crc32(file.data);
    const header = (sig: number, extra: number) => {
      const b = new DataView(new ArrayBuffer(extra));
      b.setUint32(0, sig, true);
      return b;
    };
    const local = header(0x04034b50, 30);
    // version 2.0, flags (UTF-8 names), method 0 (stored), time, date, crc, sizes, name length
    [[4, 20], [6, 0x0800], [8, 0], [10, time], [12, day]].forEach(([at, v]) => local.setUint16(at, v, true));
    local.setUint32(14, crc, true); local.setUint32(18, file.data.length, true); local.setUint32(22, file.data.length, true);
    local.setUint16(26, name.length, true);
    parts.push(new Uint8Array(local.buffer), name, file.data);

    const entry = header(0x02014b50, 46);
    [[4, 20], [6, 20], [8, 0x0800], [10, 0], [12, time], [14, day]].forEach(([at, v]) => entry.setUint16(at, v, true));
    entry.setUint32(16, crc, true); entry.setUint32(20, file.data.length, true); entry.setUint32(24, file.data.length, true);
    entry.setUint16(28, name.length, true);
    entry.setUint32(42, offset, true);
    central.push(new Uint8Array(entry.buffer), name);
    offset += 30 + name.length + file.data.length;
  }

  const centralSize = central.reduce((s, b) => s + b.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
  end.setUint32(12, centralSize, true); end.setUint32(16, offset, true);

  const all = [...parts, ...central, new Uint8Array(end.buffer)];
  const out = new Uint8Array(all.reduce((s, b) => s + b.length, 0));
  let at = 0;
  for (const b of all) { out.set(b, at); at += b.length; }
  return out;
}
