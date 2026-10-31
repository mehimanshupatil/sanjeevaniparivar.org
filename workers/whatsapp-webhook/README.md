# WhatsApp webhook (Cloudflare Worker)

Meta reports whether a WhatsApp message was delivered, read or failed only to a webhook. The site is static (GitHub Pages), so this small Worker receives the reports and the sender page (`/publicity/whatsapp/`) asks it for them after sending.

- `POST /webhook`: Meta's reports, checked with the app secret (`X-Hub-Signature-256`). Keeps message id, status, time and error only: no phone numbers, no message text.
- Messages people send to this number: nobody can read them (the number is API-only, no app), so the sender gets an auto-reply asking them to write to the trust's main WhatsApp number, +91 88477 71994. Once a day per person: only a SHA-256 hash of their number is kept, for a day. Text: `AUTO_REPLY` in `src/index.ts`. Needs the `ACCESS_TOKEN` secret; without it there's no reply.
- `GET /webhook`: Meta's one-time check when the callback URL is saved.
- `GET /status?ids=wamid.…,wamid.…`: the statuses of up to 100 messages, for the sender page.
- Every day at 03:00 UTC, statuses older than 30 days and auto-reply records older than a day are deleted.

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
5. Deploy: `pnpm dlx wrangler@4 deploy`. It prints the URL, `https://sp-whatsapp-webhook.<your-subdomain>.workers.dev`. Put it in `WA_STATUS_URL` in `src/lib/whatsapp.ts`.
6. In the Meta App Dashboard → WhatsApp → Configuration: Callback URL `<worker URL>/webhook`, Verify token = the `VERIFY_TOKEN` text → Verify and save. Then under Webhook fields, subscribe to **messages**.
7. Subscribe the app to the WhatsApp Business Account (Meta sends reports only for accounts the app is subscribed to):
   ```sh
   curl -X POST "https://graph.facebook.com/v26.0/2539900846429599/subscribed_apps" -H "Authorization: Bearer <access token>"
   ```
   The sender page's "तपासणी (debug)" then lists the app under "Apps subscribed to the account".

Send a template to your own number from `/publicity/whatsapp/`: the row should change from पाठवला to पोहोचला / वाचला within a minute.

## Upkeep

- Code changes: `pnpm dlx wrangler@4 deploy` from this folder. Logs: Cloudflare dashboard → Workers → sp-whatsapp-webhook → Logs.
- An expired or revoked access token stops the auto-reply (logged as `auto-reply failed 401`): set a new one with `secret put ACCESS_TOKEN`.
- A new app secret (after resetting it in Meta) must be set again with `secret put APP_SECRET`, or every report is refused with 401.
