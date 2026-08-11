import { describe, expect, it } from "vitest";

import {
  approveManifestEntry,
  canonicalJson,
  DIAGRAM_GENERATOR_VERSION,
  DIAGRAM_MANIFEST_SCHEMA_VERSION,
  diagramManifestEntrySchema,
  hashContent,
  reconcileManifestEntry,
  validateManifestAgainstArtifacts,
  type DiagramArtifact,
  type DiagramManifestEntry,
} from "../../tools/diagram-generator/src/manifest";

const artifact: DiagramArtifact = {
  id: "D002",
  templateId: "T02",
  candidatePath: "tools/diagram-generator/review/D002.svg",
  sceneHash: `sha256:${"1".repeat(64)}`,
  outputHash: `sha256:${"2".repeat(64)}`,
  generatorVersion: DIAGRAM_GENERATOR_VERSION,
  sceneReviewStatus: "needs_review",
  svg: "<svg/>\n",
};

const approvedEntry: DiagramManifestEntry = diagramManifestEntrySchema.parse({
  id: artifact.id,
  templateId: artifact.templateId,
  candidatePath: artifact.candidatePath,
  sceneHash: artifact.sceneHash,
  outputHash: artifact.outputHash,
  generatorVersion: artifact.generatorVersion,
  reviewStatus: "approved",
  reviewedAt: "2026-08-10",
});

describe("diagram hash source", () => {
  it("canonicalizes object keys before hashing", () => {
    expect(canonicalJson({ b: 2, a: { d: 4, c: 3 } })).toBe(
      canonicalJson({ a: { c: 3, d: 4 }, b: 2 }),
    );
    expect(hashContent("same bytes")).toMatch(/^sha256:[0-9a-f]{64}$/);
    expect(hashContent("same bytes")).toBe(hashContent("same bytes"));
  });

  it("rejects values JSON cannot represent deterministically", () => {
    expect(() => canonicalJson({ invalid: Number.NaN })).toThrow("non-finite");
    expect(() => canonicalJson({ invalid: undefined })).toThrow("does not support");
  });
});

describe("manifest review transitions", () => {
  it("creates new output as needs_review", () => {
    expect(reconcileManifestEntry({ artifact })).toMatchObject({
      reviewStatus: "needs_review",
      reviewedAt: null,
    });
  });

  it("preserves approval only when every identity input is unchanged", () => {
    const approvedArtifact = { ...artifact, sceneReviewStatus: "approved" } as const;
    expect(
      reconcileManifestEntry({ previous: approvedEntry, artifact: approvedArtifact }),
    ).toEqual(approvedEntry);
  });

  it("forces needs_review when the output hash changes", () => {
    const changed = {
      ...artifact,
      outputHash: `sha256:${"3".repeat(64)}`,
      sceneReviewStatus: "approved",
    } as const;
    expect(
      reconcileManifestEntry({ previous: approvedEntry, artifact: changed }),
    ).toMatchObject({ reviewStatus: "needs_review", reviewedAt: null });
  });

  it("forces needs_review when the Scene is not approved", () => {
    expect(
      reconcileManifestEntry({ previous: approvedEntry, artifact }),
    ).toMatchObject({ reviewStatus: "needs_review", reviewedAt: null });
  });

  it("forces needs_review when the generator version changes", () => {
    const previous = { ...approvedEntry, generatorVersion: "0.9.0" };
    const approvedArtifact = { ...artifact, sceneReviewStatus: "approved" } as const;

    expect(
      reconcileManifestEntry({ previous, artifact: approvedArtifact }),
    ).toMatchObject({
      generatorVersion: DIAGRAM_GENERATOR_VERSION,
      reviewStatus: "needs_review",
      reviewedAt: null,
    });
  });

  it("refuses output approval before Scene approval", () => {
    expect(() =>
      approveManifestEntry({
        entry: { ...approvedEntry, reviewStatus: "needs_review", reviewedAt: null },
        reviewedAt: "2026-08-10",
        sceneReviewStatus: "needs_review",
      }),
    ).toThrow("Scene must be approved");
  });

  it("requires coherent review dates", () => {
    expect(
      diagramManifestEntrySchema.safeParse({
        ...approvedEntry,
        reviewStatus: "approved",
        reviewedAt: null,
      }).success,
    ).toBe(false);
    expect(
      diagramManifestEntrySchema.safeParse({
        ...approvedEntry,
        reviewStatus: "needs_review",
        reviewedAt: "2026-08-10",
      }).success,
    ).toBe(false);
  });
});

describe("manifest consistency gate", () => {
  it("reports hash drift and approved-output/unapproved-Scene mismatch", () => {
    const issues = validateManifestAgainstArtifacts({
      manifest: {
        schemaVersion: DIAGRAM_MANIFEST_SCHEMA_VERSION,
        items: [approvedEntry],
      },
      artifacts: [{ ...artifact, outputHash: `sha256:${"9".repeat(64)}` }],
    });

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "artifact_drift", id: "D002" }),
        expect.objectContaining({ code: "scene_not_approved", id: "D002" }),
      ]),
    );
  });
});
