// WhatsApp webhook (Cloudflare Worker): Meta posts message statuses here, and the sender page
// (/publicity/whatsapp/) asks for them by message id. Stores only id, status, time and error:
// no phone numbers, no message text. Nobody reads messages sent to this number (it has no app),
// so each sender gets an auto-reply pointing to the trust's main number, once a day. Setup: ../README.md
import { parseIncoming, parseStatuses, statusIds, validSignature } from './statuses.ts';

// The few D1 types used, so the root type-check needs no Worker type package
interface D1Statement { bind(...values: unknown[]): D1Statement; all<T>(): Promise<{ results: T[] }>; run(): Promise<{ meta: { changes: number } }> }
interface D1Database { prepare(sql: string): D1Statement; batch(statements: D1Statement[]): Promise<unknown> }
interface Env { DB: D1Database; APP_SECRET: string; VERIFY_TOKEN: string; ACCESS_TOKEN: string }

const GRAPH = 'https://graph.facebook.com/v26.0';
/** Sent as a free-form text: allowed (and free) within 24 hours of the person's message */
const AUTO_REPLY = 'नमस्कार! संजीवनी परिवाराला संदेश पाठवल्याबद्दल धन्यवाद. 🙏\n\n' +
  'हा क्रमांक फक्त कार्यक्रमांची माहिती पाठवण्यासाठी (एकतर्फी संवाद) आहे; येथे आलेले संदेश आम्हाला दिसत नाहीत. ' +
  'कृपया खालील लिंकवरून आमच्या दुसऱ्या WhatsApp क्रमांकावर संदेश पाठवा.\n\n' +
  'This number only sends updates and cannot receive messages. Please message us on our other number:\n' +
  'https://wa.me/918847771994';

/** Statuses are only needed while someone watches a send */
const KEEP_DAYS = 30;
// Answers hold no personal data, and a message id is unguessable: any page may ask
const CORS = { 'Access-Control-Allow-Origin': '*' };
const json = (data: unknown) => new Response(JSON.stringify(data), { headers: { ...CORS, 'Content-Type': 'application/json' } });

// Claims the auto-reply for a sender: changes 1 row only if none was sent in the last day
const CLAIM_REPLY = `INSERT INTO replied (sender, at) VALUES (?1, ?2)
  ON CONFLICT (sender) DO UPDATE SET at = excluded.at WHERE replied.at < ?2 - 86400`;

const sha256 = async (text: string) =>
  [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map((b) => b.toString(16).padStart(2, '0')).join('');

async function autoReply(env: Env, phoneNumberId: string, to: string): Promise<void> {
  if (!env.ACCESS_TOKEN) return;
  const { meta } = await env.DB.prepare(CLAIM_REPLY).bind(await sha256(to), Math.floor(Date.now() / 1000)).run();
  if (!meta.changes) return;
  const res = await fetch(`${GRAPH}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: AUTO_REPLY, preview_url: false } }),
  });
  if (!res.ok) console.error('auto-reply failed', res.status, await res.text());
}

// Keep the furthest status: Meta may send "delivered" before "sent"
const UPSERT = `INSERT INTO statuses (id, status, rank, at, error) VALUES (?1, ?2, ?3, ?4, ?5)
  ON CONFLICT (id) DO UPDATE SET status = excluded.status, rank = excluded.rank, at = excluded.at, error = excluded.error
  WHERE excluded.rank > statuses.rank`;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    // Meta's one-time check when the callback URL is saved in the app
    if (url.pathname === '/webhook' && req.method === 'GET') {
      const p = url.searchParams;
      return p.get('hub.mode') === 'subscribe' && env.VERIFY_TOKEN && p.get('hub.verify_token') === env.VERIFY_TOKEN
        ? new Response(p.get('hub.challenge') ?? '')
        : new Response('Forbidden', { status: 403 });
    }

    if (url.pathname === '/webhook' && req.method === 'POST') {
      const raw = new Uint8Array(await req.arrayBuffer());
      if (!(await validSignature(env.APP_SECRET, raw, req.headers.get('X-Hub-Signature-256')))) {
        return new Response('Bad signature', { status: 401 });
      }
      let body: unknown;
      try { body = JSON.parse(new TextDecoder().decode(raw)); } catch { return new Response('Bad JSON', { status: 400 }); }
      const rows = parseStatuses(body);
      if (rows.length) await env.DB.batch(rows.map((r) => env.DB.prepare(UPSERT).bind(r.id, r.status, r.rank, r.at, r.error)));
      // Meta resends a report that isn't answered 200, so a failed reply must not fail the request
      for (const m of parseIncoming(body)) await autoReply(env, m.phoneNumberId, m.from).catch((e) => console.error('auto-reply', e));
      return new Response('OK');
    }

    if (url.pathname === '/status' && req.method === 'GET') {
      const ids = statusIds(url.searchParams.get('ids'));
      if (!ids.length) return json({});
      const { results } = await env.DB.prepare(`SELECT id, status, at, error FROM statuses WHERE id IN (${ids.map(() => '?').join(',')})`)
        .bind(...ids).all<{ id: string; status: string; at: number; error: string | null }>();
      return json(Object.fromEntries(results.map(({ id, ...rest }) => [id, rest])));
    }

    return new Response('Not found', { status: 404 });
  },

  async scheduled(_event: unknown, env: Env): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await env.DB.batch([
      env.DB.prepare('DELETE FROM statuses WHERE at < ?').bind(now - KEEP_DAYS * 86400),
      env.DB.prepare('DELETE FROM replied WHERE at < ?').bind(now - 86400),
    ]);
  },
};
