ALTER TABLE game_events
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

ALTER TABLE game_events
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ;

UPDATE game_events
SET updated_at = COALESCE(updated_at, created_at)
WHERE updated_at IS NULL;

ALTER TABLE game_events
ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE game_events
ALTER COLUMN updated_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_game_events_status_date_range
ON game_events(status, event_date, end_date);

CREATE INDEX IF NOT EXISTS idx_game_events_cancelled_at
ON game_events(cancelled_at);
