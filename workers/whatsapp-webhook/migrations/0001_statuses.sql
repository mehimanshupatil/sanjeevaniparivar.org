-- One row per WhatsApp message sent from /publicity/whatsapp/: its furthest status so far.
-- No phone numbers or message text. Rows older than 30 days are deleted daily.
CREATE TABLE statuses (
  id TEXT PRIMARY KEY,      -- wamid.… returned when the message was sent
  status TEXT NOT NULL,     -- sent | delivered | read | failed
  rank INTEGER NOT NULL,    -- 1–4, so a late "sent" doesn't overwrite "read"
  at INTEGER NOT NULL,      -- Meta's timestamp, Unix seconds
  error TEXT                -- "#131049 — title — details" when failed
);
CREATE INDEX statuses_at ON statuses (at);
