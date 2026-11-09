// Calls to Meta's Graph API from the browser, shared by the WhatsApp sender (/publicity/whatsapp/)
// and the receipt maker (/publicity/receipt/). The settings, with the access token, are saved in
// this browser only, by the sender page.
import { GRAPH, WA_PHONE_NUMBER_ID, WA_BUSINESS_ACCOUNT_ID, WA_STATUS_URL, apiError } from './whatsapp';

/** exportKey: the webhook Worker's EXPORT_KEY, to download incoming messages and the STOP list */
export interface WaSettings { token: string; phoneNumberId: string; wabaId: string; exportKey: string }
export const WA_SETTINGS_KEY = 'sp-whatsapp';
export const WA_EMPTY_SETTINGS: WaSettings = { token: '', phoneNumberId: WA_PHONE_NUMBER_ID, wabaId: WA_BUSINESS_ACCOUNT_ID, exportKey: '' };

/** The settings saved by the sender page, if any */
export function savedWaSettings(): WaSettings | undefined {
  try {
    const s = localStorage.getItem(WA_SETTINGS_KEY);
    return s ? { ...WA_EMPTY_SETTINGS, ...JSON.parse(s) } : undefined;
  } catch { return undefined; }
}

/** Errors that will fail every message the same way: stop instead of trying the rest */
export const FATAL = new Set([190, 10, 200, 100, 132000, 132001, 132015, 132016]);

/** GET, or POST of JSON or a form (a file upload) */
export async function graph<T>(path: string, token: string, body?: object | FormData): Promise<T> {
  const form = body instanceof FormData;
  const res = await fetch(`${GRAPH}/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${token}`, ...(body && !form ? { 'Content-Type': 'application/json' } : {}) },
    body: form ? body : body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(apiError(json, res.status)),
    { code: json?.error?.code as number | undefined, subcode: json?.error?.error_subcode as number | undefined });
  return json as T;
}

/** Uploads a file to Meta for one message and returns its media id. Meta deletes it after 30 days. */
export async function uploadMedia(s: WaSettings, file: File): Promise<string> {
  const form = new FormData();
  form.append('messaging_product', 'whatsapp');
  form.append('type', file.type);
  form.append('file', file, file.name);
  return (await graph<{ id: string }>(`${s.phoneNumberId}/media`, s.token, form)).id;
}

/** From the webhook Worker, with the export key: a path that holds phone numbers */
async function fromWorker(path: string, key: string): Promise<Response> {
  const res = await fetch(`${WA_STATUS_URL}${path}`, { headers: { Authorization: `Bearer ${key}` } });
  if (res.status === 403) throw new Error('Export key चुकीची आहे (Worker मधील EXPORT_KEY तपासा).');
  if (!res.ok) throw new Error(`Worker: HTTP ${res.status}`);
  return res;
}

/** Messages people sent to the trust's number in the last `days` days, as a CSV file */
export const incomingCsv = async (key: string, days: number) => (await fromWorker(`/incoming.csv?days=${days}`, key)).blob();

/** Numbers that wrote STOP: never message them */
export const optedOut = async (key: string): Promise<Set<string>> => new Set(await (await fromWorker('/optout', key)).json() as string[]);
