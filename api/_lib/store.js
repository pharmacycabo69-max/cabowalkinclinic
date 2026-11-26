// Persistent request/payment register (V6 §12–14). Same backend the sister sites already use: any Redis with the
// Upstash REST API (KV_REST_API_URL + KV_REST_API_TOKEN). Keys are prefixed "cwc:" so the database can be shared.
// Contact details are sealed with AES-256-GCM (REQUEST_ENCRYPTION_KEY, 32+ chars); only folio, service, status and
// timestamps are stored in clear. Records expire after REQUEST_RETENTION_DAYS (default 90). Nothing here goes to analytics.
// Without a configured store, getStore() returns null and callers must NOT claim that anything was saved.
const crypto = require("crypto");

// Preview and Production share one Upstash database: preview data lives under its own prefix and never mixes with
// production folios, digests or retries.
const P = process.env.VERCEL_ENV === "preview" ? "cwc:preview:" : "cwc:";
const DAY = 86400;

function upstash(url, token) {
  const call = async (cmd) => {
    const r = await fetch(url.replace(/\/$/, ""), {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(cmd),
      signal: AbortSignal.timeout(8000),
    });
    const body = await r.json().catch(() => ({}));
    if (!r.ok || body.error) throw new Error(`store ${r.status}`);
    return body.result;
  };
  return {
    get: async (k) => (await call(["GET", P + k])) ?? null,
    setIfAbsent: async (k, v, ttl) => (await call(["SET", P + k, v, "NX", "EX", ttl])) === "OK",
    set: async (k, v, ttl) => { await call(["SET", P + k, v, "EX", ttl]); },
    incr: async (k, ttl) => { const n = await call(["INCR", P + k]); if (n === 1) await call(["EXPIRE", P + k, ttl]); return n; },
    push: async (k, v, max) => { await call(["LPUSH", P + k, v]); await call(["LTRIM", P + k, 0, max - 1]); },
    range: async (k, n) => (await call(["LRANGE", P + k, 0, n - 1])) || [],
  };
}

// In-memory backend for automated tests only (CWC_MEMORY_STORE=1, never on Vercel).
function memory() {
  const m = (globalThis.__cwcMem = globalThis.__cwcMem || new Map());
  const live = (k) => { const e = m.get(k); if (e && e.exp && e.exp < Date.now()) { m.delete(k); return null; } return e || null; };
  return {
    get: async (k) => (live(k) ? live(k).v : null),
    setIfAbsent: async (k, v, ttl) => { if (live(k)) return false; m.set(k, { v, exp: Date.now() + ttl * 1000 }); return true; },
    set: async (k, v, ttl) => { m.set(k, { v, exp: Date.now() + ttl * 1000 }); },
    incr: async (k, ttl) => { const e = live(k); const n = (e ? +e.v : 0) + 1; m.set(k, { v: String(n), exp: e ? e.exp : Date.now() + ttl * 1000 }); return n; },
    push: async (k, v, max) => { const e = live(k); const a = e ? e.v : []; a.unshift(v); m.set(k, { v: a.slice(0, max), exp: 0 }); },
    range: async (k, n) => { const e = live(k); return e ? e.v.slice(0, n) : []; },
  };
}

function key() {
  const s = process.env.REQUEST_ENCRYPTION_KEY || "";
  return s.length >= 32 ? crypto.createHash("sha256").update(s).digest() : null;
}

function getStore() {
  const k = key();
  if (!k) return null;
  let kv = null;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) kv = upstash(process.env.KV_REST_API_URL, process.env.KV_REST_API_TOKEN);
  else if (process.env.CWC_MEMORY_STORE === "1" && !process.env.VERCEL) kv = memory();
  if (!kv) return null;
  const ttl = Math.max(7, Math.min(365, +process.env.REQUEST_RETENTION_DAYS || 90)) * DAY;
  return { kv, key: k, ttl };
}

function seal(store, obj) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", store.key, iv);
  const data = Buffer.concat([c.update(JSON.stringify(obj), "utf8"), c.final()]);
  return [iv, c.getAuthTag(), data].map((b) => b.toString("base64url")).join(".");
}

function unseal(store, s) {
  try {
    const [iv, tag, data] = String(s).split(".").map((x) => Buffer.from(x, "base64url"));
    const d = crypto.createDecipheriv("aes-256-gcm", store.key, iv);
    d.setAuthTag(tag);
    return JSON.parse(Buffer.concat([d.update(data), d.final()]).toString("utf8"));
  } catch { return null; }
}

// Opaque folio: no date, name or service inside. Crockford base32 without look-alike characters.
function newFolio() {
  const A = "23456789ABCDEFGHJKMNPQRSTVWXYZ";
  const b = crypto.randomBytes(8);
  let s = "";
  for (let i = 0; i < 8; i++) s += A[b[i] % A.length];
  return `CWC-${s.slice(0, 4)}-${s.slice(4)}`;
}

const nowIso = () => new Date().toISOString();

async function saveRecord(store, rec) {
  await store.kv.set(`req:${rec.ref}`, JSON.stringify(rec), store.ttl);
}

async function loadRecord(store, ref) {
  const raw = await store.kv.get(`req:${ref}`);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}

async function setStatus(store, ref, status, extra) {
  const rec = await loadRecord(store, ref);
  if (!rec) return null;
  rec.status = status;
  rec.updatedAt = nowIso();
  rec.history = (rec.history || []).concat({ at: rec.updatedAt, status }).slice(-30);
  Object.assign(rec, extra || {});
  await saveRecord(store, rec);
  return rec;
}

module.exports = { getStore, seal, unseal, newFolio, saveRecord, loadRecord, setStatus, nowIso, DAY };
