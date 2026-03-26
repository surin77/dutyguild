PRAGMA foreign_keys = OFF;

CREATE TABLE IF NOT EXISTS service_deeds_new (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  deed_type TEXT NOT NULL CHECK (deed_type IN ('trash', 'dust', 'order', 'altars', 'vessels', 'water', 'coffee', 'stores')),
  reported_quantity INTEGER NOT NULL CHECK (reported_quantity >= 1),
  effective_quantity INTEGER NOT NULL CHECK (effective_quantity >= 1),
  status TEXT DEFAULT 'pending',
  notes TEXT,
  correction_note TEXT,
  created_by_member_id TEXT NOT NULL,
  corrected_by_member_id TEXT,
  approved_by_member_id TEXT,
  corrected_at TEXT,
  approved_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (corrected_by_member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (approved_by_member_id) REFERENCES members(id) ON DELETE SET NULL
);

INSERT INTO service_deeds_new (
  id,
  member_id,
  deed_type,
  reported_quantity,
  effective_quantity,
  status,
  notes,
  correction_note,
  created_by_member_id,
  corrected_by_member_id,
  approved_by_member_id,
  corrected_at,
  approved_at,
  created_at,
  updated_at
)
SELECT
  id,
  member_id,
  deed_type,
  reported_quantity,
  effective_quantity,
  COALESCE(status, 'approved'),
  notes,
  correction_note,
  created_by_member_id,
  corrected_by_member_id,
  approved_by_member_id,
  corrected_at,
  approved_at,
  created_at,
  updated_at
FROM service_deeds;

DROP TABLE service_deeds;
ALTER TABLE service_deeds_new RENAME TO service_deeds;

CREATE INDEX IF NOT EXISTS idx_service_deeds_member_created
ON service_deeds(member_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_deeds_type_created
ON service_deeds(deed_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_deeds_corrected_at
ON service_deeds(corrected_at);

CREATE INDEX IF NOT EXISTS idx_service_deeds_status_created
ON service_deeds(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_deeds_approved_at
ON service_deeds(approved_at);

PRAGMA foreign_keys = ON;
