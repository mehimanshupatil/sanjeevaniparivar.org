// Donation receipts, one or many (/publicity/receipt/): the checks a receipt must pass before it is
// signed, what the QR signs, the PDF's name, and reading a CSV of donations into receipts. Pure
// (tested); the trust's lists (titles, payment modes, …) come from src/content/receipt.ts.
import { MAX_AMOUNT, formatRupees } from './amount.ts';
import { numericDateMr } from './marathi.ts';
import type { SignedFields } from './receipt-sign.ts';

export interface Receipt<M extends string = string> {
  serial: string;
  /** YYYY-MM-DD */
  date: string;
  title: string;
  name: string;
  village: string;
  /** Whole rupees, digits only */
  amount: string;
  programme: string;
  purpose: string;
  mode: M;
  reference: string;
}

/** `by`: how the receipt sentence ends; `ref`: label of its detail; `optional`: the detail can be left out */
export interface PaymentModeRule { id: string; mr: string; en: string; by: string; ref?: string; optional: boolean }

export interface ReceiptRules {
  titles: readonly string[];
  modes: readonly PaymentModeRule[];
  /** कार्यक्रम and निमित्त when a row leaves them empty */
  programme: string;
  purpose: string;
}

export const amountOf = (r: Receipt) => {
  const n = Number(r.amount);
  return r.amount && Number.isInteger(n) && n >= 1 && n <= MAX_AMOUNT ? n : undefined;
};

/** What is still missing before the receipt can be signed, by the form's labels */
export function receiptMissing(r: Receipt, modes: readonly PaymentModeRule[]): string[] {
  const mode = modes.find((m) => m.id === r.mode);
  return [
    !r.serial.trim() && 'क्रमांक',
    !r.date && 'दिनांक',
    !r.name.trim() && 'नाव',
    !amountOf(r) && 'रक्कम (पूर्ण रुपये)',
    !r.programme.trim() && 'कार्यक्रम',
    mode?.ref && !mode.optional && !r.reference.trim() && mode.ref,
  ].filter(Boolean) as string[];
}

/** The details the QR signs */
export function signedFields(r: Receipt, modes: readonly PaymentModeRule[]): SignedFields {
  const mode = modes.find((m) => m.id === r.mode);
  return {
    serial: r.serial.trim(), date: r.date, amount: amountOf(r) ?? 0, name: `${r.title} ${r.name.trim()}`, village: r.village.trim(), mode: r.mode,
    reference: mode?.ref ? r.reference.trim() : '', programme: r.programme.trim(), purpose: r.purpose.trim(),
  };
}

/** पावती-<name>-<receipt no>.pdf; \p{M} keeps Marathi vowel signs (पाटील, not पटल) */
export function receiptFileName(r: Receipt): string {
  const slug = (text: string) => text.trim().replace(/[^\p{L}\p{M}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
  return `${['पावती', slug(r.name), slug(r.serial)].filter(Boolean).join('-')}.pdf`;
}

// ── CSV ──

/** Column names a CSV may use for each detail (Marathi or English; spaces, case and punctuation don't matter) */
export const RECEIPT_COLUMNS: { key: keyof Receipt; names: string[] }[] = [
  { key: 'serial', names: ['क्रमांक', 'पावती क्रमांक', 'पावती क्र', 'serial', 'receipt no', 'receipt number'] },
  { key: 'date', names: ['दिनांक', 'तारीख', 'date'] },
  { key: 'title', names: ['संबोधन', 'title'] },
  { key: 'name', names: ['नाव', 'देणगीदाराचे नाव', 'देणगीदार', 'name', 'donor'] },
  { key: 'village', names: ['गांव', 'गाव', 'village', 'place'] },
  { key: 'amount', names: ['रक्कम', 'amount', 'rs', 'rupees'] },
  { key: 'programme', names: ['कार्यक्रम', 'programme', 'program'] },
  { key: 'purpose', names: ['निमित्त', 'purpose'] },
  { key: 'mode', names: ['माध्यम', 'mode', 'payment mode'] },
  { key: 'reference', names: ['संदर्भ', 'utr', 'धनादेश', 'cheque', 'reference'] },
];

/** The donor's WhatsApp number: optional, only to send them the receipt; never printed or signed */
export const PHONE_COLUMN_NAMES = ['whatsapp', 'whatsapp क्रमांक', 'मोबाईल', 'मोबाइल', 'फोन', 'phone', 'mobile'];

/** A CSV to start from: every column, and one example row */
export const RECEIPT_CSV_TEMPLATE = [
  ['क्रमांक', 'दिनांक', 'संबोधन', 'नाव', 'गांव', 'रक्कम', 'कार्यक्रम', 'निमित्त', 'माध्यम', 'संदर्भ (UTR / धनादेश क्र., बँक)', 'WhatsApp क्रमांक'],
  ['1427', '02/11/2026', 'श्री', 'आनंद रमेश पाटील', 'वाघोली', '12000', 'वार्षिक', 'संजीवनी परिवाराकरिता', 'UPI', '', '98765 43210'],
];

const norm = (s: string) => s.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]/gu, '');
const ascii = (s: string) => s.replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d)));

