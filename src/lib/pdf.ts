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

/** A box on the page in points, from its top left */
interface Box { x: number; y: number; w: number; h: number }

/** Glyph ids for the invisible text, shared by every page, and the CMap mapping them back to Unicode */
function glyphTable() {
  const chars: string[] = [];
  const ids = new Map<string, number>();
  // Glyph id per character, from 1 (0 is .notdef)
  const glyphs = (text: string) => [...text].map((c) => {
    let id = ids.get(c);
    if (id === undefined) { id = chars.push(c); ids.set(c, id); }
    return hex4(id);
  }).join('');
  const cmap = () => {
    const utf16 = (c: string) => [...Array(c.length)].map((_, i) => hex4(c.charCodeAt(i))).join('');
    const blocks: string[] = [];
    for (let i = 0; i < chars.length; i += 100) {
      const part = chars.slice(i, i + 100);
      blocks.push(`${part.length} beginbfchar\n${part.map((c, j) => `<${hex4(i + j + 1)}> <${utf16(c)}>`).join('\n')}\nendbfchar`);
    }
    return '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n' +
      '/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n' +
      `1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n${blocks.join('\n')}\n` +
      'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
  };
  return { glyphs, cmap, used: () => chars.length > 0 };
}

/** The text-drawing operators for lines of text (render mode 3: invisible), on a page pageH high */
function textOps(lines: (Box & { text: string })[], pageH: number, glyphs: (text: string) => string): string {
  const ops = lines.filter((t) => t.text.trim() && t.w > 0 && t.h > 0).map((t) => {
    // The font's em box is the line's height (ascent 0.8, descent 0.2) and every glyph is 1 em wide,
    // stretched with Tz so the text spans the line's width: selection then covers what is seen
    const size = round(t.h);
    const scale = round(t.w / ([...t.text].length * size) * 100);
    return `/F1 ${size} Tf ${scale} Tz 1 0 0 1 ${round(t.x)} ${round(pageH - t.y - t.h * 0.8)} Tm <${glyphs(t.text)}> Tj`;
  });
  return ops.length ? `BT 3 Tr ${ops.join(' ')} ET` : '';
}

const pdfString = (s: string) => `(${s.replace(/[\\()]/g, '\\$&')})`;

/** A JPEG placed on a page: left and top edge and width in points (the height follows the image) */
export interface PdfImage { jpeg: Uint8Array; x: number; y: number; w: number; links?: PdfLink[]; texts?: PdfText[] }
/** A page in points, its images, and dashed cut lines across it (distances from the top) */
export interface PdfPage { width: number; height: number; images: PdfImage[]; cuts?: number[] }

/** A PDF of these pages */
export function pagesToPdf(pages: PdfPage[]): Uint8Array {
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

  // Objects: 1 catalog, 2 page tree, then per page: the page, its images, its content; the font last
  const pageIds: number[] = [];
  let next = 3;
  for (const p of pages) { pageIds.push(next); next += p.images.length + 2; }
  const font = next;
  const table = glyphTable();

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
  obj(2, `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`);
  pages.forEach((page, p) => {
    const { width: W, height: H } = page;
    const id = pageIds[p];
    const placed = page.images.map((img) => {
      const { width, height } = jpegSize(img.jpeg);
      return { ...img, h: round((img.w * height) / width), width, height };
    });
    // Links and text are given as fractions of their image: into page points
    const inPage = <T extends { x: number; y: number; w: number; h: number }>(img: (typeof placed)[number], b: T): T =>
      ({ ...b, x: img.x + b.x * img.w, y: img.y + b.y * img.h, w: b.w * img.w, h: b.h * img.h });
    const texts = textOps(placed.flatMap((img) => (img.texts ?? []).map((t) => inPage(img, t))), H, table.glyphs);
    // PDF y runs up from the bottom of the page
    const annots = placed.flatMap((img) => (img.links ?? []).map((l) => inPage(img, l))).map((l) => {
      const rect = [l.x, H - l.y - l.h, l.x + l.w, H - l.y].map(round);
      return `<< /Type /Annot /Subtype /Link /Rect [${rect.join(' ')}] /Border [0 0 0] /A << /S /URI /URI ${pdfString(l.url)} >> >>`;
    });
    const draw = [
      ...placed.map((img, i) => `q ${round(img.w)} 0 0 ${img.h} ${round(img.x)} ${round(H - img.y - img.h)} cm /Im${i} Do Q`),
      ...(page.cuts ?? []).map((y) => `q 0.6 G 0.5 w [4 3] 0 d 14 ${round(H - y)} m ${round(W - 14)} ${round(H - y)} l S Q`),
      texts,
    ].filter(Boolean).join('\n');
    const xobjects = placed.map((_, i) => `/Im${i} ${id + 1 + i} 0 R`).join(' ');
    obj(id, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /XObject << ${xobjects} >>${texts ? ` /Font << /F1 ${font} 0 R >>` : ''} >> ` +
      `/Contents ${id + 1 + placed.length} 0 R${annots.length ? ` /Annots [${annots.join(' ')}]` : ''} >>`);
    placed.forEach((img, i) => obj(id + 1 + i, [
      enc.encode(`<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.jpeg.length} >>\nstream\n`),
      img.jpeg, enc.encode('\nendstream'),
    ]));
    obj(id + 1 + placed.length, `<< /Length ${draw.length} >>\nstream\n${draw}\nendstream`);
  });
  if (table.used()) {
    // Never drawn (and not embedded): only its glyph ids and their Unicode matter
    const cmap = table.cmap();
    obj(font, `<< /Type /Font /Subtype /Type0 /BaseFont /SPText /Encoding /Identity-H /DescendantFonts [${font + 1} 0 R] /ToUnicode ${font + 3} 0 R >>`);
    obj(font + 1, '<< /Type /Font /Subtype /CIDFontType2 /BaseFont /SPText /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> ' +
      `/FontDescriptor ${font + 2} 0 R /DW 1000 /CIDToGIDMap /Identity >>`);
    obj(font + 2, '<< /Type /FontDescriptor /FontName /SPText /Flags 4 /FontBBox [0 -200 1000 800] /ItalicAngle 0 /Ascent 800 /Descent -200 /CapHeight 700 /StemV 80 >>');
    obj(font + 3, `<< /Length ${cmap.length} >>\nstream\n${cmap}\nendstream`);
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

/** The JPEG fills a page of the given width in points (A5 = 419.53pt); the height follows the image */
export function jpegToPdf(jpeg: Uint8Array, pageWidthPt: number, links: PdfLink[] = [], texts: PdfText[] = []): Uint8Array {
  const { width, height } = jpegSize(jpeg);
  return pagesToPdf([{ width: pageWidthPt, height: round((pageWidthPt * height) / width), images: [{ jpeg, x: 0, y: 0, w: pageWidthPt, links, texts }] }]);
}
