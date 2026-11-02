// Local stand-in for the deployed Worker, for testing the site form on macOS < 13.5.
// Serves the real src/index.js on http://localhost:8787 with an in-memory SQLite DB.
// Usage: node test/serve.mjs
import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import worker from "../src/index.js";

const sqlite = new DatabaseSync(":memory:");
sqlite.exec(readFileSync(new URL("../schema.sql", import.meta.url), "utf8"));
const DB = {
  prepare(sql) {
    const stmt = sqlite.prepare(sql.replace(/\?(\d+)/g, "?"));
    const positions = [...sql.matchAll(/\?(\d+)/g)].map((m) => Number(m[1]));
    let args = [];
    const api = {
      bind(...vals) { args = positions.length ? positions.map((p) => vals[p - 1]) : vals; return api; },
      async run() { return stmt.run(...args); },
      async all() { return { results: stmt.all(...args) }; },
    };
    return api;
  },
};
// 127.0.0.1 and localhost are different origins to the browser; allow both locally.
const env = {
  DB,
  EXPORT_KEY: "local-test-key",
  ALLOWED_ORIGINS: "https://campoesquerdo.eco.br/,http://localhost:3000,http://127.0.0.1:3000",
};

createServer(async (req, res) => {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const request = new Request("http://localhost:8787" + req.url, {
    method: req.method,
    headers: req.headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks),
  });
  const response = await worker.fetch(request, env);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
}).listen(8787, () => console.log("newsletter worker (local) on http://localhost:8787"));
