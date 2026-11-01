/**
 * Campo Esquerdo — newsletter signups
 * Cloudflare Worker + D1 (SQLite). No Google, free tier.
 *
 *   POST /subscribe            { email, blog, eventos, website }  → saves / updates a signup
 *   GET  /export.csv?key=...   → live CSV of every signup (key = EXPORT_KEY secret)
 *
 * Config (wrangler.toml [vars]):  ALLOWED_ORIGINS  comma-separated list of site origins
 * Secret (wrangler secret put):   EXPORT_KEY       password for the CSV link
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim().replace(/\/+$/, "")) // tolerate a trailing slash in the config
    .filter(Boolean);
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (allowed.includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

function csvCell(value) {
  const s = value == null ? "" : String(value);
  // Quote everything; neutralise spreadsheet formula injection (=, +, -, @)
  const safe = /^[=+\-@]/.test(s) ? "'" + s : s;
  return '"' + safe.replace(/"/g, '""') + '"';
}

async function subscribe(request, env) {
  const cors = corsHeaders(request, env);
  if (!cors["Access-Control-Allow-Origin"]) {
    const origin = request.headers.get("Origin") || "(no Origin header)";
    // Logged so `npx wrangler tail` shows the exact origin to add to ALLOWED_ORIGINS.
    console.warn(`[newsletter] blocked Origin: ${origin}`);
    // Echo the origin on this 403 too: otherwise the browser reports a CORS failure
    // and the site can only say "request failed" instead of "origin not allowed".
    const denyHeaders = { ...cors };
    if (origin !== "(no Origin header)") denyHeaders["Access-Control-Allow-Origin"] = origin;
    return json({ ok: false, error: "origin", origin }, 403, denyHeaders);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "json" }, 400, cors);
  }

  // Honeypot: real people never fill the hidden "website" field. Pretend success for bots.
  if (data.website) return json({ ok: true }, 200, cors);

  const email = String(data.email || "").trim().toLowerCase();
  const blog = data.blog ? 1 : 0;
  const eventos = data.eventos ? 1 : 0;

  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: "email" }, 400, cors);
  }
  if (!blog && !eventos) {
    return json({ ok: false, error: "choice" }, 400, cors);
  }

  const now = new Date().toISOString();
  // Same email again = update their choices instead of creating a duplicate
  await env.DB.prepare(
    `INSERT INTO subscribers (email, blog, eventos, created_at, updated_at)
     VALUES (?1, ?2, ?3, ?4, ?4)
     ON CONFLICT(email) DO UPDATE SET
       blog = excluded.blog,
       eventos = excluded.eventos,
       updated_at = excluded.updated_at`
  )
    .bind(email, blog, eventos, now)
    .run();

  return json({ ok: true }, 200, cors);
}

async function exportCsv(url, env) {
  const key = url.searchParams.get("key") || "";
  if (!env.EXPORT_KEY || key !== env.EXPORT_KEY) {
    return new Response("Not found", { status: 404 });
  }

  const { results } = await env.DB.prepare(
    "SELECT email, blog, eventos, created_at, updated_at FROM subscribers ORDER BY created_at"
  ).all();

  const lines = [["email", "blog", "eventos", "inscrito_em", "atualizado_em"].map(csvCell).join(",")];
  for (const r of results) {
    lines.push(
      [r.email, r.blog ? "sim" : "não", r.eventos ? "sim" : "não", r.created_at, r.updated_at]
        .map(csvCell)
        .join(",")
    );
  }

  // BOM so Excel/Numbers read the accents (ã, é) correctly
  return new Response("\uFEFF" + lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="newsletter-campo-esquerdo.csv"',
      "Cache-Control": "no-store",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      const cors = corsHeaders(request, env);
      if (!cors["Access-Control-Allow-Origin"]) {
        const origin = request.headers.get("Origin") || "(no Origin header)";
        console.warn(`[newsletter] preflight from blocked Origin: ${origin}`);
        return json({ ok: false, error: "origin", origin }, 403, {
          ...cors,
          ...(origin !== "(no Origin header)" ? { "Access-Control-Allow-Origin": origin } : {}),
        });
      }
      return new Response(null, { status: 204, headers: cors });
    }
    if (url.pathname === "/subscribe" && request.method === "POST") {
      try {
        return await subscribe(request, env);
      } catch (err) {
        console.error(err);
        return json({ ok: false, error: "server" }, 500, corsHeaders(request, env));
      }
    }
    if (url.pathname === "/export.csv" && request.method === "GET") {
      return exportCsv(url, env);
    }
    return new Response("Not found", { status: 404 });
  },
};
