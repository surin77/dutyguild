CREATE TABLE IF NOT EXISTS service_deeds (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL,
  deed_type TEXT NOT NULL CHECK (deed_type IN ('trash', 'dust', 'order')),
  reported_quantity INTEGER NOT NULL CHECK (reported_quantity >= 1),
  effective_quantity INTEGER NOT NULL CHECK (effective_quantity >= 1),
  notes TEXT,
  correction_note TEXT,
  created_by_member_id TEXT NOT NULL,
  corrected_by_member_id TEXT,
  corrected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (corrected_by_member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_service_deeds_member_created
ON service_deeds(member_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_deeds_type_created
ON service_deeds(deed_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_deeds_corrected_at
ON service_deeds(corrected_at);
