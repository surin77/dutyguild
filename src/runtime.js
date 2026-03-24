import nodemailer from "nodemailer";
import { createPgCompatAdapter, createPgPool } from "./postgres.js";

export async function createRuntimeEnv(source = process.env) {
  const pool = createPgPool(source.DATABASE_URL);
  const emailMode = String(source.EMAIL_MODE || "stub");
  const transporter =
    emailMode === "smtp" ? createSmtpTransport(source) : null;

  return {
    env: {
      ...source,
      EMAIL_MODE: emailMode,
      DB: createPgCompatAdapter(pool),
      SMTP_TRANSPORTER: transporter,
    },
    async close() {
      await Promise.allSettled([
        pool.end(),
        transporter?.close ? transporter.close() : Promise.resolve(),
      ]);
    },
    pool,
  };
}

function createSmtpTransport(source) {
  const host = String(source.SMTP_HOST || "").trim();
  const user = String(source.SMTP_USER || "").trim();
  const password = String(source.SMTP_PASSWORD || "").trim();
  const port = Number.parseInt(String(source.SMTP_PORT || "465"), 10);
  const secure =
    String(source.SMTP_SECURE || "").trim() === ""
      ? port === 465
      : String(source.SMTP_SECURE).trim() === "true";

  if (!host || !user || !password || !Number.isFinite(port)) {
    throw new Error(
      "SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD are required for EMAIL_MODE=smtp.",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
  });
}
