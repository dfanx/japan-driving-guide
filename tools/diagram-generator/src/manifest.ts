import { createHash } from "node:crypto";

import { z } from "astro/zod";

import type { DiagramScene } from "./schema";

export const DIAGRAM_MANIFEST_SCHEMA_VERSION = "1.0.0" as const;
export const DIAGRAM_GENERATOR_VERSION = "1.1.0" as const;

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }, "Expected a real ISO calendar date");

const sha256Schema = z.string().regex(/^sha256:[0-9a-f]{64}$/);

export const diagramManifestEntrySchema = z
  .object({
    id: z.string().regex(/^D\d{3}$/),
    templateId: z.string().regex(/^(?:T(?:0[1-9]|1[0-5])|C0[1-5])$/),
    candidatePath: z.string().regex(/^tools\/diagram-generator\/review\/D\d{3}\.svg$/),
    sceneHash: sha256Schema,
    outputHash: sha256Schema,
    generatorVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
    reviewStatus: z.enum(["needs_review", "approved"]),
    reviewedAt: isoDateSchema.nullable(),
  })
  .strict()
  .superRefine((entry, context) => {
    if (entry.reviewStatus === "approved" && entry.reviewedAt === null) {
      context.addIssue({
        code: "custom",
        path: ["reviewedAt"],
        message: "An approved diagram requires reviewedAt",
      });
    }
    if (entry.reviewStatus === "needs_review" && entry.reviewedAt !== null) {
      context.addIssue({
        code: "custom",
        path: ["reviewedAt"],
        message: "A diagram needing review cannot retain reviewedAt",
      });
    }
  });

export const diagramManifestSchema = z
  .object({
    schemaVersion: z.literal(DIAGRAM_MANIFEST_SCHEMA_VERSION),
    items: z
      .array(diagramManifestEntrySchema)
      .min(1)
      .refine(
        (items) => new Set(items.map((item) => item.id)).size === items.length,
        "Diagram manifest IDs must be unique",
      ),
  })
  .strict();

export type DiagramManifestEntry = z.infer<typeof diagramManifestEntrySchema>;
export type DiagramManifest = z.infer<typeof diagramManifestSchema>;

export interface DiagramArtifact {
  id: string;
  templateId: string;
  candidatePath: string;
  sceneHash: string;
  outputHash: string;
  generatorVersion: typeof DIAGRAM_GENERATOR_VERSION;
  sceneReviewStatus: DiagramScene["reviewStatus"];
  svg: string;
}

export interface ManifestIssue {
  code:
    | "artifact_drift"
    | "generator_version_mismatch"
    | "missing_entry"
    | "missing_public_asset"
    | "public_asset_drift"
    | "scene_not_approved"
    | "unapproved_public_asset"
    | "unexpected_entry";
  id: string;
  message: string;
}

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value === "boolean" || typeof value === "string") {
    return JSON.stringify(value);
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError("Canonical JSON cannot contain non-finite numbers");
    }
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(
      ([left], [right]) => (left < right ? -1 : left > right ? 1 : 0),
    );
    return `{${entries
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${canonicalJson(entryValue)}`)
      .join(",")}}`;
  }
  throw new TypeError(`Canonical JSON does not support ${typeof value}`);
}

export function hashContent(content: string): string {
  return `sha256:${createHash("sha256").update(content, "utf8").digest("hex")}`;
}

export function reconcileManifestEntry(input: {
  previous?: DiagramManifestEntry;
  artifact: DiagramArtifact;
}): DiagramManifestEntry {
  const { previous, artifact } = input;
  const identityMatches =
    previous?.id === artifact.id &&
    previous.templateId === artifact.templateId &&
    previous.candidatePath === artifact.candidatePath &&
    previous.sceneHash === artifact.sceneHash &&
    previous.outputHash === artifact.outputHash &&
    previous.generatorVersion === artifact.generatorVersion;
  const mayPreserveApproval =
    identityMatches &&
    previous.reviewStatus === "approved" &&
    artifact.sceneReviewStatus === "approved";

  return diagramManifestEntrySchema.parse({
    id: artifact.id,
    templateId: artifact.templateId,
    candidatePath: artifact.candidatePath,
    sceneHash: artifact.sceneHash,
    outputHash: artifact.outputHash,
    generatorVersion: artifact.generatorVersion,
    reviewStatus: mayPreserveApproval ? "approved" : "needs_review",
    reviewedAt: mayPreserveApproval ? previous.reviewedAt : null,
  });
}

export function approveManifestEntry(input: {
  entry: DiagramManifestEntry;
  reviewedAt: string;
  sceneReviewStatus: DiagramScene["reviewStatus"];
}): DiagramManifestEntry {
  if (input.sceneReviewStatus !== "approved") {
    throw new Error("The Scene must be approved before its output can be approved");
  }
  return diagramManifestEntrySchema.parse({
    ...input.entry,
    reviewStatus: "approved",
    reviewedAt: input.reviewedAt,
  });
}

export function validateManifestAgainstArtifacts(input: {
  manifest: DiagramManifest;
  artifacts: readonly DiagramArtifact[];
}): ManifestIssue[] {
  const issues: ManifestIssue[] = [];
  const entriesById = new Map(input.manifest.items.map((entry) => [entry.id, entry]));
  const artifactsById = new Map(input.artifacts.map((artifact) => [artifact.id, artifact]));

  for (const artifact of input.artifacts) {
    const entry = entriesById.get(artifact.id);
    if (!entry) {
      issues.push({
        code: "missing_entry",
        id: artifact.id,
        message: `${artifact.id} is missing from the diagram manifest`,
      });
      continue;
    }
    if (entry.generatorVersion !== artifact.generatorVersion) {
      issues.push({
        code: "generator_version_mismatch",
        id: artifact.id,
        message: `${artifact.id} generator version does not match`,
      });
    }
    if (
      entry.templateId !== artifact.templateId ||
      entry.candidatePath !== artifact.candidatePath ||
      entry.sceneHash !== artifact.sceneHash ||
      entry.outputHash !== artifact.outputHash
    ) {
      issues.push({
        code: "artifact_drift",
        id: artifact.id,
        message: `${artifact.id} scene or output hash has drifted`,
      });
    }
    if (
      entry.reviewStatus === "approved" &&
      artifact.sceneReviewStatus !== "approved"
    ) {
      issues.push({
        code: "scene_not_approved",
        id: artifact.id,
        message: `${artifact.id} output is approved but its Scene is not`,
      });
    }
  }

  for (const entry of input.manifest.items) {
    if (!artifactsById.has(entry.id)) {
      issues.push({
        code: "unexpected_entry",
        id: entry.id,
        message: `${entry.id} has a manifest entry but no Scene artifact`,
      });
    }
  }

  return issues;
}
