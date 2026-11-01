// Local test harness for the newsletter Worker (workerd can't run on macOS 13.4).
// Runs the real src/index.js against a D1-compatible shim backed by node:sqlite.
// Usage: node test/run.mjs
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import worker from "../src/index.js";

const sqlite = new DatabaseSync(":memory:");
sqlite.exec(readFileSync(new URL("../schema.sql", import.meta.url), "utf8"));

// Minimal D1 shim: prepare().bind().run() / prepare().all()
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

const env = { DB, EXPORT_KEY: "test-key", ALLOWED_ORIGINS: "https://campoesquerdo.eco.br,http://localhost:3000" };
const ORIGIN = "https://campoesquerdo.eco.br";

const post = (body, origin = ORIGIN) =>
  worker.fetch(new Request("https://w.dev/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(origin ? { Origin: origin } : {}) },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }), env);

let failed = 0;
const check = (name, cond, extra = "") => { console.log(`${cond ? "PASS" : "FAIL"}  ${name} ${extra}`); if (!cond) failed++; };

let r = await post({ email: "Ana@Example.com ", blog: true, eventos: false });
check("valid signup → 200", r.status === 200, await r.clone().text());
check("CORS header echoed for allowed origin", r.headers.get("Access-Control-Allow-Origin") === ORIGIN);

r = await post({ email: "bia@example.com", blog: true, eventos: true });
check("second signup → 200", r.status === 200);

r = await post({ email: "ana@example.com", blog: false, eventos: true });
check("same email updates choices (no duplicate) → 200", r.status === 200);

r = await post({ email: "not-an-email", blog: true });
check("invalid email → 400", r.status === 400);

r = await post({ email: "c@example.com", blog: false, eventos: false });
check("no box checked → 400", r.status === 400);

r = await post({ email: "bot@example.com", blog: true, website: "http://spam" });
check("honeypot filled → fake 200", r.status === 200);

r = await post({ email: "evil@example.com", blog: true }, "https://evil.example");
check("foreign origin → 403", r.status === 403);
check(
  "foreign origin 403 is readable by the browser (origin echoed)",
  r.headers.get("Access-Control-Allow-Origin") === "https://evil.example",
  String(r.headers.get("Access-Control-Allow-Origin"))
);
check("foreign origin 403 reports error=origin", (await r.clone().json()).error === "origin");

r = await post("{not json");
check("bad JSON → 400", r.status === 400);

r = await post({ email: "=cmd@example.com", blog: true });
check("formula-looking email accepted (will be neutralised in CSV)", r.status === 200);

r = await worker.fetch(new Request("https://w.dev/subscribe", { method: "OPTIONS", headers: { Origin: ORIGIN } }), env);
check("CORS preflight → 204", r.status === 204 && r.headers.get("Access-Control-Allow-Origin") === ORIGIN);

r = await worker.fetch(new Request("https://w.dev/subscribe", { method: "OPTIONS", headers: { Origin: "http://127.0.0.1:3000" } }), env);
check("preflight from unknown origin → 403", r.status === 403, String(r.status));

r = await worker.fetch(new Request("https://w.dev/export.csv?key=wrong"), env);
check("CSV with wrong key → 404", r.status === 404);

r = await worker.fetch(new Request("https://w.dev/export.csv?key=test-key"), env);
const csv = await r.text();
check("CSV with right key → 200 text/csv", r.status === 200 && r.headers.get("Content-Type").startsWith("text/csv"));
const rows = csv.replace(/^\uFEFF/, "").trim().split("\r\n");
check("CSV has header + 3 real rows (bot excluded, ana not duplicated)", rows.length === 4, `(${rows.length} lines)`);
check("ana's row reflects updated choices", rows.some((l) => l.startsWith('"ana@example.com","não","sim"')));
check("formula injection neutralised", rows.some((l) => l.startsWith(`"'=cmd@example.com"`)));
console.log("\n--- CSV ---\n" + csv.replace(/^\uFEFF/, ""));

// Trailing slash in ALLOWED_ORIGINS must not break matching (common config mistake)
const envSlash = { ...env, ALLOWED_ORIGINS: "https://campoesquerdo.eco.br/,http://localhost:3000/" };
r = await worker.fetch(new Request("https://w.dev/subscribe", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: ORIGIN },
  body: JSON.stringify({ email: "slash@example.com", blog: true }),
}), envSlash);
check("trailing slash in ALLOWED_ORIGINS still matches → 200", r.status === 200, String(r.status));

console.log(failed ? `\n${failed} FAILED` : "\nALL PASSED");
process.exit(failed ? 1 : 0);
