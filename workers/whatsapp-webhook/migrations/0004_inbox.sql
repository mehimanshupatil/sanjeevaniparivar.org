-- Our messages to people who wrote to the number: replies from the inbox (inbox.sanjeevaniparivar.org)
-- and the Worker's own auto-replies, so a conversation shows both sides. Ticks come from `statuses`.
-- Rows older than 12 months are deleted daily, like `incoming`.
CREATE TABLE outgoing (
  id TEXT PRIMARY KEY,      -- wamid.… returned by Meta
  recipient TEXT NOT NULL,  -- their WhatsApp number, country code first
  text TEXT NOT NULL,
  by TEXT NOT NULL,         -- the member's email, or 'auto' for the Worker's replies
  at INTEGER NOT NULL       -- when sent, Unix seconds
);
CREATE INDEX outgoing_recipient ON outgoing (recipient, at);
CREATE INDEX incoming_sender ON incoming (sender, at);

-- The newest incoming message a member has opened, per person: what is unread
CREATE TABLE seen (
  sender TEXT PRIMARY KEY,
  at INTEGER NOT NULL
);
