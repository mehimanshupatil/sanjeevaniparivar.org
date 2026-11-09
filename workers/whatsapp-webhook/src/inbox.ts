// The inbox at inbox.sanjeevaniparivar.org: trust members read the messages people send to the
// trust's number and reply, like WhatsApp Web. Cloudflare Access asks each member to sign in with
// their email; every request is checked here too (access.ts). Members never see the Meta token.
import pageModule from './inbox.html';
import { canReply, replyInput, verifyAccess, type Jwk } from './access.ts';
import { GRAPH, sendText, type Env } from './env.ts';

// wrangler.jsonc bundles .html as text (rules: Text); the root type-check knows .html only as Astro's
const page = pageModule as unknown as string;

/** The team's public keys, kept for an hour */
let certs: { keys: Jwk[]; at: number } | undefined;
const accessKeys = (team: string) => async (refresh: boolean): Promise<Jwk[]> => {
  if (!refresh && certs && Date.now() - certs.at < 3_600_000) return certs.keys;
  const res = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  certs = { keys: res.ok ? ((await res.json()) as { keys: Jwk[] }).keys : [], at: Date.now() };
  return certs.keys;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const CHATS = `WITH msgs AS (
    SELECT sender AS n, at, text, type FROM incoming
    UNION ALL SELECT recipient AS n, at, text, 'out' AS type FROM outgoing
  )
  SELECT n,
    (SELECT name FROM incoming WHERE sender = msgs.n AND name != '' ORDER BY at DESC LIMIT 1) AS name,
    MAX(at) AS lastAt,
    (SELECT m.text FROM msgs m WHERE m.n = msgs.n ORDER BY m.at DESC LIMIT 1) AS lastText,
    (SELECT m.type FROM msgs m WHERE m.n = msgs.n ORDER BY m.at DESC LIMIT 1) AS lastType,
    (SELECT MAX(at) FROM incoming WHERE sender = msgs.n) AS lastIn,
    (SELECT COUNT(*) FROM incoming i WHERE i.sender = msgs.n AND i.at > COALESCE((SELECT at FROM seen WHERE sender = msgs.n), 0)) AS unread,
    EXISTS (SELECT 1 FROM optout WHERE sender = msgs.n) AS stopped
  FROM msgs GROUP BY n ORDER BY lastAt DESC LIMIT 300`;

const THREAD = `SELECT * FROM (
    SELECT id, 'in' AS dir, type, text, at, NULL AS status, NULL AS by FROM incoming WHERE sender = ?1
    UNION ALL
    SELECT o.id, 'out', 'text', o.text, o.at, s.status, o.by FROM outgoing o LEFT JOIN statuses s ON s.id = o.id WHERE o.recipient = ?1
  ) ORDER BY at DESC LIMIT 300`;

export async function inbox(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  if (!env.ACCESS_TEAM || !env.ACCESS_AUD) return new Response('Inbox not set up: ACCESS_TEAM and ACCESS_AUD (workers/whatsapp-webhook/README.md)', { status: 503 });
  const email = await verifyAccess(req.headers.get('Cf-Access-Jwt-Assertion'), { team: env.ACCESS_TEAM, aud: env.ACCESS_AUD },
    accessKeys(env.ACCESS_TEAM), Math.floor(Date.now() / 1000));
  if (!email) return new Response('Forbidden: sign in through Cloudflare Access', { status: 403 });

  if (url.pathname === '/' && req.method === 'GET') {
    return new Response(page, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });
  }

  if (url.pathname === '/api/chats' && req.method === 'GET') {
    const { results } = await env.DB.prepare(CHATS).all();
    return json({ me: email, chats: results });
  }

  if (url.pathname === '/api/chat' && req.method === 'GET') {
    const n = url.searchParams.get('n') ?? '';
    if (!/^\d{8,15}$/.test(n)) return json({ error: 'चुकीचा क्रमांक' }, 400);
    const [{ results }, last, stop] = await Promise.all([
      env.DB.prepare(THREAD).bind(n).all(),
      env.DB.prepare('SELECT MAX(at) AS at FROM incoming WHERE sender = ?').bind(n).first<{ at: number | null }>(),
      env.DB.prepare('SELECT 1 AS x FROM optout WHERE sender = ?').bind(n).first(),
    ]);
    return json({ messages: results.reverse(), canReply: canReply(last?.at, Math.floor(Date.now() / 1000)), stopped: Boolean(stop) });
  }

  // Changes data: only from the inbox page itself
  if (req.method === 'POST' && req.headers.get('Origin') !== url.origin) return json({ error: 'Forbidden' }, 403);

  // Opened a chat: mark it read here, and show blue ticks to the person
  if (url.pathname === '/api/read' && req.method === 'POST') {
    const n = String(((await req.json().catch(() => ({}))) as { n?: unknown }).n ?? '');
    const last = await env.DB.prepare('SELECT id, at FROM incoming WHERE sender = ? ORDER BY at DESC LIMIT 1').bind(n).first<{ id: string; at: number }>();
    if (!last) return json({});
    const { meta } = await env.DB.prepare('INSERT INTO seen (sender, at) VALUES (?1, ?2) ON CONFLICT (sender) DO UPDATE SET at = excluded.at WHERE seen.at < excluded.at')
      .bind(n, last.at).run();
    if (meta.changes && env.ACCESS_TOKEN) {
      await fetch(`${GRAPH}/${env.PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaging_product: 'whatsapp', status: 'read', message_id: last.id }),
      }).catch(() => undefined);
    }
    return json({});
  }

  if (url.pathname === '/api/send' && req.method === 'POST') {
    const input = replyInput(await req.json().catch(() => null));
    if ('error' in input) return json(input, 400);
    const last = await env.DB.prepare('SELECT MAX(at) AS at FROM incoming WHERE sender = ?').bind(input.n).first<{ at: number | null }>();
    if (!canReply(last?.at, Math.floor(Date.now() / 1000))) return json({ error: '२४ तास संपले: आता फक्त मंजूर साचा (template) पाठवता येतो.' }, 400);
    try {
      return json({ id: await sendText(env, env.PHONE_NUMBER_ID, input.n, input.text, email) });
    } catch (e) {
      return json({ error: (e as Error).message }, 502);
    }
  }

  return new Response('Not found', { status: 404 });
}
