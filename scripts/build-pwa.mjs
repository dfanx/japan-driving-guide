import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { createHash } from "node:crypto";

const dist = resolve("dist");
const rawBase = process.env.SITE_BASE_PATH?.trim() || "/";
const base = rawBase === "/" ? "/" : `/${rawBase.replace(/^\/+|\/+$/g, "")}/`;

function publicUrl(path) {
  const normalized = path.split(sep).join("/");
  if (normalized === "index.html") return base;
  if (normalized.endsWith("/index.html")) {
    return `${base}${normalized.slice(0, -"index.html".length)}`;
  }
  return `${base}${normalized}`;
}

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

const manifest = {
  id: base,
  name: "Japan Driving Guide",
  short_name: "Japan Drive",
  description: "Bilingual safety learning for overseas visitors driving in Japan.",
  lang: "en",
  dir: "ltr",
  start_url: base,
  scope: base,
  display: "standalone",
  background_color: "#f5f9fa",
  theme_color: "#315f78",
  icons: [
    {
      src: `${base}assets/app-icon.svg`,
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any maskable",
    },
  ],
};

await writeFile(
  join(dist, "manifest.webmanifest"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);

const quizTarget = join(dist, "data", "quiz-bank.json");
await mkdir(dirname(quizTarget), { recursive: true });
await copyFile(resolve("src", "data", "questions", "seed-questions.json"), quizTarget);

const offlineHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#315f78">
    <title>Offline · Japan Driving Guide</title>
    <style>
      :root{font-family:Inter,"Noto Sans TC","Yu Gothic",system-ui,sans-serif;color:#17232d;background:#f5f9fa}
      *{box-sizing:border-box}body{min-height:100vh;margin:0;display:grid;place-items:center;padding:1rem}
      main{width:min(100%,42rem);padding:clamp(1.5rem,5vw,3rem);border:1px solid #d4e0e5;border-radius:1.25rem;background:#fff;box-shadow:0 1rem 3rem rgb(35 65 78/10%)}
      p{color:#4f6571;line-height:1.7}a{display:inline-flex;min-height:44px;align-items:center;padding:.7rem 1rem;border-radius:999px;color:#fff;background:#117b82;font-weight:800}
    </style>
  </head>
  <body>
    <main>
      <p>OFFLINE / 離線</p>
      <h1>This page is not cached yet</h1>
      <p>The lessons you previously installed remain available. External official source pages still require a network connection.</p>
      <p lang="zh-TW">此頁尚未快取。已安裝的學習內容仍可使用；外部官方來源頁面仍需網路連線。</p>
      <a href="${base}">Return to the guide / 返回指南</a>
    </main>
  </body>
</html>\n`;
await writeFile(join(dist, "offline.html"), offlineHtml, "utf8");

const files = (await filesUnder(dist))
  .filter((path) => !path.endsWith(`${sep}sw.js`))
  .sort((a, b) => a.localeCompare(b));
const urls = files.map((path) => publicUrl(relative(dist, path)));
const identity = createHash("sha256")
  .update(await Promise.all(files.map(async (path) => `${relative(dist, path)}:${createHash("sha256").update(await readFile(path)).digest("hex")}`)).then((parts) => parts.join("\n")))
  .digest("hex")
  .slice(0, 16);

const serviceWorker = `const CACHE_NAME = "japan-driving-guide-${identity}";
const BASE_PATH = ${JSON.stringify(base)};
const OFFLINE_URL = ${JSON.stringify(`${base}offline.html`)};
const PRECACHE_URLS = ${JSON.stringify(urls, null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("japan-driving-guide-") && key !== CACHE_NAME).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(BASE_PATH)) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match(OFFLINE_URL))));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
`;
await writeFile(join(dist, "sw.js"), serviceWorker, "utf8");
console.log(`PWA build PASS: ${urls.length} precached URL(s), cache ${identity}, base ${base}`);
