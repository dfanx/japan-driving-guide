import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import { officialSignAssets } from "../../../src/lib/content/essential-signs";
import {
  NPA_FLASHING_RED_ASSET,
  NPA_FLASHING_YELLOW_ASSET,
  NPA_GREEN_RIGHT_ARROW_ASSET,
  type LoadedOfficialVisualAsset,
} from "./official-assets";

export interface LoadedReferenceAsset {
  id: string;
  sourceId: string;
  authority: string;
  dataUri: string;
  provenance: unknown;
}

const signalAssets = [
  NPA_GREEN_RIGHT_ARROW_ASSET,
  NPA_FLASHING_RED_ASSET,
  NPA_FLASHING_YELLOW_ASSET,
] satisfies readonly LoadedOfficialVisualAsset[];

function loadPublicAsset(metadata: (typeof officialSignAssets)[number]): LoadedReferenceAsset {
  const path = new URL(`../../../public/${metadata.assetPath.slice(1)}`, import.meta.url);
  const bytes = readFileSync(path);
  const hash = `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
  if (hash !== metadata.assetSha256) throw new Error(`${metadata.id} public reference bytes drifted`);
  const extension = metadata.assetPath.split(".").at(-1);
  const mime = extension === "jpg" ? "jpeg" : extension;
  return Object.freeze({
    id: metadata.id,
    sourceId: metadata.sourceId,
    authority: metadata.authority,
    dataUri: `data:image/${mime};base64,${bytes.toString("base64")}`,
    provenance: metadata,
  });
}

const referenceAssets: readonly LoadedReferenceAsset[] = Object.freeze([
  ...signalAssets.map((asset) => ({
    id: asset.id,
    sourceId: asset.sourceId,
    authority: asset.authority,
    dataUri: asset.dataUri,
    provenance: asset,
  })),
  ...officialSignAssets.map(loadPublicAsset),
]);
const byId = new Map(referenceAssets.map((asset) => [asset.id, asset]));

export function getReferenceAssets(ids: readonly string[]): LoadedReferenceAsset[] {
  return ids.map((id) => {
    const asset = byId.get(id);
    if (!asset) throw new Error(`Unknown official reference asset ${id}`);
    return asset;
  });
}

export function referenceAssetProvenance(ids: readonly string[]): unknown[] {
  return getReferenceAssets(ids).map((asset) => asset.provenance);
}
