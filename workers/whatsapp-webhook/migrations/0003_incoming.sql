-- Messages people send to the trust's API number, so trust members can read them
-- (GET /incoming.csv with the export key). Rows older than 12 months are deleted daily,
-- as the privacy policy (/privacy) says.
CREATE TABLE incoming (
  id TEXT PRIMARY KEY,      -- wamid.… of their message (Meta may send it twice)
  sender TEXT NOT NULL,     -- their WhatsApp number, country code first
  name TEXT NOT NULL,       -- their WhatsApp profile name, '' if not given
  type TEXT NOT NULL,       -- text | image | button | …
  text TEXT NOT NULL,       -- what they wrote (or a caption / the button tapped), at most 500 characters
  at INTEGER NOT NULL       -- Meta's timestamp, Unix seconds
);
CREATE INDEX incoming_at ON incoming (at);

-- Numbers that asked for no more messages (STOP, थांबवा, "Stop promotions"); removed when they
-- write START. Kept until then, so they are never messaged again by mistake.
CREATE TABLE optout (
  sender TEXT PRIMARY KEY,  -- their WhatsApp number, country code first
  at INTEGER NOT NULL       -- when they asked, Unix seconds
);