/** Which column holds each detail: a name matching exactly, else a column name that starts with one ("रक्कम (रु.)") */
export function receiptColumns(header: string[]): Partial<Record<keyof Receipt, number>> {
  const cols = header.map(norm);
  const found: Partial<Record<keyof Receipt, number>> = {};
  for (const { key, names } of RECEIPT_COLUMNS) {
    const n = names.map(norm);
    let i = cols.findIndex((c) => n.includes(c));
    if (i < 0) i = cols.findIndex((c) => n.some((name) => c.startsWith(name)));
    if (i >= 0 && !Object.values(found).includes(i)) found[key] = i;
  }
  return found;
}

/** 2026-11-02, 2/11/2026, 02-11-26, २/११/२०२६ (day first), or a spreadsheet's "2026-11-02 00:00:00" → YYYY-MM-DD */
export function parseReceiptDate(text: string): string | undefined {
  const t = ascii(text.trim());
  let y: number, m: number, d: number;
  let match = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T].*)?$/.exec(t);
  if (match) [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  else {
    match = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4}|\d{2})$/.exec(t);
    if (!match) return undefined;
    [d, m, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
    if (y < 100) y += 2000;
  }
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return undefined;
  return date.toISOString().slice(0, 10);
}

/** "₹ 12,000/-", "१२०००", "12000.00" → "12000"; anything else is kept as typed, so the check reports it */
export function parseReceiptAmount(text: string): string {
  const t = ascii(text).replace(/₹|रु\.?|rs\.?|\/-|[,\s]/gi, '').replace(/\.0+$/, '');
  return /^\d+$/.test(t) ? t : text.trim();
}

/** A payment mode by its id, Marathi or English name or sentence ending ("रोख", "Cash", "NEFT", "धनादेशाने") */
export function parsePaymentMode(text: string, modes: readonly PaymentModeRule[]): string | undefined {
  const t = norm(text);
  if (!t) return 'cash';
  const exact = modes.find((m) => [m.id, m.mr, m.en, m.by].some((n) => norm(n) === t));
  if (exact) return exact.id;
  if (/neft|rtgs|imps|bank|बँक/.test(t)) return modes.find((m) => m.id === 'bank')?.id;
  if (/cheque|check|chq|धनादेश/.test(t)) return modes.find((m) => m.id === 'cheque')?.id;
  if (/upi|gpay|phonepe|paytm/.test(t)) return modes.find((m) => m.id === 'upi')?.id;
  if (/cash|रोख/.test(t)) return modes.find((m) => m.id === 'cash')?.id;
  return undefined;
}

export interface ReceiptRow {
  /** The row's line in the CSV, counting the header as 1 */
  line: number;
  receipt: Receipt;
  /** WhatsApp number as typed, '' when none */
  phone: string;
  /** Empty when the receipt can be made */
  problems: string[];
}

