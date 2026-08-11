import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const dist = resolve("dist");
const requestedBase = process.env.SITE_BASE_PATH || process.argv[2] || "/";
const base = requestedBase === "/"
  ? "/"
  : `/${requestedBase.replace(/^\/+|\/+$/g, "")}/`;

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

async function resolvesFromDist(urlPath) {
  const withoutQuery = urlPath.split(/[?#]/, 1)[0];
  const local = base === "/" ? withoutQuery : `/${withoutQuery.slice(base.length)}`;
  const candidate = resolve(dist, `.${local}`);
  try {
    const details = await stat(candidate);
    if (details.isFile()) return true;
    if (details.isDirectory()) return (await stat(join(candidate, "index.html"))).isFile();
  } catch {
    return false;
  }
  return false;
}

const htmlFiles = (await filesUnder(dist)).filter((path) => path.endsWith(".html"));
const failures = [];
let checkedReferences = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const references = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (!reference.startsWith("/")) continue;
    checkedReferences += 1;
    if (!reference.startsWith(base)) {
      failures.push(`${file}: ${reference} is outside ${base}`);
      continue;
    }
    if (!(await resolvesFromDist(reference))) {
      failures.push(`${file}: ${reference} does not resolve inside dist`);
    }
  }
}

if (checkedReferences === 0) failures.push("No root-relative references were checked");
if (failures.length > 0) {
  failures.forEach((failure) => console.error(`Base-path check FAIL: ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Base-path check PASS: ${htmlFiles.length} HTML files, ${checkedReferences} references under ${base}`);
}
