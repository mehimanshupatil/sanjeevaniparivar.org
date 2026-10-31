// WhatsApp webhook (Cloudflare Worker): Meta posts message statuses here, and the sender page
// (/publicity/whatsapp/) asks for them by message id. Stores only id, status, time and error:
// no phone numbers, no message text; incoming messages are ignored. Setup: ../README.md
import { parseStatuses, statusIds, validSignature } from './statuses.ts';

// The few D1 types used, so the root type-check needs no Worker type package
interface D1Statement { bind(...values: unknown[]): D1Statement; all<T>(): Promise<{ results: T[] }>; run(): Promise<unknown> }
interface D1Database { prepare(sql: string): D1Statement; batch(statements: D1Statement[]): Promise<unknown> }
interface Env { DB: D1Database; APP_SECRET: string; VERIFY_TOKEN: string }

/** Statuses are only needed while someone watches a send */
const KEEP_DAYS = 30;
// Answers hold no personal data, and a message id is unguessable: any page may ask
const CORS = { 'Access-Control-Allow-Origin': '*' };
const json = (data: unknown) => new Response(JSON.stringify(data), { headers: { ...CORS, 'Content-Type': 'application/json' } });

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
    await env.DB.prepare('DELETE FROM statuses WHERE at < ?').bind(Math.floor(Date.now() / 1000) - KEEP_DAYS * 86400).run();
  },
};
