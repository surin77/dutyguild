ALTER TABLE service_deeds
ADD COLUMN IF NOT EXISTS status TEXT;

ALTER TABLE service_deeds
ADD COLUMN IF NOT EXISTS approved_by_member_id TEXT REFERENCES members(id) ON DELETE SET NULL;

ALTER TABLE service_deeds
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

UPDATE service_deeds
SET
  status = COALESCE(status, 'approved'),
  approved_at = COALESCE(approved_at, corrected_at, created_at),
  approved_by_member_id = COALESCE(approved_by_member_id, corrected_by_member_id, created_by_member_id)
WHERE status IS NULL;

ALTER TABLE service_deeds
ALTER COLUMN status SET DEFAULT 'pending';

ALTER TABLE service_deeds
ALTER COLUMN status SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'service_deeds_status_check'
  ) THEN
    ALTER TABLE service_deeds
    ADD CONSTRAINT service_deeds_status_check
    CHECK (status IN ('pending', 'approved'));
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_service_deeds_status_created
ON service_deeds(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_deeds_approved_at
ON service_deeds(approved_at);
