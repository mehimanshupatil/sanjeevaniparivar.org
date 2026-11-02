// A one-page PDF holding a single JPEG, made in the browser (the site has no server).
// The JPEG goes in as-is (DCTDecode), so Marathi text keeps the shaping the browser gave it.
// Over it goes an invisible text layer (like an OCR'd scan), so the text can be selected and copied:
// each character is one glyph of a font that is never drawn, mapped back to Unicode by a ToUnicode CMap.

const enc = new TextEncoder();

/** Width and height of a baseline or progressive JPEG, read from its SOF marker */
export function jpegSize(jpeg: Uint8Array): { width: number; height: number } {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) throw new Error('Not a JPEG');
  let i = 2;
  while (i + 9 < jpeg.length) {
    if (jpeg[i] !== 0xff) { i++; continue; }
    const marker = jpeg[i + 1];
    const length = (jpeg[i + 2] << 8) | jpeg[i + 3];
    // SOF0–SOF15, except DHT (C4), JPG (C8) and DAC (CC)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: (jpeg[i + 5] << 8) | jpeg[i + 6], width: (jpeg[i + 7] << 8) | jpeg[i + 8] };
    }
    i += 2 + length;
  }
  throw new Error('JPEG has no size');
}

/** A clickable area over the image, as fractions of its width and height from the top left */
export interface PdfLink { x: number; y: number; w: number; h: number; url: string }

/** Invisible text over the image, as fractions of its width and height like PdfLink: one line of text each */
export interface PdfText { x: number; y: number; w: number; h: number; text: string }

const round = (n: number) => Math.round(n * 100) / 100;
const hex4 = (n: number) => n.toString(16).padStart(4, '0').toUpperCase();

/** The text-drawing operators (render mode 3: invisible) and the CMap mapping their glyph ids back to Unicode */
export function textLayer(texts: PdfText[], w: number, h: number): { ops: string; cmap: string } {
  const chars: string[] = [];
  const ids = new Map<string, number>();
  // Glyph id per character, from 1 (0 is .notdef)
  const glyphs = (text: string) => [...text].map((c) => {
    let id = ids.get(c);
    if (id === undefined) { id = chars.push(c); ids.set(c, id); }
    return hex4(id);
  }).join('');
  const ops = texts.filter((t) => t.text.trim() && t.w > 0 && t.h > 0).map((t) => {
    // The font's em box is the line's height (ascent 0.8, descent 0.2) and every glyph is 1 em wide,
    // stretched with Tz so the text spans the line's width: selection then covers what is seen
    const size = round(t.h * h);
    const count = [...t.text].length;
    const scale = round((t.w * w) / (count * size) * 100);
    return `/F1 ${size} Tf ${scale} Tz 1 0 0 1 ${round(t.x * w)} ${round((1 - t.y - t.h * 0.8) * h)} Tm <${glyphs(t.text)}> Tj`;
  });
  const utf16 = (c: string) => [...Array(c.length)].map((_, i) => hex4(c.charCodeAt(i))).join('');
  const blocks: string[] = [];
  for (let i = 0; i < chars.length; i += 100) {
    const part = chars.slice(i, i + 100);
    blocks.push(`${part.length} beginbfchar\n${part.map((c, j) => `<${hex4(i + j + 1)}> <${utf16(c)}>`).join('\n')}\nendbfchar`);
  }
  const cmap = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n' +
    '/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n' +
    `1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n${blocks.join('\n')}\n` +
    'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
  return { ops: ops.length ? `BT 3 Tr ${ops.join(' ')} ET` : '', cmap };
}

const pdfString = (s: string) => `(${s.replace(/[\\()]/g, '\\$&')})`;

/** The JPEG fills a page of the given width in points (A5 = 419.53pt); the height follows the image */
export function jpegToPdf(jpeg: Uint8Array, pageWidthPt: number, links: PdfLink[] = [], texts: PdfText[] = []): Uint8Array {
  const { width, height } = jpegSize(jpeg);
  const w = pageWidthPt;
  const h = Math.round((pageWidthPt * height) / width * 100) / 100;
  const layer = textLayer(texts, w, h);
  const draw = `q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q${layer.ops ? `\n${layer.ops}` : ''}`;

  const parts: Uint8Array[] = [];
  const offsets: number[] = [];
  let size = 0;
  const push = (p: string | Uint8Array) => { const b = typeof p === 'string' ? enc.encode(p) : p; parts.push(b); size += b.length; };
  const obj = (n: number, body: string | Uint8Array[]) => {
    offsets[n] = size;
    push(`${n} 0 obj\n`);
    for (const b of typeof body === 'string' ? [body] : body) push(b);
    push('\nendobj\n');
  };

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  // PDF y runs up from the bottom of the page
  const annots = links.map((l) => {
    const rect = [l.x * w, (1 - l.y - l.h) * h, (l.x + l.w) * w, (1 - l.y) * h].map((n) => Math.round(n * 100) / 100);
    return `<< /Type /Annot /Subtype /Link /Rect [${rect.join(' ')}] /Border [0 0 0] /A << /S /URI /URI ${pdfString(l.url)} >> >>`;
  });
  obj(3, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 4 0 R >>${layer.ops ? ' /Font << /F1 6 0 R >>' : ''} >> /Contents 5 0 R${annots.length ? ` /Annots [${annots.join(' ')}]` : ''} >>`);
  obj(4, [enc.encode(`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`), jpeg, enc.encode('\nendstream')]);
  obj(5, `<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
  if (layer.ops) {
    // Never drawn (and not embedded): only its glyph ids and their Unicode matter
    obj(6, '<< /Type /Font /Subtype /Type0 /BaseFont /SPText /Encoding /Identity-H /DescendantFonts [7 0 R] /ToUnicode 9 0 R >>');
    obj(7, '<< /Type /Font /Subtype /CIDFontType2 /BaseFont /SPText /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> ' +
      '/FontDescriptor 8 0 R /DW 1000 /CIDToGIDMap /Identity >>');
    obj(8, '<< /Type /FontDescriptor /FontName /SPText /Flags 4 /FontBBox [0 -200 1000 800] /ItalicAngle 0 /Ascent 800 /Descent -200 /CapHeight 700 /StemV 80 >>');
    obj(9, `<< /Length ${layer.cmap.length} >>\nstream\n${layer.cmap}\nendstream`);
  }

  const xref = size;
  const count = offsets.length;
  push(`xref\n0 ${count}\n0000000000 65535 f \n${offsets.slice(1).map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`);
  push(`trailer\n<< /Size ${count} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);

  const out = new Uint8Array(size);
  let at = 0;
  for (const p of parts) { out.set(p, at); at += p.length; }
  return out;
}
