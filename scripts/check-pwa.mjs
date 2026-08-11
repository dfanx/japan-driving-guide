import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const dist = resolve("dist");
const rawBase = process.env.SITE_BASE_PATH?.trim() || "/";
const base = rawBase === "/" ? "/" : `/${rawBase.replace(/^\/+|\/+$/g, "")}/`;
const failures = [];

const manifest = JSON.parse(await readFile(resolve(dist, "manifest.webmanifest"), "utf8"));
if (manifest.start_url !== base || manifest.scope !== base || manifest.id !== base) {
  failures.push("Manifest id, start_url, and scope must equal the configured base path");
}
for (const icon of manifest.icons ?? []) {
  if (!icon.src.startsWith(base)) failures.push(`Manifest icon escapes base: ${icon.src}`);
  const localPath = icon.src.slice(base.length);
  try { await stat(resolve(dist, localPath)); } catch { failures.push(`Manifest icon is missing: ${icon.src}`); }
}
if (!manifest.icons?.length) failures.push("Manifest has no install icon");

const serviceWorker = await readFile(resolve(dist, "sw.js"), "utf8");
const match = serviceWorker.match(/const PRECACHE_URLS = (\[[\s\S]*?\]);/);
if (!match) failures.push("Service worker precache list is missing");
const precache = match ? JSON.parse(match[1]) : [];
for (const required of [base, `${base}offline.html`, `${base}manifest.webmanifest`, `${base}data/quiz-bank.json`, `${base}diagrams/D002.svg`]) {
  if (!precache.includes(required)) failures.push(`Required offline URL is not precached: ${required}`);
}
if (precache.some((url) => !url.startsWith(base))) failures.push("Precache contains a URL outside the configured base");

const quizBank = JSON.parse(await readFile(resolve(dist, "data", "quiz-bank.json"), "utf8"));
if (!Array.isArray(quizBank) || quizBank.length !== 24) failures.push("Offline quiz bank must contain the 24 approved Questions");

const rootHtml = await readFile(resolve(dist, "index.html"), "utf8");
if (!rootHtml.includes(`href="${base}manifest.webmanifest"`)) failures.push("Root page does not link the base-aware manifest");
if (!rootHtml.includes(`${base}sw.js`)) failures.push("Root page does not register the base-aware service worker");

if (failures.length) {
  failures.forEach((failure) => console.error(`PWA check FAIL: ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`PWA check PASS: ${precache.length} precached URL(s), 24 Questions, base ${base}`);
}
