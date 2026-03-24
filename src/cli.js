import process from "node:process";
import { createRuntimeEnv } from "./runtime.js";
import { runScheduledTasks } from "./worker.js";

const command = process.argv[2];

if (command !== "scheduled") {
  console.error("Usage: node src/cli.js scheduled");
  process.exit(1);
}

const runtime = await createRuntimeEnv(process.env);

try {
  await runScheduledTasks(runtime.env);
  console.log("Scheduled tasks completed.");
} finally {
  await runtime.close();
}
