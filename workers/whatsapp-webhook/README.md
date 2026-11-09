# WhatsApp webhook (Cloudflare Worker)

Meta reports whether a WhatsApp message was delivered, read or failed, and the messages people send to the number, only to a webhook. The site is static (GitHub Pages), so this small Worker receives them; the sender page (`/publicity/whatsapp/`) asks it for delivery after sending, for the STOP list, and for a CSV of incoming messages.

- `POST /webhook`: Meta's reports, checked with the app secret (`X-Hub-Signature-256`). Keeps message id, status, time and error only: no phone numbers, no message text.
- Messages people send to this number are saved (number, profile name, type, first 500 characters, time) for 12 months, as the privacy policy says. Members answer them from the inbox (below); the sender first gets an acknowledgement ("you will get a reply soon; write STOP to get no more messages"), once a day per person (only a SHA-256 hash of their number is kept for that, for a day). Text: `AUTO_REPLY` in `src/index.ts`. Needs the `ACCESS_TOKEN` secret; without it there's no reply.
- STOP: a message that is only "STOP", "थांबवा", "बंद करा", "नको", "unsubscribe" or the "Stop promotions" button puts the number on the `optout` list and gets a confirmation; "START" / "सुरू करा" takes it off. The sender page leaves these numbers out.
- `GET /incoming.csv?days=30`: the saved messages of the last 1–365 days, newest first, with a STOP column. `GET /optout`: the STOP list as JSON. Both hold phone numbers, so both need `Authorization: Bearer <EXPORT_KEY>`; the sender page sends it when the key is saved there.
- `GET /webhook`: Meta's one-time check when the callback URL is saved.
- `GET /status?ids=wamid.…,wamid.…`: the statuses of up to 100 messages, for the sender page.
- Every day at 03:00 UTC, statuses older than 30 days, auto-reply records older than a day and messages older than 12 months are deleted. The STOP list is kept until the person writes START.

- `inbox.sanjeevaniparivar.org`: the members' inbox, like WhatsApp Web: conversations, unread counts, ticks, replies (text, within 24 hours of the person's last message, as Meta allows). Members sign in with their email through Cloudflare Access; the Worker checks Access's signed token itself (`src/access.ts`) and refuses everything without it, so the inbox stays closed even if Access is switched off. Members never see the Meta token. Each reply records who sent it. Page: `src/inbox.html`; routes: `src/inbox.ts`. To stay within D1's free 5 million rows read a day, the page polls a one-row change counter (`inbox_version`) every 15 s and reloads only when it changes, and the chat list reads one row per person from `chats`.

Storage is D1 (free: 100,000 writes a day; each message makes up to 3). Workers KV's free tier allows only 1,000 writes a day.

Pure logic and tests: `src/statuses.ts` (run by `pnpm test` at the repo root).

## Setup (once)

Run in this folder (`workers/whatsapp-webhook/`). Needs a free Cloudflare account.

1. Log in: `pnpm dlx wrangler@4 login`
2. Create the database: `pnpm dlx wrangler@4 d1 create sp-whatsapp`, and put the printed `database_id` in `wrangler.jsonc`.
3. Create the tables: `pnpm dlx wrangler@4 d1 migrations apply sp-whatsapp --remote`
4. Secrets:
   - `pnpm dlx wrangler@4 secret put APP_SECRET`: the Meta app's App secret (App Dashboard → App settings → Basic).
   - `pnpm dlx wrangler@4 secret put VERIFY_TOKEN`: any long random text you choose; you type the same text in Meta in step 6.
   - `pnpm dlx wrangler@4 secret put ACCESS_TOKEN`: a System User access token with `whatsapp_business_messaging`, for the auto-reply. Use one that doesn't expire (System user → Generate token → Expiration: Never), or the auto-reply stops when it does.
   - `pnpm dlx wrangler@4 secret put EXPORT_KEY`: a long random text (e.g. `openssl rand -base64 32`), for downloading incoming messages and the STOP list. Type the same text in "Export key" on the sender page. Change it any time with `secret put` again; the old one stops working at once.
5. Deploy: `pnpm dlx wrangler@4 deploy`. It prints the URL, `https://sp-whatsapp-webhook.<your-subdomain>.workers.dev`. Put it in `WA_STATUS_URL` in `src/lib/whatsapp.ts`.
6. In the Meta App Dashboard → WhatsApp → Configuration: Callback URL `<worker URL>/webhook`, Verify token = the `VERIFY_TOKEN` text → Verify and save. Then under Webhook fields, subscribe to **messages**.
7. Subscribe the app to the WhatsApp Business Account (Meta sends reports only for accounts the app is subscribed to):
   ```sh
   curl -X POST "https://graph.facebook.com/v26.0/2539900846429599/subscribed_apps" -H "Authorization: Bearer <access token>"
   ```
   The sender page's "तपासणी (debug)" then lists the app under "Apps subscribed to the account".

Send a template to your own number from `/publicity/whatsapp/`: the row should change from पाठवला to पोहोचला / वाचला within a minute.

Secrets can't be read back from Cloudflare: keep a copy in the trust's password manager. For `wrangler dev`, put them in `.dev.vars` in this folder (ignored by git).

## Inbox setup (once)

1. Tables: `pnpm dlx wrangler@4 d1 migrations apply sp-whatsapp --remote`
2. Cloudflare dashboard → Zero Trust. Pick a team name (it becomes `<team>.cloudflareaccess.com`) and the Free plan (up to 50 members).
3. Zero Trust → Access → Applications → Add an application → Self-hosted:
   - Application domain: `inbox.sanjeevaniparivar.org`; session duration e.g. 1 month.
   - Policy: name "Members", Action **Allow**, Include → **Emails**: each member's email.
   - Login method: One-time PIN (the default): members get a code by email.
4. Copy the application's **AUD tag** (Overview → Application Audience). In `wrangler.jsonc` → `vars`, set `ACCESS_TEAM` to the team name and `ACCESS_AUD` to the tag (neither is secret), then `pnpm dlx wrangler@4 deploy`. The deploy also creates the `inbox` DNS record.
5. Open https://inbox.sanjeevaniparivar.org, sign in with your email and the code. Phone: browser menu → Add to Home screen.

Add or remove members in the policy's email list (step 3); no deploy needed. With `ACCESS_TEAM` / `ACCESS_AUD` empty the inbox answers 503.

## Upkeep

- New tables (a new file in `migrations/`): `pnpm dlx wrangler@4 d1 migrations apply sp-whatsapp --remote` before deploying.

- Code changes: `pnpm dlx wrangler@4 deploy` from this folder. Logs: Cloudflare dashboard → Workers → sp-whatsapp-webhook → Logs.
- An expired or revoked access token stops the auto-reply (logged as `auto-reply failed 401`): set a new one with `secret put ACCESS_TOKEN`.
- A new app secret (after resetting it in Meta) must be set again with `secret put APP_SECRET`, or every report is refused with 401.
