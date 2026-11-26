// GET /api/reconcile — daily safety net (Vercel Cron, authorised with CRON_SECRET).
//  1. Retries team notices that could not be delivered when the request arrived (persistent queue idx:notify-retry).
//  2. Sends one digest with folios still "received" (unattended), payments started but not completed, orphan payments
//     (paid without a request) and disputes. Folios and statuses only: no names, phones or notes in the digest.
// Without the register it answers 503 so the failure is visible in Vercel logs.
const { getStore, loadRecord, unseal, saveRecord } = require("./_lib/store");
const { emailTeam } = require("./_lib/notify");
const CATALOG = require("./_catalog.json");

const HOUR = 3600 * 1000;

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const auth = req.headers.authorization || "";
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).send("unauthorized");
  const store = getStore();
  if (!store) { console.error("reconcile: register not configured"); return res.status(503).send("register not configured"); }

  // 1. notification retry queue
  let retried = 0, stillFailing = 0;
  const queue = await store.kv.range("idx:notify-retry", 200);
  for (const ref of [...new Set(queue)]) {
    const rec = await loadRecord(store, ref);
    if (!rec || !rec.notifyPending) continue;
    const d = unseal(store, rec.sealed);
    if (!d) { rec.notifyPending = false; rec.unreadable = true; await saveRecord(store, rec); continue; } // sealed with another environment's key: never send an empty notice
    const s = CATALOG.services[rec.service] || { en: rec.service };
    const ok = await emailTeam(`[${ref}] (retry) New request: ${s.en}`, [
      `Request ${ref} could not be notified when it arrived (${rec.createdAt}).`,
      `Service: ${s.en}`, `Preferred: ${[d.date, d.time].filter(Boolean).join(" ") || "-"}`,
      `Name: ${d.name || "-"}`, `Phone: ${d.phone || "-"}`, `Email: ${d.email || "-"}`, d.location ? `Location: ${d.location}` : "",
    ].filter(Boolean).join("\n"), `retry-${ref}`);
    if (ok) { rec.notifyPending = false; rec.notified = Object.assign({}, rec.notified, { email: true }); await saveRecord(store, rec); retried++; }
    else stillFailing++;
  }

  // 2. digest
  const now = Date.now();
  const refs = [...new Set(await store.kv.range("idx:requests", 300))];
  const unattended = [], abandoned = [], disputed = [], orphan = [];
  for (const ref of refs) {
    const rec = await loadRecord(store, ref);
    if (!rec || rec.unreadable) continue; // records from another environment (e.g. a preview test) stay out of the digest
    const age = now - Date.parse(rec.updatedAt || rec.createdAt);
    if (rec.status === "received" && age > 2 * HOUR) unattended.push(`${ref} · ${rec.service} · since ${rec.createdAt.slice(0, 16)}Z`);
    if ((rec.status === "payment_pending" || rec.status === "payment_expired" || rec.status === "payment_failed") && age > HOUR) abandoned.push(`${ref} · ${rec.service} · ${rec.status}`);
    if (rec.status === "disputed") disputed.push(`${ref} · ${rec.service}`);
  }
  for (const ref of [...new Set(await store.kv.range("idx:payments", 300))]) {
    const rec = await loadRecord(store, ref);
    if (rec && rec.orphan) orphan.push(`${ref} · ${rec.service || "?"}`);
  }
  const lines = [
    `Notices re-sent: ${retried}; still failing: ${stillFailing}`,
    "", `Requests not attended (> 2 h, still "received"): ${unattended.length}`, ...unattended,
    "", `Payments started but not completed: ${abandoned.length}`, ...abandoned,
    "", `Payments without an associated request: ${orphan.length}`, ...orphan,
    "", `Open disputes: ${disputed.length}`, ...disputed,
    "", "Mark folios as attended in the register/QuickTurno. This digest contains folios only.",
  ];
  const anything = unattended.length || abandoned.length || orphan.length || disputed.length || stillFailing;
  let sent = false;
  if (anything) sent = await emailTeam(`Cabo Walk-In Clinic — daily check: ${unattended.length} unattended, ${abandoned.length} unpaid, ${disputed.length} disputes`, lines.join("\n"), `digest-${new Date().toISOString().slice(0, 10)}`);
  return res.status(200).json({ ok: true, retried, stillFailing, unattended: unattended.length, abandoned: abandoned.length, orphan: orphan.length, disputed: disputed.length, digestSent: sent });
};
