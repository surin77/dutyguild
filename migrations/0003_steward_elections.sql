CREATE TABLE IF NOT EXISTS council_elections (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'steward' CHECK (role IN ('steward')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  round_number INTEGER NOT NULL DEFAULT 1,
  launched_by_member_id TEXT,
  winner_member_id TEXT,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  FOREIGN KEY (launched_by_member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (winner_member_id) REFERENCES members(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_council_elections_status
  ON council_elections(role, status, started_at DESC);

CREATE TABLE IF NOT EXISTS council_election_candidates (
  id TEXT PRIMARY KEY,
  election_id TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  member_id TEXT NOT NULL,
  rating_snapshot REAL,
  feedback_count_snapshot INTEGER NOT NULL DEFAULT 0,
  duty_count_snapshot INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (election_id, round_number, member_id),
  FOREIGN KEY (election_id) REFERENCES council_elections(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_council_election_candidates_round
  ON council_election_candidates(election_id, round_number);

CREATE TABLE IF NOT EXISTS council_election_votes (
  id TEXT PRIMARY KEY,
  election_id TEXT NOT NULL,
  round_number INTEGER NOT NULL,
  voter_member_id TEXT NOT NULL,
  candidate_member_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (election_id, round_number, voter_member_id),
  FOREIGN KEY (election_id) REFERENCES council_elections(id) ON DELETE CASCADE,
  FOREIGN KEY (voter_member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_council_election_votes_round
  ON council_election_votes(election_id, round_number);
