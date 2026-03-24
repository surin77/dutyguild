ALTER TABLE game_events
ADD COLUMN updated_at TEXT;

ALTER TABLE game_events
ADD COLUMN cancelled_at TEXT;

UPDATE game_events
SET updated_at = COALESCE(updated_at, created_at)
WHERE updated_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_game_events_status_date_range
ON game_events(status, event_date, COALESCE(end_date, event_date));

CREATE INDEX IF NOT EXISTS idx_game_events_cancelled_at
ON game_events(cancelled_at);
