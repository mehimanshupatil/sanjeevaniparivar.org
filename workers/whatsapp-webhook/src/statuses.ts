// Pure logic for the WhatsApp webhook Worker: checking Meta's signature, reading message statuses
// out of a webhook body, and the ids a status request may ask for. No Worker APIs here (tested).

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
