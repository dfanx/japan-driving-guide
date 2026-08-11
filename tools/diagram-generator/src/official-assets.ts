import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { z } from "astro/zod";

const sha256Schema = z.string().regex(/^sha256:[0-9a-f]{64}$/);

export const officialVisualAssetMetadataSchema = z
  .object({
    id: z.string().regex(/^[A-Z0-9-]+$/),
    kind: z.enum(["traffic_light", "road_sign", "road_marking"]),
    state: z.enum(["red", "yellow", "green", "green_right_arrow", "flashing_red", "flashing_yellow"]).optional(),
    sourceId: z.string().regex(/^S\d{2}$/),
    authority: z.string().trim().min(1),
    sourceUrl: z.url({ protocol: /^https$/ }),
    termsUrl: z.url({ protocol: /^https$/ }),
    license: z.string().trim().min(1),
    retrievedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    sourceDocumentSha256: sha256Schema,
    sourcePage: z.number().int().positive(),
    sourceObject: z.string().trim().min(1),
    assetPath: z.string().regex(/^[a-z0-9-]+\.(?:png|jpg)$/),
    assetSha256: sha256Schema,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    transformation: z.string().trim().min(1),
    attribution: z.string().trim().min(1),
  })
  .strict();

export type OfficialVisualAssetMetadata = z.infer<
  typeof officialVisualAssetMetadataSchema
>;

export interface LoadedOfficialVisualAsset extends OfficialVisualAssetMetadata {
  dataUri: string;
}

function hashBytes(bytes: Buffer): string {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}

function loadOfficialAsset(metadataFile: string): LoadedOfficialVisualAsset {
  const metadataUrl = new URL(
    `../assets/official/npa/${metadataFile}`,
    import.meta.url,
  );
  const metadata = officialVisualAssetMetadataSchema.parse(
    JSON.parse(readFileSync(metadataUrl, "utf8")),
  );
  const assetUrl = new URL(
    `../assets/official/npa/${metadata.assetPath}`,
    import.meta.url,
  );
  const bytes = readFileSync(assetUrl);
  const actualHash = hashBytes(bytes);
  if (actualHash !== metadata.assetSha256) {
    throw new Error(
      `${metadata.id} asset checksum mismatch: expected ${metadata.assetSha256}, received ${actualHash}`,
    );
  }
  const isPng = metadata.assetPath.endsWith(".png");
  const isJpeg = metadata.assetPath.endsWith(".jpg");
  if ((isPng && bytes.toString("hex", 0, 8) !== "89504e470d0a1a0a") || (isJpeg && bytes.toString("hex", 0, 2) !== "ffd8")) {
    throw new Error(`${metadata.id} bytes do not match the declared image format`);
  }
  if (isPng && (bytes.readUInt32BE(16) !== metadata.width || bytes.readUInt32BE(20) !== metadata.height)) {
    throw new Error(`${metadata.id} dimensions do not match the provenance record`);
  }

  return Object.freeze({
    ...metadata,
    dataUri: `data:image/${isPng ? "png" : "jpeg"};base64,${bytes.toString("base64")}`,
  });
}

export const NPA_RED_TRAFFIC_LIGHT_ASSET = loadOfficialAsset(
  "traffic-light-red.json",
);
export const NPA_GREEN_RIGHT_ARROW_ASSET = loadOfficialAsset("traffic-light-green-right-arrow.json");
export const NPA_FLASHING_RED_ASSET = loadOfficialAsset("traffic-light-flashing-red.json");
export const NPA_FLASHING_YELLOW_ASSET = loadOfficialAsset("traffic-light-flashing-yellow.json");

export function officialAssetProvenance(
  asset: LoadedOfficialVisualAsset,
): OfficialVisualAssetMetadata {
  const { dataUri: _dataUri, ...metadata } = asset;
  return metadata;
}
