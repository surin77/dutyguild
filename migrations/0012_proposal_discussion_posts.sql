CREATE TABLE IF NOT EXISTS proposal_discussion_posts (
  id TEXT PRIMARY KEY,
  proposal_id TEXT NOT NULL REFERENCES improvement_proposals(id) ON DELETE CASCADE,
  author_member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  phase TEXT NOT NULL DEFAULT 'general' CHECK (phase IN ('general', 'proposal', 'completion')),
  vote TEXT CHECK (vote IN ('approve', 'reject')),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proposal_discussion_posts_timeline
ON proposal_discussion_posts(proposal_id, created_at ASC);
