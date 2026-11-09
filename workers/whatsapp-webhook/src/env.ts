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
    await env.DB.prepare('INSERT OR IGNORE INTO outgoing (id, recipient, text, by, at) VALUES (?, ?, ?, ?, ?)')
      .bind(id, to, body, by, Math.floor(Date.now() / 1000)).run();
  }
  return id;
}
