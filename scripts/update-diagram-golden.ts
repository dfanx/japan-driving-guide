import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { GOLDEN_TEMPLATE_CASES } from "../tools/diagram-generator/src/golden-fixtures";

const goldenDirectory = fileURLToPath(
  new URL("../tools/diagram-generator/golden/", import.meta.url),
);

mkdirSync(goldenDirectory, { recursive: true });
for (const goldenCase of GOLDEN_TEMPLATE_CASES) {
  const outputPath = `${goldenDirectory}${goldenCase.name}.svg`;
  writeFileSync(outputPath, goldenCase.svg, "utf8");
  console.log(`Updated ${outputPath}`);
}
