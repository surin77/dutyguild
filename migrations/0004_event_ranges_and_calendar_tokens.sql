ALTER TABLE members
ADD COLUMN calendar_token TEXT;

UPDATE members
SET calendar_token = lower(hex(randomblob(24)))
WHERE calendar_token IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_members_calendar_token
ON members(calendar_token);

ALTER TABLE game_events
ADD COLUMN end_date TEXT;

UPDATE game_events
SET end_date = event_date
WHERE end_date IS NULL;

CREATE INDEX IF NOT EXISTS idx_game_events_date_range
ON game_events(event_date, end_date);
