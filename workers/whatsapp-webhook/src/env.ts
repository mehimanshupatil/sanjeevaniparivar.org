// The Worker's bindings, and the few D1 types used, so the root type-check needs no Worker type package

export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T>(): Promise<{ results: T[] }>;
  first<T>(): Promise<T | null>;
  run(): Promise<{ meta: { changes: number } }>;
}
export interface D1Database { prepare(sql: string): D1Statement; batch(statements: D1Statement[]): Promise<unknown> }

export interface Env {
  DB: D1Database;
  APP_SECRET: string;
  VERIFY_TOKEN: string;
  ACCESS_TOKEN: string;
  EXPORT_KEY: string;
  /** The trust's sending number (vars in wrangler.jsonc) */
  PHONE_NUMBER_ID: string;
  /** Cloudflare Access for the inbox (vars in wrangler.jsonc): team name and application AUD tag */
  ACCESS_TEAM: string;
  ACCESS_AUD: string;
}

export const GRAPH = 'https://graph.facebook.com/v26.0';

/** Bumps the inbox's change counter: the page reloads only when it has changed */
export const BUMP = 'UPDATE inbox_version SET v = v + 1 WHERE k = 1';

// The chat list's row for a person; only a newer message replaces the last one shown
const NEWER = (col: string) => `${col} = CASE WHEN excluded.last_at >= chats.last_at THEN excluded.${col} ELSE chats.${col} END`;
const CHAT_IN = `INSERT INTO chats (n, name, last_at, last_text, last_type, last_in) VALUES (?1, ?2, ?3, ?4, ?5, ?3)
  ON CONFLICT (n) DO UPDATE SET name = CASE WHEN excluded.name != '' THEN excluded.name ELSE chats.name END,
  last_in = MAX(COALESCE(chats.last_in, 0), excluded.last_in), ${NEWER('last_text')}, ${NEWER('last_type')}, last_at = MAX(chats.last_at, excluded.last_at)`;
const CHAT_OUT = `INSERT INTO chats (n, name, last_at, last_text, last_type, last_in) VALUES (?1, '', ?2, ?3, 'out', NULL)
  ON CONFLICT (n) DO UPDATE SET ${NEWER('last_text')}, ${NEWER('last_type')}, last_at = MAX(chats.last_at, excluded.last_at)`;

/** Keeps a message someone sent (once, even if Meta sends it twice), with its chat row */
export async function saveIncoming(env: Env, m: { id: string; from: string; name: string; type: string; text: string; at: number }): Promise<void> {
  const { meta } = await env.DB.prepare('INSERT OR IGNORE INTO incoming (id, sender, name, type, text, at) VALUES (?1, ?2, ?3, ?4, ?5, ?6)')
    .bind(m.id, m.from, m.name, m.type, m.text, m.at).run();
  if (meta.changes) await env.DB.batch([env.DB.prepare(CHAT_IN).bind(m.from, m.name, m.at, m.text, m.type), env.DB.prepare(BUMP)]);
}

/**
 * Sends a free-form text (allowed within 24 hours of the person's message) and keeps it in
 * `outgoing`, so the inbox shows it. by: the member's email, or 'auto'. Throws Meta's error.
 */
export async function sendText(env: Env, phoneNumberId: string, to: string, body: string, by: string): Promise<string> {
  const res = await fetch(`${GRAPH}/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body, preview_url: false } }),
  });
  const json = await res.json().catch(() => ({})) as { messages?: { id: string }[]; error?: { message?: string; code?: number } };
  if (!res.ok) throw new Error(json.error ? `#${json.error.code} ${json.error.message}` : `HTTP ${res.status}`);
  const id = json.messages?.[0]?.id ?? '';
  if (id) {
    const at = Math.floor(Date.now() / 1000);
    await env.DB.batch([
      env.DB.prepare('INSERT OR IGNORE INTO outgoing (id, recipient, text, by, at) VALUES (?, ?, ?, ?, ?)').bind(id, to, body, by, at),
      env.DB.prepare(CHAT_OUT).bind(to, at, body),
      env.DB.prepare(BUMP),
    ]);
  }
  return id;
}
