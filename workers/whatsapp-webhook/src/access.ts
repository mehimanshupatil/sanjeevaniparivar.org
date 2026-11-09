// Cloudflare Access signs each request it lets through to the inbox (Cf-Access-Jwt-Assertion, an
// RS256 JWT). The Worker checks that token itself, so the inbox stays closed even if the Access
// application is removed or misconfigured. No Worker APIs here (tested).

/** ACCESS_TEAM: the Zero Trust team name (<team>.cloudflareaccess.com); ACCESS_AUD: the application's AUD tag */
export interface AccessConfig { team: string; aud: string }
export interface Jwk extends JsonWebKey { kid?: string }
interface Claims { aud?: string | string[]; exp?: number; nbf?: number; iss?: string; email?: string }

const decode = (s: string) => {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '='));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

export function parseJwt(token: string) {
  const parts = token.split('.');
  if (parts.length !== 3) return undefined;
  try {
    const json = (s: string) => JSON.parse(new TextDecoder().decode(decode(s)));
    return {
      header: json(parts[0]) as { alg?: string; kid?: string },
      claims: json(parts[1]) as Claims,
      signed: new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
      signature: decode(parts[2]),
    };
  } catch { return undefined; }
}

/** Issued by our team, for this application, and not expired (a minute's leeway for clocks) */
export function claimsOk(c: Claims, cfg: AccessConfig, now: number): boolean {
  const aud = Array.isArray(c.aud) ? c.aud : [c.aud];
  return aud.includes(cfg.aud) && typeof c.exp === 'number' && c.exp > now && (c.nbf ?? 0) <= now + 60
    && c.iss === `https://${cfg.team}.cloudflareaccess.com`;
}

/**
 * The signed-in member's email, or undefined if the token is missing or not valid.
 * keys(refresh): the team's public keys (refresh: fetch again, when a key id isn't known yet).
 */
export async function verifyAccess(token: string | null, cfg: AccessConfig, keys: (refresh: boolean) => Promise<Jwk[]>, now: number): Promise<string | undefined> {
  if (!token || !cfg.team || !cfg.aud) return undefined;
  const jwt = parseJwt(token);
  if (!jwt || jwt.header.alg !== 'RS256' || !claimsOk(jwt.claims, cfg, now)) return undefined;
  const find = (list: Jwk[]) => list.find((k) => k.kid === jwt.header.kid);
  const jwk = find(await keys(false)) ?? find(await keys(true));
  if (!jwk) return undefined;
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, jwt.signature, jwt.signed);
  return ok && typeof jwt.claims.email === 'string' ? jwt.claims.email : undefined;
}

// ── Inbox rules ──

/** Meta allows a free-form reply only within 24 hours of the person's last message */
export const REPLY_WINDOW = 24 * 3600;
export const canReply = (lastIncoming: number | null | undefined, now: number) => Boolean(lastIncoming && now - lastIncoming < REPLY_WINDOW);

/** WhatsApp's limit for a text message */
export const MAX_REPLY = 4096;

/** A reply from the inbox page: { n: number, text }, or what is wrong with it */
export function replyInput(body: unknown): { n: string; text: string } | { error: string } {
  const b = body as { n?: unknown; text?: unknown };
  const n = typeof b?.n === 'string' ? b.n : '';
  const text = typeof b?.text === 'string' ? b.text.trim() : '';
  if (!/^\d{8,15}$/.test(n)) return { error: 'चुकीचा क्रमांक' };
  if (!text) return { error: 'संदेश रिकामा आहे' };
  if (text.length > MAX_REPLY) return { error: `संदेश ${MAX_REPLY} अक्षरांपेक्षा मोठा आहे` };
  return { n, text };
}
