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
  DIAGRAM_MANIFEST_SCHEMA_VERSION,
  diagramManifestSchema,
  reconcileManifestEntry,
  validateManifestAgainstArtifacts,
  type DiagramManifest,
} from "../tools/diagram-generator/src/manifest";
import { diagramSceneSchema } from "../tools/diagram-generator/src/schema";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const scenesDirectory = join(projectRoot, "tools", "diagram-generator", "scenes");
const reviewDirectory = join(projectRoot, "tools", "diagram-generator", "review");
const publicDirectory = join(projectRoot, "public", "diagrams");
const manifestPath = join(projectRoot, "src", "data", "diagram-manifest.json");
const checkOnly = process.argv.includes("--check");

const scenes = readdirSync(scenesDirectory)
  .filter((file) => file.endsWith(".json"))
  .sort()
  .flatMap((file) => {
    const record: unknown = JSON.parse(readFileSync(join(scenesDirectory, file), "utf8"));
    return (Array.isArray(record) ? record : [record]).map((scene) => diagramSceneSchema.parse(scene));
  });
const artifacts = scenes.map(buildDiagramArtifact);
if (new Set(artifacts.map((artifact) => artifact.id)).size !== artifacts.length) {
  throw new Error("Diagram Scene IDs must be unique before candidate generation");
}

function readManifest(): DiagramManifest {
  if (!existsSync(manifestPath)) {
    throw new Error(`Diagram manifest does not exist: ${manifestPath}`);
  }
  return diagramManifestSchema.parse(
    JSON.parse(readFileSync(manifestPath, "utf8")),
  );
}

if (checkOnly) {
  const manifest = readManifest();
  const issues = validateManifestAgainstArtifacts({ manifest, artifacts });
  for (const artifact of artifacts) {
    const candidatePath = join(projectRoot, ...artifact.candidatePath.split("/"));
    if (!existsSync(candidatePath)) {
      issues.push({
        code: "artifact_drift",
        id: artifact.id,
        message: `${artifact.id} review candidate is missing`,
      });
    } else if (readFileSync(candidatePath, "utf8") !== artifact.svg) {
      issues.push({
        code: "artifact_drift",
        id: artifact.id,
        message: `${artifact.id} review candidate bytes have drifted`,
      });
    }
    const entry = manifest.items.find((item) => item.id === artifact.id);
    const publicPath = join(publicDirectory, `${artifact.id}.svg`);
    if (entry?.reviewStatus === "approved") {
      if (!existsSync(publicPath)) {
        issues.push({
          code: "missing_public_asset",
          id: artifact.id,
          message: `${artifact.id} is approved but its public asset is missing`,
        });
      } else if (readFileSync(publicPath, "utf8") !== artifact.svg) {
        issues.push({
          code: "public_asset_drift",
          id: artifact.id,
          message: `${artifact.id} public asset does not match the approved output`,
        });
      }
    } else if (existsSync(publicPath)) {
      issues.push({
        code: "unapproved_public_asset",
        id: artifact.id,
        message: `${artifact.id} is public without current approval`,
      });
    }
  }
  const expectedCandidateNames = new Set(
    artifacts.map((artifact) => `${artifact.id}.svg`),
  );
  if (existsSync(reviewDirectory)) {
    for (const file of readdirSync(reviewDirectory).filter((name) => name.endsWith(".svg"))) {
      if (!expectedCandidateNames.has(file)) {
        issues.push({
          code: "unexpected_entry",
          id: file.replace(/\.svg$/, ""),
          message: `${file} is an unmanaged review candidate`,
        });
      }
    }
  }

  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`Diagram check FAIL [${issue.code}] ${issue.message}`);
    }
    process.exitCode = 1;
  } else {
    console.log(
      `Diagram check PASS: ${artifacts.length} candidate(s), ${manifest.items.filter((item) => item.reviewStatus === "approved").length} approved`,
    );
  }
} else {
  const previousManifest = existsSync(manifestPath) ? readManifest() : undefined;
  const previousById = new Map(
    previousManifest?.items.map((entry) => [entry.id, entry]) ?? [],
  );
  const manifest = diagramManifestSchema.parse({
    schemaVersion: DIAGRAM_MANIFEST_SCHEMA_VERSION,
    items: artifacts
      .map((artifact) =>
        reconcileManifestEntry({
          previous: previousById.get(artifact.id),
          artifact,
        }),
      )
      .sort((left, right) =>
        left.id < right.id ? -1 : left.id > right.id ? 1 : 0,
      ),
  });

  mkdirSync(reviewDirectory, { recursive: true });
  for (const artifact of artifacts) {
    const candidatePath = join(projectRoot, ...artifact.candidatePath.split("/"));
    writeFileSync(candidatePath, artifact.svg, "utf8");
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(
    `Built ${artifacts.length} review candidate(s); ${manifest.items.filter((item) => item.reviewStatus === "needs_review").length} need review`,
  );
}
