// 410 Gone for services Cabo Walk-In Clinic no longer offers (V6 §3: aesthetic medicine retired from this brand).
// A 410 tells search engines the page was removed on purpose, so it leaves the index without being redirected to an
// unrelated page. People still get a useful page with the services that remain. Same answer for every user agent.
module.exports = (req, res) => {
  res.statusCode = 410;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.setHeader("X-Robots-Tag", "noindex");
  res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Service no longer offered | Cabo Walk-In Clinic</title><meta name="robots" content="noindex">
<style>body{margin:0;font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1c2a39;background:#faf7f1}main{max-width:640px;margin:0 auto;padding:56px 20px}h1{font-size:28px;line-height:1.25;color:#0b2a4a}a{color:#0b2a4a}ul{padding-left:20px}.b{display:inline-block;margin-top:8px;padding:12px 22px;border-radius:999px;background:#0b2a4a;color:#fff;text-decoration:none;font-weight:700}</style></head>
<body><main><p><a href="/">Cabo Walk-In Clinic</a></p>
<h1>This service is no longer offered by Cabo Walk-In Clinic</h1>
<p>We focus on general medicine: walk-in visits in downtown Cabo San Lucas, house calls, video consultations and the coordination of lab tests and X-rays.</p>
<ul><li><a href="/walk-in-clinic-doctor-cabo-san-lucas/">Walk-in clinic visit &mdash; $99 USD</a></li><li><a href="/home-doctor/">Doctor house call &mdash; $189 USD</a></li><li><a href="/contact/">Contact &amp; location</a></li></ul>
<p lang="es">Este servicio ya no se ofrece en Cabo Walk-In Clinic. <a href="/es/">Ver servicios en espa&ntilde;ol</a>.</p>
<a class="b" href="/">Go to the home page</a></main></body></html>`);
};
