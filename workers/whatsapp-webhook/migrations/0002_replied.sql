-- Who got the auto-reply in the last day, so someone writing several messages gets it once.
-- Only a SHA-256 hash of the number, never the number itself. Rows older than a day are deleted daily.
CREATE TABLE replied (
  sender TEXT PRIMARY KEY,  -- hex SHA-256 of the sender's WhatsApp number
  at INTEGER NOT NULL       -- when the auto-reply was sent, Unix seconds
);
