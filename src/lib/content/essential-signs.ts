import { z } from "astro/zod";

import assetData from "../../data/official-assets/essential-sign-assets.json";
import signData from "../../data/signs/essential-signs.json";
import { ruleCatalog } from "./catalog";

const localizedTextSchema = z.object({
  "zh-TW": z.string().min(1),
  en: z.string().min(1),
});
const sha256Schema = z.string().regex(/^sha256:[a-f0-9]{64}$/);

export const officialSignAssetSchema = z.object({
  id: z.string().regex(/^[A-Z0-9-]+$/),
  sourceId: z.string().regex(/^S\d{2}$/),
  authority: z.string().min(1),
  sourceUrl: z.url(),
  upstreamAssetUrl: z.url().nullable(),
  termsUrl: z.url(),
  license: z.string().min(1),
  retrievedAt: z.iso.date(),
  sourceDocumentSha256: sha256Schema,
  sourcePage: z.number().int().positive().nullable(),
  sourceObject: z.string().min(1),
  assetPath: z.string().regex(/^\/assets\/official\//),
  assetSha256: sha256Schema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  transformation: z.string().min(1),
  attribution: z.string().min(1),
});

export const essentialSignSchema = z.object({
  id: z.string().regex(/^SIGN-[A-Z0-9-]+$/),
  ruleId: z.string().regex(/^JP-RULE-[A-Z0-9-]+$/),
  assetIds: z.array(z.string()).max(2),
  assetLabels: z.array(localizedTextSchema).max(2).optional(),
  class: localizedTextSchema,
  title: localizedTextSchema,
  meaning: localizedTextSchema,
  action: localizedTextSchema,
  officialLink: z.url(),
  rightsNote: localizedTextSchema.optional(),
});

export type OfficialSignAsset = z.infer<typeof officialSignAssetSchema>;
export type EssentialSign = z.infer<typeof essentialSignSchema>;

export const officialSignAssets: readonly OfficialSignAsset[] = Object.freeze(
  officialSignAssetSchema.array().parse(assetData),
);
export const essentialSigns: readonly EssentialSign[] = Object.freeze(
  essentialSignSchema.array().parse(signData),
);

const assetById = new Map(officialSignAssets.map((asset) => [asset.id, asset]));
if (officialSignAssets.length !== assetById.size || essentialSigns.length !== new Set(essentialSigns.map((sign) => sign.id)).size) {
  throw new Error("Essential Sign IDs and official asset IDs must be unique");
}

for (const sign of essentialSigns) {
  const rule = ruleCatalog.find((candidate) => candidate.id === sign.ruleId);
  if (!rule || rule.category !== "signs" || rule.reviewStatus !== "approved") {
    throw new Error(`${sign.id} requires an approved signs Rule: ${sign.ruleId}`);
  }
  if (sign.assetIds.length === 0 && !sign.rightsNote) {
    throw new Error(`${sign.id} requires an official asset or an explicit rights note`);
  }
  if (sign.assetLabels && sign.assetLabels.length !== sign.assetIds.length) {
    throw new Error(`${sign.id} asset labels must match its official asset count`);
  }
  for (const assetId of sign.assetIds) {
    if (!assetById.has(assetId)) throw new Error(`${sign.id} references missing asset ${assetId}`);
  }
}

export function getOfficialAssetsForSign(sign: EssentialSign): OfficialSignAsset[] {
  return sign.assetIds.map((id) => assetById.get(id)!);
}
