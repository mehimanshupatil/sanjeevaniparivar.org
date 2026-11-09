// Pure logic for the WhatsApp webhook Worker: checking Meta's signature, reading message statuses
// and incoming messages out of a webhook body, STOP requests, the ids a status request may ask for,
// and the CSV export. No Worker APIs here (tested).

export type Delivery = 'sent' | 'delivered' | 'read' | 'failed';
/** Statuses can arrive out of order: keep the furthest one. Failed is final. */
export const RANK: Record<Delivery, number> = { sent: 1, delivered: 2, read: 3, failed: 4 };

export interface StatusRow { id: string; status: Delivery; rank: number; at: number; error: string | null }

interface MetaStatus {
  id?: string;
  status?: string;
  timestamp?: string;
  errors?: { code?: number; title?: string; message?: string; error_data?: { details?: string } }[];
}
interface MetaBody { entry?: { changes?: { field?: string; value?: { statuses?: MetaStatus[] } }[] }[] }

/** The message statuses in a webhook body. Incoming messages and other fields are ignored. */
export function parseStatuses(body: unknown): StatusRow[] {
  return ((body as MetaBody)?.entry ?? [])
    .flatMap((e) => e.changes ?? [])
    .filter((c) => c.field === 'messages')
    .flatMap((c) => c.value?.statuses ?? [])
    .flatMap((s) => {
      if (!s.id || !s.status || !Object.hasOwn(RANK, s.status)) return [];
      const status = s.status as Delivery;
      const e = s.errors?.[0];
      const error = e ? [e.code && `#${e.code}`, e.title ?? e.message, e.error_data?.details].filter(Boolean).join(' — ') : null;
      return [{ id: s.id, status, rank: RANK[status], at: Number(s.timestamp) || 0, error }];
    });
}

/** Meta signs each POST with the app secret: X-Hub-Signature-256: sha256=<hex HMAC of the raw body> */
export async function validSignature(secret: string, body: Uint8Array<ArrayBuffer>, header: string | null): Promise<boolean> {
  if (!secret || !header?.startsWith('sha256=')) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, body));
  const hex = [...mac].map((b) => b.toString(16).padStart(2, '0')).join('');
  const given = header.slice(7).toLowerCase();
  // Constant time: don't reveal how many characters matched
  let diff = hex.length ^ given.length;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

/** At most this many ids per status request (D1 binds up to 100 values per query) */
export const MAX_IDS = 100;

/** The message ids in ?ids=a,b,c: WhatsApp ids only, no repeats, at most MAX_IDS */
export function statusIds(param: string | null): string[] {
  const ids = (param ?? '').split(',').map((s) => s.trim()).filter((s) => /^wamid\.[A-Za-z0-9_=+/-]{1,200}$/.test(s));
  return [...new Set(ids)].slice(0, MAX_IDS);
}

interface MetaMessage {
  id?: string; from?: string; type?: string; timestamp?: string;
  text?: { body?: string };
  image?: { caption?: string }; video?: { caption?: string }; document?: { caption?: string; filename?: string };
  button?: { text?: string };
  interactive?: { button_reply?: { title?: string }; list_reply?: { title?: string } };
}
interface MetaIncoming { value?: { metadata?: { phone_number_id?: string }; contacts?: { wa_id?: string; profile?: { name?: string } }[]; messages?: MetaMessage[] } }

export interface Incoming {
  phoneNumberId: string;
  /** wamid of their message: Meta may send it twice */
  id: string;
  /** Their WhatsApp number, country code first, digits only */
  from: string;
  /** Their WhatsApp profile name, '' if not given */
  name: string;
  type: string;
  /** What they wrote (or a caption, or the button they tapped), at most MAX_TEXT characters */
  text: string;
  at: number;
}

/** Message text kept, so a long one can't fill the database */
export const MAX_TEXT = 500;

/** Who wrote to the trust's number and what. Emoji reactions don't count. */
export function parseIncoming(body: unknown): Incoming[] {
  return ((body as { entry?: { changes?: (MetaIncoming & { field?: string })[] }[] })?.entry ?? [])
    .flatMap((e) => e.changes ?? [])
    .filter((c) => c.field === 'messages')
    .flatMap((c) => (c.value?.messages ?? []).flatMap((m): Incoming[] => {
      const phoneNumberId = c.value?.metadata?.phone_number_id;
      if (!phoneNumberId || !m.from || !m.id || m.type === 'reaction') return [];
      const name = c.value?.contacts?.find((x) => x.wa_id === m.from)?.profile?.name ?? '';
      const text = m.text?.body ?? m.button?.text ?? m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title
        ?? m.image?.caption ?? m.video?.caption ?? m.document?.caption ?? m.document?.filename ?? '';
      return [{ phoneNumberId, id: m.id, from: m.from, name, type: m.type ?? '', text: text.slice(0, MAX_TEXT), at: Number(m.timestamp) || 0 }];
    }));
}

const words = (text: string) => text.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ').trim();

/**
 * "stop": they asked for no more messages ("STOP", "थांबवा", or the "Stop promotions" button of a
 * marketing template). "start": they asked to have them again. Only the whole message counts,
 * so "please don't stop" is just a message.
 */
export function optOutIntent(text: string): 'stop' | 'start' | undefined {
  const w = words(text);
  if (['stop', 'stop promotions', 'unsubscribe', 'थांबवा', 'थांबा', 'बंद', 'बंद करा', 'नको'].includes(w)) return 'stop';
  if (['start', 'resume promotions', 'सुरू', 'सुरू करा'].includes(w)) return 'start';
  return undefined;
}

/** True if the request carries the export key: "Authorization: Bearer <key>". Constant time. */
export function hasKey(key: string, header: string | null): boolean {
  const given = header?.startsWith('Bearer ') ? header.slice(7) : '';
  if (!key || !given) return false;
  let diff = key.length ^ given.length;
  for (let i = 0; i < key.length; i++) diff |= key.charCodeAt(i) ^ (given.charCodeAt(i) || 0);
  return diff === 0;
}

/** Unix seconds as Indian time, "2026-11-09 14:05" */
export const istTime = (at: number) => new Date((at + 5.5 * 3600) * 1000).toISOString().slice(0, 16).replace('T', ' ');

/** Rows as CSV with a BOM, so Excel reads Marathi right */
export function toCsv(rows: (string | number)[][]): string {
  const q = (f: string | number) => (/[",\n\r]/.test(String(f)) ? `"${String(f).replace(/"/g, '""')}"` : String(f));
  return '\ufeff' + rows.map((r) => r.map(q).join(',')).join('\n');
}
