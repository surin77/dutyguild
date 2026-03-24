ALTER TABLE cleaning_cycles ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE cleaning_cycles ADD COLUMN IF NOT EXISTS feedback_requested_at TIMESTAMPTZ;

ALTER TABLE cycle_assignments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS cycle_reviews (
  id TEXT PRIMARY KEY,
  cycle_id TEXT NOT NULL,
  author_member_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cycle_id, author_member_id),
  FOREIGN KEY (cycle_id) REFERENCES cleaning_cycles(id) ON DELETE CASCADE,
  FOREIGN KEY (author_member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cycle_reviews_cycle ON cycle_reviews(cycle_id);

UPDATE cleaning_cycles
SET completed_at = COALESCE(completed_at, created_at)
WHERE status = 'completed' AND completed_at IS NULL;

UPDATE members
SET duty_count = COALESCE((
  SELECT COUNT(*)
  FROM cycle_assignments a
  JOIN cleaning_cycles c ON c.id = a.cycle_id
  WHERE a.member_id = members.id
    AND c.status = 'completed'
), 0);
