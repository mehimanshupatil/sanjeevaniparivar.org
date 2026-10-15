// Marathi formatting helpers: numerals, dates, times and time ranges.
// Weekdays, numerals and time-of-day words are always computed, never typed by hand.

const DIGITS = '०१२३४५६७८९';
const DAYS = ['रविवार', 'सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const MONTHS = ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
  'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'];

/** 2026 → २०२६ */
export function mrNum(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => DIGITS[Number(d)]);
}

/** Accepts "2026-10-31" or a Date (YAML turns unquoted dates into Dates). */
export function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value).trim());
  if (!m) throw new Error(`Date must be YYYY-MM-DD, got "${value}"`);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCMonth() !== +m[2] - 1) throw new Error(`Not a real date: "${value}"`);
  return d;
}

/** 2026-10-31 → "शनिवार, ३१ ऑक्टोबर २०२६" */
export function formatDate(value: string | Date): string {
  const d = parseDate(value);
  return `${DAYS[d.getUTCDay()]}, ${mrNum(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${mrNum(d.getUTCFullYear())}`;
}

interface Time { h: number; min: number }

export function parseTime(value: string): Time {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(value).trim());
  if (!m || +m[1] > 23 || +m[2] > 59) throw new Error(`Time must be HH:MM (24-hour), got "${value}"`);
  return { h: +m[1], min: +m[2] };
}

/** पहाटे (4–6), सकाळी (6–12), दुपारी (12–17), सायंकाळी (17–20), रात्री (20–4) */
function period(h: number): string {
  if (h < 4) return 'रात्री';
  if (h < 6) return 'पहाटे';
  if (h < 12) return 'सकाळी';
  if (h < 17) return 'दुपारी';
  if (h < 20) return 'सायंकाळी';
  return 'रात्री';
}

function clock({ h, min }: Time): string {
  return `${mrNum(h % 12 || 12)}.${mrNum(String(min).padStart(2, '0'))}`;
}

/** "16:00" → "दुपारी ४.००" */
export function formatTime(value: string): string {
  const t = parseTime(value);
  return `${period(t.h)} ${clock(t)}`;
}

/**
 * ("16:00","22:00") → "दुपारी ४.०० ते रात्री १०.०० वाजेपर्यंत"
 * ("09:00")         → "सकाळी ९.०० वाजल्यापासून"
 * ("09:00","11:00") → "सकाळी ९.०० ते ११.०० वाजेपर्यंत" (repeated period dropped)
 */
export function formatRange(from: string, to?: string): string {
  const a = parseTime(from);
  if (!to) return `${period(a.h)} ${clock(a)} वाजल्यापासून`;
  const b = parseTime(to);
  const end = period(a.h) === period(b.h) ? clock(b) : `${period(b.h)} ${clock(b)}`;
  return `${period(a.h)} ${clock(a)} ते ${end} वाजेपर्यंत`;
}

/** ["A","B","C"] → "A, B आणि C" */
export function joinMr(list: string[]): string {
  if (list.length < 2) return list.join('');
  return `${list.slice(0, -1).join(', ')} आणि ${list[list.length - 1]}`;
}

/**
 * Replaces `{{ name }}` placeholders from a fixed map, so YAML text can say
 * "{{ fullTitle }}" and update itself each year. Unknown names are an error.
 */
export function fillPlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => {
    if (!(name in values)) throw new Error(`Unknown placeholder {{ ${name} }} in "${text}"`);
    return values[name];
  });
}
