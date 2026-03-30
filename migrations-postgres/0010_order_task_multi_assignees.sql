CREATE TABLE IF NOT EXISTS order_task_assignees (
  task_id TEXT NOT NULL REFERENCES order_tasks(id) ON DELETE CASCADE,
  member_id TEXT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  assignment_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_order_task_assignees_member
ON order_task_assignees(member_id, assignment_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_task_assignees_task
ON order_task_assignees(task_id, assignment_order);

INSERT INTO order_task_assignees (task_id, member_id, assignment_order)
SELECT id, assigned_to_member_id, 0
FROM order_tasks
WHERE assigned_to_member_id IS NOT NULL
ON CONFLICT (task_id, member_id) DO NOTHING;
