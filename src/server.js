import { createServer } from "node:http";
import process from "node:process";
import { buffer } from "node:stream/consumers";
import { createRuntimeEnv } from "./runtime.js";
import { handleRequest } from "./worker.js";

const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "0.0.0.0";

const runtime = await createRuntimeEnv(process.env);

const server = createServer(async (req, res) => {
  try {
    const request = await toWebRequest(req);
    const response = await handleRequest(request, runtime.env);
    await sendWebResponse(res, response);
  } catch (error) {
    console.error("Unhandled server error", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "Внутри Duty Guild произошла ошибка." }));
  }
});

server.listen(port, host, () => {
  console.log(`Duty Guild listening on http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    void shutdown(signal);
  });
}

async function shutdown(signal) {
  console.log(`Received ${signal}, stopping Duty Guild.`);

  await new Promise((resolve) => {
    server.close(resolve);
  });

  await runtime.close();
  process.exit(0);
}

async function toWebRequest(req) {
  const url = buildRequestUrl(req);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
      continue;
    }

    if (value !== undefined) {
      headers.set(key, value);
    }
  }

  const hasBody = req.method && !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await buffer(req) : undefined;

  return new Request(url, {
    method: req.method,
    headers,
    body: body?.length ? body : undefined,
  });
}

function buildRequestUrl(req) {
  const proto = firstHeaderValue(req.headers["x-forwarded-proto"])
    || (req.socket.encrypted ? "https" : "http");
  const hostHeader = firstHeaderValue(req.headers["x-forwarded-host"])
    || firstHeaderValue(req.headers.host)
    || "localhost:3000";

  return `${proto}://${hostHeader}${req.url || "/"}`;
}

function firstHeaderValue(value) {
  if (Array.isArray(value)) {
    return String(value[0] || "")
      .split(",")[0]
      .trim();
  }

  return String(value || "")
    .split(",")[0]
    .trim();
}

async function sendWebResponse(res, response) {
  res.statusCode = response.status;
  res.statusMessage = response.statusText;

  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }

  const body = response.body ? Buffer.from(await response.arrayBuffer()) : null;
  res.end(body);
}
