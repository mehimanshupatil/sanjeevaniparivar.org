// WhatsApp webhook (Cloudflare Worker): Meta posts message statuses here, and the sender page
// (/publicity/whatsapp/) asks for them by message id (id, status, time and error only). Messages
// people send to this number are kept for 12 months and downloaded by trust members with the export
// key (/incoming.csv); STOP / START keep the list of numbers not to message (/optout). The number has
// no app, so each sender gets an auto-reply pointing to the trust's main number, once a day.
// On inbox.sanjeevaniparivar.org the same Worker serves the members' inbox (inbox.ts). Setup: ../README.md
import { hasKey, istTime, optOutIntent, parseIncoming, parseStatuses, statusIds, toCsv, validSignature } from './statuses.ts';
import { sendText as send, type Env } from './env.ts';
import { inbox } from './inbox.ts';
/** Sent as a free-form text: allowed (and free) within 24 hours of the person's message */
const AUTO_REPLY = 'नमस्कार! संजीवनी परिवाराला संदेश पाठवल्याबद्दल धन्यवाद. 🙏\n\n' +
  'हा क्रमांक कार्यक्रमांची माहिती पाठवण्यासाठी आहे; येथे लगेच उत्तर मिळणार नाही. ' +
  'कृपया खालील लिंकवरून आमच्या दुसऱ्या WhatsApp क्रमांकावर संदेश पाठवा. आमचे संदेश नको असल्यास STOP लिहा.\n\n' +
  'This number sends programme updates and is not answered right away. Please message us on our other number ' +
  '(write STOP to get no more messages):\nhttps://wa.me/918847771994';
const STOPPED = 'आपल्याला यापुढे संजीवनी परिवाराचे संदेश पाठवले जाणार नाहीत. पुन्हा हवे असल्यास START लिहा.\n\n' +
  'You will get no more messages from Sanjeevani Parivar. Write START to get them again.';
const STARTED = 'धन्यवाद! आपल्याला पुन्हा संजीवनी परिवाराच्या कार्यक्रमांचे संदेश मिळतील. 🙏\n\n' +
  'Thank you! You will get Sanjeevani Parivar\'s programme messages again.';

/** Statuses are only needed while someone watches a send */
const KEEP_DAYS = 30;
/** Incoming messages: 12 months, as the privacy policy says */
const KEEP_INCOMING_DAYS = 365;
// /status answers hold no personal data, and a message id is unguessable: any page may ask.
// /incoming.csv and /optout hold phone numbers: they need the export key in the Authorization header.
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization' };
const json = (data: unknown) => new Response(JSON.stringify(data), { headers: { ...CORS, 'Content-Type': 'application/json' } });

// Claims the auto-reply for a sender: changes 1 row only if none was sent in the last day
const CLAIM_REPLY = `INSERT INTO replied (sender, at) VALUES (?1, ?2)
  ON CONFLICT (sender) DO UPDATE SET at = excluded.at WHERE replied.at < ?2 - 86400`;

const sha256 = async (text: string) =>
  [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map((b) => b.toString(16).padStart(2, '0')).join('');

/** The Worker's own replies: logged, never thrown, so Meta's report is still answered 200 */
async function sendText(env: Env, phoneNumberId: string, to: string, body: string): Promise<void> {
  if (!env.ACCESS_TOKEN) return;
  await send(env, phoneNumberId, to, body, 'auto').catch((e) => console.error('reply failed', e));
}

async function autoReply(env: Env, phoneNumberId: string, to: string): Promise<void> {
  if (!env.ACCESS_TOKEN) return;
  const { meta } = await env.DB.prepare(CLAIM_REPLY).bind(await sha256(to), Math.floor(Date.now() / 1000)).run();
  if (meta.changes) await sendText(env, phoneNumberId, to, AUTO_REPLY);
}

const SAVE_INCOMING = 'INSERT OR IGNORE INTO incoming (id, sender, name, type, text, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)';
const forbidden = () => new Response('Forbidden', { status: 403, headers: CORS });

// Keep the furthest status: Meta may send "delivered" before "sent"
const UPSERT = `INSERT INTO statuses (id, status, rank, at, error) VALUES (?1, ?2, ?3, ?4, ?5)
  ON CONFLICT (id) DO UPDATE SET status = excluded.status, rank = excluded.rank, at = excluded.at, error = excluded.error
  WHERE excluded.rank > statuses.rank`;

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (url.hostname.startsWith('inbox.')) return inbox(req, env);

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
      for (const m of parseIncoming(body)) {
        await env.DB.prepare(SAVE_INCOMING).bind(m.id, m.from, m.name, m.type, m.text, m.at).run().catch((e) => console.error('save incoming', e));
        const intent = optOutIntent(m.text);
        const reply = intent === 'stop'
          ? env.DB.prepare('INSERT OR REPLACE INTO optout (sender, at) VALUES (?, ?)').bind(m.from, m.at).run().then(() => sendText(env, m.phoneNumberId, m.from, STOPPED))
          : intent === 'start'
            ? env.DB.prepare('DELETE FROM optout WHERE sender = ?').bind(m.from).run().then(() => sendText(env, m.phoneNumberId, m.from, STARTED))
            : autoReply(env, m.phoneNumberId, m.from);
        await reply.catch((e) => console.error('reply', e));
      }
      return new Response('OK');
    }

    if ((url.pathname === '/incoming.csv' || url.pathname === '/optout') && req.method === 'OPTIONS') return new Response(null, { headers: CORS });

    // Messages of the last ?days= days (default 30), newest first, with whether the sender asked to stop
    if (url.pathname === '/incoming.csv' && req.method === 'GET') {
      if (!hasKey(env.EXPORT_KEY, req.headers.get('Authorization'))) return forbidden();
      const days = Math.min(KEEP_INCOMING_DAYS, Math.max(1, Number(url.searchParams.get('days')) || 30));
      const { results } = await env.DB.prepare(`SELECT i.at, i.sender, i.name, i.type, i.text, o.sender IS NOT NULL AS stopped
        FROM incoming i LEFT JOIN optout o ON o.sender = i.sender WHERE i.at >= ? ORDER BY i.at DESC`)
        .bind(Math.floor(Date.now() / 1000) - days * 86400).all<{ at: number; sender: string; name: string; type: string; text: string; stopped: number }>();
      const rows = [['वेळ', 'WhatsApp क्रमांक', 'नाव', 'प्रकार', 'संदेश', 'STOP'],
        ...results.map((r) => [istTime(r.at), `+${r.sender}`, r.name, r.type, r.text, r.stopped ? 'STOP' : ''])];
      return new Response(toCsv(rows), { headers: { ...CORS, 'Content-Type': 'text/csv; charset=utf-8' } });
    }

    // Numbers not to message, for the sender page to leave out
    if (url.pathname === '/optout' && req.method === 'GET') {
      if (!hasKey(env.EXPORT_KEY, req.headers.get('Authorization'))) return forbidden();
      const { results } = await env.DB.prepare('SELECT sender FROM optout').all<{ sender: string }>();
      return json(results.map((r) => r.sender));
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
      env.DB.prepare('DELETE FROM incoming WHERE at < ?').bind(now - KEEP_INCOMING_DAYS * 86400),
      env.DB.prepare('DELETE FROM outgoing WHERE at < ?').bind(now - KEEP_INCOMING_DAYS * 86400),
    ]);
  },
};
