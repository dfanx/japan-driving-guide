import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildDiagramArtifact } from "../tools/diagram-generator/src/builder";
import {
  approveManifestEntry,
  diagramManifestSchema,
  reconcileManifestEntry,
  validateManifestAgainstArtifacts,
} from "../tools/diagram-generator/src/manifest";
import { diagramSceneSchema } from "../tools/diagram-generator/src/schema";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const scenesDirectory = join(projectRoot, "tools", "diagram-generator", "scenes");
const reviewDirectory = join(projectRoot, "tools", "diagram-generator", "review");
const publicDirectory = join(projectRoot, "public", "diagrams");
const manifestPath = join(projectRoot, "src", "data", "diagram-manifest.json");
const [diagramId, reviewedAt] = process.argv.slice(2);

if (!/^D\d{3}$/.test(diagramId ?? "") || !/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt ?? "")) {
  throw new Error("Usage: npm run diagrams:approve -- D002 YYYY-MM-DD");
}

const sceneFiles = readdirSync(scenesDirectory)
  .filter((file) => file.endsWith(".json"))
  .sort();
const sceneSources = sceneFiles.flatMap((file) => {
  const record: unknown = JSON.parse(
    readFileSync(join(scenesDirectory, file), "utf8"),
  );
  const records = Array.isArray(record) ? record : [record];
  return records.map((scene, index) => ({
    file,
    index,
    isArray: Array.isArray(record),
    scene: diagramSceneSchema.parse(scene),
  }));
});
const scenes = sceneSources.map((source) => source.scene);
const artifacts = scenes.map(buildDiagramArtifact);
const targetIndex = scenes.findIndex((scene) => scene.id === diagramId);
if (targetIndex < 0) throw new Error(`Unknown Diagram ID: ${diagramId}`);

const manifest = diagramManifestSchema.parse(
  JSON.parse(readFileSync(manifestPath, "utf8")),
);
const issues = validateManifestAgainstArtifacts({ manifest, artifacts });
if (issues.length > 0) {
  throw new Error(
    `Refusing approval while diagram consistency issues exist: ${issues
      .map((issue) => `${issue.code}:${issue.id}`)
      .join(", ")}`,
  );
}

const targetArtifact = artifacts[targetIndex];
const candidatePath = join(reviewDirectory, `${diagramId}.svg`);
if (!existsSync(candidatePath) || readFileSync(candidatePath, "utf8") !== targetArtifact.svg) {
  throw new Error(`${diagramId} candidate bytes do not match the reviewed artifact`);
}

const approvedScene = diagramSceneSchema.parse({
  ...scenes[targetIndex],
  reviewStatus: "approved",
});
const approvedArtifact = buildDiagramArtifact(approvedScene);
if (approvedArtifact.outputHash !== targetArtifact.outputHash) {
  throw new Error("Changing review status unexpectedly changed SVG output bytes");
}

const currentEntry = manifest.items.find((entry) => entry.id === diagramId);
if (!currentEntry) throw new Error(`${diagramId} is missing from the manifest`);
const reconciledEntry = reconcileManifestEntry({
  previous: currentEntry,
  artifact: approvedArtifact,
});
const approvedEntry = approveManifestEntry({
  entry: reconciledEntry,
  reviewedAt,
  sceneReviewStatus: approvedScene.reviewStatus,
});
const approvedManifest = diagramManifestSchema.parse({
  ...manifest,
  items: manifest.items.map((entry) =>
    entry.id === diagramId ? approvedEntry : entry,
  ),
});

const approvedArtifacts = artifacts.map((artifact, index) =>
  index === targetIndex ? approvedArtifact : artifact,
);
const approvalIssues = validateManifestAgainstArtifacts({
  manifest: approvedManifest,
  artifacts: approvedArtifacts,
});
if (approvalIssues.length > 0) {
  throw new Error(
    `Approval would create inconsistent state: ${approvalIssues
      .map((issue) => `${issue.code}:${issue.id}`)
      .join(", ")}`,
  );
}

const targetSource = sceneSources[targetIndex];
const sourcePath = join(scenesDirectory, targetSource.file);
const sourceRecord: unknown = JSON.parse(readFileSync(sourcePath, "utf8"));
const approvedSourceRecord = targetSource.isArray
  ? (sourceRecord as unknown[]).map((record, index) =>
      index === targetSource.index ? approvedScene : record,
    )
  : approvedScene;
writeFileSync(sourcePath, `${JSON.stringify(approvedSourceRecord, null, 2)}\n`, "utf8");
writeFileSync(manifestPath, `${JSON.stringify(approvedManifest, null, 2)}\n`, "utf8");
writeFileSync(candidatePath, approvedArtifact.svg, "utf8");
mkdirSync(publicDirectory, { recursive: true });
writeFileSync(join(publicDirectory, `${diagramId}.svg`), approvedArtifact.svg, "utf8");

console.log(
  `Approved ${diagramId} on ${reviewedAt}; public output matches ${approvedArtifact.outputHash}`,
);
