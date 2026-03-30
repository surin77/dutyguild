CREATE TABLE IF NOT EXISTS order_task_assignees (
  task_id TEXT NOT NULL,
  member_id TEXT NOT NULL,
  assignment_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task_id, member_id),
  FOREIGN KEY (task_id) REFERENCES order_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_task_assignees_member
ON order_task_assignees(member_id, assignment_order, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_task_assignees_task
ON order_task_assignees(task_id, assignment_order);

INSERT OR IGNORE INTO order_task_assignees (task_id, member_id, assignment_order)
SELECT id, assigned_to_member_id, 0
FROM order_tasks
WHERE assigned_to_member_id IS NOT NULL;