/** Each filled row of a CSV (header first) as a receipt, with what is wrong with it */
export function parseReceiptCsv(rows: string[][], rules: ReceiptRules): { rows: ReceiptRow[]; missingColumns: string[] } {
  const [header = [], ...body] = rows;
  const col = receiptColumns(header);
  const used = Object.values(col);
  const names = PHONE_COLUMN_NAMES.map(norm);
  const free = header.map(norm).map((c, i) => (used.includes(i) ? '' : c));
  let phoneCol = free.findIndex((c) => c && names.includes(c));
  if (phoneCol < 0) phoneCol = free.findIndex((c) => c && names.some((n) => c.startsWith(n)));
  const missingColumns = (['serial', 'name', 'amount'] as const).filter((k) => col[k] === undefined)
    .map((k) => RECEIPT_COLUMNS.find((c) => c.key === k)!.names[0]);
  const titles = [...rules.titles].sort((a, b) => b.length - a.length);
  const seen = new Map<string, number>();

  const out = body.flatMap((cells, i): ReceiptRow[] => {
    if (!cells.some((c) => c.trim())) return [];
    const get = (k: keyof Receipt) => (col[k] === undefined ? '' : cells[col[k]!] ?? '').trim();
    const problems: string[] = [];

    // "श्री. आनंद पाटील" in the name column: the title comes off the front
    let name = get('name');
    let title = get('title').replace(/\.$/, '');
    const known = (t: string) => rules.titles.find((x) => x.replace(/\.$/, '') === t);
    if (!title) {
      const front = titles.find((t) => new RegExp(`^${t.replace(/\.$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.?(\\s|$)`).test(name));
      if (front) { title = front.replace(/\.$/, ''); name = name.slice(title.length).replace(/^\.?\s*/, ''); }
    }
    const t = title ? known(title) : rules.titles[0];
    if (!t) problems.push(`संबोधन "${title}" ओळखता आले नाही`);

    const rawDate = get('date');
    const date = rawDate ? parseReceiptDate(rawDate) : undefined;
    if (rawDate && !date) problems.push(`दिनांक "${rawDate}" ओळखता आला नाही (दिवस/महिना/वर्ष लिहा)`);

    const rawMode = get('mode');
    const mode = parsePaymentMode(rawMode, rules.modes);
    if (!mode) problems.push(`माध्यम "${rawMode}" ओळखता आले नाही`);

    const receipt: Receipt = {
      serial: ascii(get('serial')), date: date ?? '', title: t ?? rules.titles[0], name, village: get('village'),
      amount: parseReceiptAmount(get('amount')), programme: get('programme') || rules.programme, purpose: get('purpose') || rules.purpose,
      mode: mode ?? 'cash', reference: get('reference'),
    };
    problems.push(...receiptMissing(receipt, rules.modes).filter((p) => !(p === 'दिनांक' && rawDate)).map((p) => `${p} नाही`));
    const serial = receipt.serial;
    if (serial) {
      const first = seen.get(serial);
      if (first) problems.push(`क्रमांक ${serial} ओळ ${first} मध्येही आहे`);
      else seen.set(serial, i + 2);
    }
    return [{ line: i + 2, receipt, phone: phoneCol < 0 ? '' : (cells[phoneCol] ?? '').trim(), problems }];
  });
  return { rows: out, missingColumns };
}

// ── WhatsApp ──

/** The receipt's details a WhatsApp template can fill in: {{name}}, {{amount}}, … */
export const RECEIPT_MESSAGE_FIELDS = [
  { key: 'name', mr: 'नाव' },
  { key: 'amount', mr: 'रक्कम' },
  { key: 'serial', mr: 'पावती क्रमांक' },
  { key: 'date', mr: 'दिनांक' },
  { key: 'programme', mr: 'कार्यक्रम' },
  { key: 'purpose', mr: 'निमित्त' },
  { key: 'village', mr: 'गांव' },
] as const;
export type ReceiptMessageField = (typeof RECEIPT_MESSAGE_FIELDS)[number]['key'];

/** Each detail as the message shows it: "श्री आनंद पाटील", "₹ 12,000", "०२/११/२०२६" */
export function receiptMessageValues(r: Receipt): Record<ReceiptMessageField, string> {
  const amount = amountOf(r);
  let date = '';
  try { date = r.date ? numericDateMr(r.date) : ''; } catch { /* left empty */ }
  return {
    name: `${r.title} ${r.name.trim()}`, amount: amount ? `₹ ${formatRupees(amount)}` : '', serial: r.serial.trim(), date,
    programme: r.programme.trim(), purpose: r.purpose.trim(), village: r.village.trim(),
  };
}

/** Which detail fills a placeholder: {{amount}} by its name; {{1}}, {{2}}, … as name, amount, serial, date, programme */
export function receiptFieldFor(placeholder: string, position: number): ReceiptMessageField {
  const named = RECEIPT_MESSAGE_FIELDS.find((f) => f.key === placeholder);
  return named ? named.key : (['name', 'amount', 'serial', 'date', 'programme'] as const)[position] ?? 'name';
}
