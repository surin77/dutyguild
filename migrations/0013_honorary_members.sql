ALTER TABLE members ADD COLUMN membership_kind TEXT NOT NULL DEFAULT 'full';
ALTER TABLE members ADD COLUMN can_join_ritual_rotation INTEGER NOT NULL DEFAULT 1;
ALTER TABLE members ADD COLUMN can_log_deeds INTEGER NOT NULL DEFAULT 1;

UPDATE members
SET membership_kind = 'full'
WHERE membership_kind IS NULL
   OR membership_kind NOT IN ('full', 'honorary');

UPDATE members
SET can_join_ritual_rotation = CASE
      WHEN membership_kind = 'honorary' THEN 0
      ELSE COALESCE(can_join_ritual_rotation, 1)
    END,
    can_log_deeds = CASE
      WHEN membership_kind = 'honorary' THEN 0
      ELSE COALESCE(can_log_deeds, 1)
    END;

CREATE INDEX IF NOT EXISTS idx_members_membership_kind
ON members(membership_kind);

CREATE INDEX IF NOT EXISTS idx_members_ritual_rotation
ON members(status, membership_kind, can_join_ritual_rotation);

CREATE INDEX IF NOT EXISTS idx_members_deed_participation
ON members(status, membership_kind, can_log_deeds);
