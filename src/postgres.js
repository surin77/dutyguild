import { Pool, types } from "pg";

const DATE_OID = 1082;
const TIME_OID = 1083;
const TIMESTAMP_OID = 1114;
const TIMESTAMPTZ_OID = 1184;
const SQL_CACHE = new Map();

let parsersConfigured = false;

export function createPgPool(connectionString) {
  if (!connectionString) {
    throw new Error("DATABASE_URL is required.");
  }

  configurePgTypeParsers();

  return new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
  });
}

export function createPgCompatAdapter(pool) {
  return {
    prepare(sql) {
      return new PgStatement(pool, sql);
    },
  };
}

function configurePgTypeParsers() {
  if (parsersConfigured) {
    return;
  }

  for (const oid of [DATE_OID, TIME_OID, TIMESTAMP_OID, TIMESTAMPTZ_OID]) {
    types.setTypeParser(oid, (value) => value);
  }

  parsersConfigured = true;
}

class PgStatement {
  constructor(pool, sql, params = []) {
    this.pool = pool;
    this.sql = sql;
    this.params = params;
  }

  bind(...params) {
    return new PgStatement(this.pool, this.sql, params);
  }

  async first() {
    const result = await this.#query();
    return result.rows[0] ?? null;
  }

  async all() {
    const result = await this.#query();
    return { results: result.rows };
  }

  async run() {
    const result = await this.#query();
    return {
      success: true,
      meta: {
        rowCount: result.rowCount ?? 0,
      },
    };
  }

  async #query() {
    const text = translateSql(this.sql);
    return this.pool.query({
      text,
      values: this.params,
    });
  }
}

function translateSql(sql) {
  const cached = SQL_CACHE.get(sql);
  if (cached) {
    return cached;
  }

  let parameterIndex = 0;
  const translated = sql.replace(/\?/g, () => {
    parameterIndex += 1;
    return `$${parameterIndex}`;
  });

  SQL_CACHE.set(sql, translated);
  return translated;
}
