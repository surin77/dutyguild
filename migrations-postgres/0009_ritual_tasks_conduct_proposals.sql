ALTER TABLE cleaning_cycles
ADD COLUMN IF NOT EXISTS exact_ritual_date DATE;

ALTER TABLE cleaning_cycles
ADD COLUMN IF NOT EXISTS exact_ritual_starts_at TIME;

ALTER TABLE cleaning_cycles
ADD COLUMN IF NOT EXISTS ritual_set_by_member_id TEXT REFERENCES members(id) ON DELETE SET NULL;

ALTER TABLE cleaning_cycles
ADD COLUMN IF NOT EXISTS ritual_set_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_cleaning_cycles_exact_ritual
ON cleaning_cycles(exact_ritual_date, exact_ritual_starts_at);

CREATE TABLE IF NOT EXISTS order_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  task_type TEXT NOT NULL DEFAULT 'general' CHECK (task_type IN ('general', 'proposal')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed_pending', 'approved', 'order_review', 'closed', 'cancelled')),
  created_by_member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  assigned_to_member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  source_proposal_id TEXT,
  completion_note TEXT,
  council_note TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  completed_by_member_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  approved_by_member_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  order_review_requested_by_member_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  order_review_requested_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_order_tasks_status_created
ON order_tasks(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_tasks_assignee_status
ON order_tasks(assigned_to_member_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_tasks_type_status
ON order_tasks(task_type, status, created_at DESC);

CREATE TABLE IF NOT EXISTS conduct_marks (
  id TEXT PRIMARY KEY,
  subject_member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  author_member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('strike', 'praise')),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by_member_id TEXT REFERENCES members(id) ON DELETE SET NULL,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_conduct_marks_subject_status
ON conduct_marks(subject_member_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conduct_marks_status_created
ON conduct_marks(status, created_at DESC);

CREATE TABLE IF NOT EXISTS improvement_proposals (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'voting' CHECK (status IN ('voting', 'approved', 'rejected', 'implementation', 'order_review', 'closed')),
  author_member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  linked_task_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  order_review_requested_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_improvement_proposals_status_created
ON improvement_proposals(status, created_at DESC);

CREATE TABLE IF NOT EXISTS proposal_votes (
  id TEXT PRIMARY KEY,
  proposal_id TEXT NOT NULL REFERENCES improvement_proposals(id) ON DELETE CASCADE,
  phase TEXT NOT NULL CHECK (phase IN ('proposal', 'completion')),
  voter_member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (proposal_id, phase, voter_member_id)
);

CREATE INDEX IF NOT EXISTS idx_proposal_votes_phase
ON proposal_votes(proposal_id, phase, created_at DESC);
