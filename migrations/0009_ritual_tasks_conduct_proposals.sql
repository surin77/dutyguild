ALTER TABLE cleaning_cycles ADD COLUMN exact_ritual_date TEXT;
ALTER TABLE cleaning_cycles ADD COLUMN exact_ritual_starts_at TEXT;
ALTER TABLE cleaning_cycles ADD COLUMN ritual_set_by_member_id TEXT;
ALTER TABLE cleaning_cycles ADD COLUMN ritual_set_at TEXT;

CREATE INDEX IF NOT EXISTS idx_cleaning_cycles_exact_ritual
ON cleaning_cycles(exact_ritual_date, exact_ritual_starts_at);

CREATE TABLE IF NOT EXISTS order_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  task_type TEXT NOT NULL DEFAULT 'general' CHECK (task_type IN ('general', 'proposal')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed_pending', 'approved', 'order_review', 'closed', 'cancelled')),
  created_by_member_id TEXT NOT NULL,
  assigned_to_member_id TEXT NOT NULL,
  source_proposal_id TEXT,
  completion_note TEXT,
  council_note TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  completed_by_member_id TEXT,
  approved_by_member_id TEXT,
  order_review_requested_by_member_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  approved_at TEXT,
  order_review_requested_at TEXT,
  closed_at TEXT,
  FOREIGN KEY (created_by_member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to_member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (completed_by_member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (approved_by_member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (order_review_requested_by_member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_order_tasks_status_created
ON order_tasks(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_tasks_assignee_status
ON order_tasks(assigned_to_member_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_tasks_type_status
ON order_tasks(task_type, status, created_at DESC);

CREATE TABLE IF NOT EXISTS conduct_marks (
  id TEXT PRIMARY KEY,
  subject_member_id TEXT NOT NULL,
  author_member_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('strike', 'praise')),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by_member_id TEXT,
  review_note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  FOREIGN KEY (subject_member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (author_member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by_member_id) REFERENCES members(id) ON DELETE SET NULL
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
  author_member_id TEXT NOT NULL,
  linked_task_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TEXT,
  rejected_at TEXT,
  order_review_requested_at TEXT,
  closed_at TEXT,
  FOREIGN KEY (author_member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_improvement_proposals_status_created
ON improvement_proposals(status, created_at DESC);

CREATE TABLE IF NOT EXISTS proposal_votes (
  id TEXT PRIMARY KEY,
  proposal_id TEXT NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('proposal', 'completion')),
  voter_member_id TEXT NOT NULL,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'reject')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (proposal_id, phase, voter_member_id),
  FOREIGN KEY (proposal_id) REFERENCES improvement_proposals(id) ON DELETE CASCADE,
  FOREIGN KEY (voter_member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_proposal_votes_phase
ON proposal_votes(proposal_id, phase, created_at DESC);
