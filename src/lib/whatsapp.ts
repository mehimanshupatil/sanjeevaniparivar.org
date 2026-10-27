// Pure helpers for the WhatsApp sender (/publicity/whatsapp/): CSV, phone numbers, template
// placeholders and the request body for Meta's API. No browser or network code here (tested).

/** Graph API version, released 2026-07-29. Upgrade steps: docs/publicity.md → Sending on WhatsApp → Upkeep */
export const GRAPH = 'https://graph.facebook.com/v26.0';

/** The trust's WhatsApp sending number and account. Not secret (useless without a token);
 *  the access token is never written here, only typed on the page. */
export const WA_PHONE_NUMBER_ID = '1318982904641019';
export const WA_BUSINESS_ACCOUNT_ID = '1526133689313986';

/** A template as returned by GET /<WABA_ID>/message_templates */
export interface WaTemplate {
  id: string;
  name: string;
  language: string;
  status: string;
  category: string;
  parameter_format?: 'POSITIONAL' | 'NAMED';
  components: WaComponent[];
}

export interface WaComponent {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
  format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LOCATION';
  text?: string;
  buttons?: { type: string; text: string; url?: string }[];
}

/** One placeholder to fill: {{1}} or {{name}} in the header text, the body, or a URL button */
export interface Slot {
  key: string;
  where: 'header' | 'body' | 'button';
  name: string;
  /** button: its position in the template */
  index?: number;
}

/** Parses CSV (quoted fields, "" escapes, CRLF, a leading BOM). Blank lines are dropped. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const s = text.replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"' && s[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim())) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim())) rows.push(row);
  return rows.map((r) => r.map((f) => f.trim()));
}

/** Writes rows as CSV, quoting where needed. */
export function toCsv(rows: string[][]): string {
  const q = (f: string) => (/[",\n\r]/.test(f) ? `"${f.replace(/"/g, '""')}"` : f);
  return rows.map((r) => r.map(q).join(',')).join('\n');
}

/**
 * A phone number as WhatsApp wants it: country code + number, digits only.
 * "98765 43210", "+91 98765-43210", "09876543210" → "919876543210". Indian mobiles start 6–9.
 * Other countries need their code written ("+44 …"). Returns null if it can't be a number.
 */
export function normalizePhone(raw: string): string | null {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  if (d.length === 10) return /^[6-9]/.test(d) ? `91${d}` : null;
  if (d.length === 12 && d.startsWith('91')) return /^91[6-9]/.test(d) ? d : null;
  return d.length >= 11 && d.length <= 15 && !d.startsWith('91') ? d : null;
}

const PLACEHOLDER = /\{\{\s*([\w]+)\s*\}\}/g;
const namesIn = (text = '') => [...new Set([...text.matchAll(PLACEHOLDER)].map((m) => m[1]))];

/** Every placeholder in a template, in order: header text, body, then URL buttons. */
export function templateSlots(t: WaTemplate): Slot[] {
  const slots: Slot[] = [];
  for (const c of t.components) {
    if (c.type === 'HEADER' && c.format === 'TEXT') namesIn(c.text).forEach((name) => slots.push({ key: `header:${name}`, where: 'header', name }));
    if (c.type === 'BODY') namesIn(c.text).forEach((name) => slots.push({ key: `body:${name}`, where: 'body', name }));
    if (c.type === 'BUTTONS') c.buttons?.forEach((b, index) => {
      if (b.type === 'URL') namesIn(b.url).forEach((name) => slots.push({ key: `button:${index}:${name}`, where: 'button', name, index }));
    });
  }
  return slots;
}

/** The media type of the template's header, if it has one (an image, video or document to send) */
export function headerMedia(t: WaTemplate): 'image' | 'video' | 'document' | undefined {
  const f = t.components.find((c) => c.type === 'HEADER')?.format;
  return f === 'IMAGE' ? 'image' : f === 'VIDEO' ? 'video' : f === 'DOCUMENT' ? 'document' : undefined;
}

/** The template's text with placeholders filled, for a preview */
export function fillText(text: string, values: Record<string, string>, where: string): string {
  return text.replace(PLACEHOLDER, (m, name: string) => values[`${where}:${name}`] || m);
}

/**
 * The body for POST /<PHONE_NUMBER_ID>/marketing_messages (or /messages).
 * values: text for each slot key; mediaLink: public URL of the header image/video/document.
 */
export function buildMessage(t: WaTemplate, to: string, values: Record<string, string>, mediaLink?: string) {
  const named = t.parameter_format === 'NAMED';
  const param = (s: Slot) => ({ type: 'text', ...(named ? { parameter_name: s.name } : {}), text: values[s.key] ?? '' });
  const slots = templateSlots(t);
  const of = (where: Slot['where']) => slots.filter((s) => s.where === where);
  const components: object[] = [];

  const media = headerMedia(t);
  if (media) {
    if (!mediaLink) throw new Error('This template has a media header: give the link of the image');
    components.push({ type: 'header', parameters: [{ type: media, [media]: { link: mediaLink } }] });
  } else if (of('header').length) {
    components.push({ type: 'header', parameters: of('header').map(param) });
  }
  if (of('body').length) components.push({ type: 'body', parameters: of('body').map(param) });
  const buttons = new Map<number, Slot[]>();
  of('button').forEach((s) => buttons.set(s.index!, [...(buttons.get(s.index!) ?? []), s]));
  buttons.forEach((list, index) => components.push({
    type: 'button', sub_type: 'url', index: String(index),
    parameters: list.map((s) => ({ type: 'text', text: values[s.key] ?? '' })),
  }));

  return {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: { name: t.name, language: { code: t.language }, ...(components.length ? { components } : {}) },
  };
}

/** Marketing templates go through the Marketing Messages API (falls back to Cloud API by itself) */
export const sendPath = (t: WaTemplate) => (t.category === 'MARKETING' ? 'marketing_messages' : 'messages');

/** Meta's automatic creative optimizations; `turn all off` sets each to OPT_OUT on the template */
export const CREATIVE_FEATURES = [
  'image_brightness_and_contrast', 'image_touchups', 'add_text_overlay', 'image_animation', 'image_background_gen',
  'auto_promotion_tag', 'text_extraction_for_headline', 'text_extraction_for_tap_target', 'product_extensions',
  'text_formatting_optimization',
];

/** Names of the optimizations switched on, from GET /<TEMPLATE_ID>?fields=degrees_of_freedom_spec */
export function optimizationsOn(spec: unknown): string[] {
  const list = (spec as { creative_features_spec?: { key: string; value: { enroll_status: string } }[] })?.creative_features_spec;
  return Array.isArray(list) ? list.filter((f) => f.value?.enroll_status === 'OPT_IN').map((f) => f.key.toLowerCase()) : [];
}

/** A readable message from a Graph API error response */
export function apiError(json: unknown, status: number): string {
  const e = (json as { error?: { message?: string; code?: number; error_data?: { details?: string } } })?.error;
  if (!e) return `HTTP ${status}`;
  return [e.code && `#${e.code}`, e.message, e.error_data?.details].filter(Boolean).join(' — ');
}
