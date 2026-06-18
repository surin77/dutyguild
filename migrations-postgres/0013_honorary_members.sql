ALTER TABLE members
ADD COLUMN IF NOT EXISTS membership_kind TEXT NOT NULL DEFAULT 'full';

ALTER TABLE members
ADD COLUMN IF NOT EXISTS can_join_ritual_rotation BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE members
ADD COLUMN IF NOT EXISTS can_log_deeds BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE members
SET membership_kind = 'full'
WHERE membership_kind IS NULL
   OR membership_kind NOT IN ('full', 'honorary');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'members_membership_kind_check'
  ) THEN
    ALTER TABLE members
    ADD CONSTRAINT members_membership_kind_check
    CHECK (membership_kind IN ('full', 'honorary'));
  END IF;
END $$;

UPDATE members
SET can_join_ritual_rotation = CASE
      WHEN membership_kind = 'honorary' THEN FALSE
      ELSE COALESCE(can_join_ritual_rotation, TRUE)
    END,
    can_log_deeds = CASE
      WHEN membership_kind = 'honorary' THEN FALSE
      ELSE COALESCE(can_log_deeds, TRUE)
    END;

CREATE INDEX IF NOT EXISTS idx_members_membership_kind
ON members(membership_kind);

CREATE INDEX IF NOT EXISTS idx_members_ritual_rotation
ON members(status, membership_kind, can_join_ritual_rotation);

CREATE INDEX IF NOT EXISTS idx_members_deed_participation
ON members(status, membership_kind, can_log_deeds);
