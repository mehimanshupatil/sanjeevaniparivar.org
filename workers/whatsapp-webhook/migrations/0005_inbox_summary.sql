-- Keeps the inbox cheap on D1's free plan (5 million rows read a day): the chat list reads one row
-- per person from `chats` instead of scanning every message, and the page polls `inbox_version`
-- (one row) and reloads only when it has changed.

-- One row per person: the newest message either way, kept up to date as messages come and go
CREATE TABLE chats (
  n TEXT PRIMARY KEY,        -- their WhatsApp number, country code first
  name TEXT NOT NULL,        -- their latest WhatsApp profile name, '' if never given
  last_at INTEGER NOT NULL,  -- newest message, Unix seconds
  last_text TEXT NOT NULL,
  last_type TEXT NOT NULL,   -- their message type, or 'out' for ours
  last_in INTEGER            -- their newest message (the 24-hour reply window), NULL if none
);
CREATE INDEX chats_last ON chats (last_at);

-- From the messages already kept
INSERT INTO chats (n, name, last_at, last_text, last_type, last_in)
SELECT m.n,
  COALESCE((SELECT name FROM incoming WHERE sender = m.n AND name != '' ORDER BY at DESC LIMIT 1), ''),
  m.at, m.text, m.type,
  (SELECT MAX(at) FROM incoming WHERE sender = m.n)
FROM (SELECT sender AS n, at, text, type FROM incoming UNION ALL SELECT recipient, at, text, 'out' FROM outgoing) m
WHERE m.at = (SELECT MAX(at) FROM (SELECT at FROM incoming WHERE sender = m.n UNION ALL SELECT at FROM outgoing WHERE recipient = m.n))
GROUP BY m.n;

-- Goes up by one whenever anything the inbox shows changes
CREATE TABLE inbox_version (
  k INTEGER PRIMARY KEY,
  v INTEGER NOT NULL
);
INSERT INTO inbox_version (k, v) VALUES (1, 0);
