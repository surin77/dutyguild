ALTER TABLE members
ADD COLUMN IF NOT EXISTS calendar_token TEXT;

UPDATE members
SET calendar_token = md5(
  COALESCE(id, '')
  || ':'
  || COALESCE(email, '')
  || ':'
  || random()::text
  || ':'
  || clock_timestamp()::text
)
WHERE calendar_token IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_members_calendar_token
ON members(calendar_token);

ALTER TABLE game_events
ADD COLUMN IF NOT EXISTS end_date DATE;

UPDATE game_events
SET end_date = event_date
WHERE end_date IS NULL;

ALTER TABLE game_events
ALTER COLUMN end_date SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_game_events_date_range
ON game_events(event_date, end_date);
