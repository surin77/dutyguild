ALTER TABLE service_deeds
ADD COLUMN status TEXT;

ALTER TABLE service_deeds
ADD COLUMN approved_by_member_id TEXT REFERENCES members(id) ON DELETE SET NULL;

ALTER TABLE service_deeds
ADD COLUMN approved_at TEXT;

UPDATE service_deeds
SET
  status = COALESCE(status, 'approved'),
  approved_at = COALESCE(approved_at, corrected_at, created_at),
  approved_by_member_id = COALESCE(approved_by_member_id, corrected_by_member_id, created_by_member_id)
WHERE status IS NULL;

CREATE INDEX IF NOT EXISTS idx_service_deeds_status_created
ON service_deeds(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_deeds_approved_at
ON service_deeds(approved_at);
