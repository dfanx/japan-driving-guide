import { createRequire } from "node:module";
import { mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("@playwright/test");
const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceName = process.env.DIAGRAM_CAPTURE_SOURCE ?? "golden";
if (!new Set(["golden", "review"]).has(sourceName)) {
  throw new Error(`Unsupported diagram capture source: ${sourceName}`);
}
const sourceDirectory = join(
  projectRoot,
  "tools",
  "diagram-generator",
  sourceName,
);
const outputDirectory = join(projectRoot, "test-results", `diagram-${sourceName}`);
const sourceFiles = readdirSync(sourceDirectory)
  .filter((file) => file.endsWith(".svg"))
  .sort();

mkdirSync(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });

for (const width of [600, 360]) {
  for (const file of sourceFiles) {
    const page = await browser.newPage({
      viewport: { width, height: Math.round((width * 2) / 3) },
    });
    await page.goto(pathToFileURL(join(sourceDirectory, file)).href);
    await page.screenshot({
      path: join(outputDirectory, `${file.replace(".svg", "")}-${width}.png`),
    });
    await page.close();
  }
}

await browser.close();
console.log(`Captured ${sourceFiles.length * 2} ${sourceName} diagram images.`);
