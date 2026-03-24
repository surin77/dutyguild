import { readdir, readFile } from "node:fs/promises";
import process from "node:process";
import { createPgPool } from "./postgres.js";

const migrationsUrl = new URL("../migrations-postgres/", import.meta.url);
const pool = createPgPool(process.env.DATABASE_URL);

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const entries = await readdir(migrationsUrl, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  for (const fileName of files) {
    const alreadyApplied = await pool.query(
      "SELECT name FROM schema_migrations WHERE name = $1 LIMIT 1",
      [fileName],
    );

    if (alreadyApplied.rowCount) {
      continue;
    }

    const sql = await readFile(new URL(fileName, migrationsUrl), "utf8");
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (name) VALUES ($1)",
        [fileName],
      );
      await client.query("COMMIT");
      console.log(`Applied migration ${fileName}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  console.log("Postgres migrations are up to date.");
} finally {
  await pool.end();
}
