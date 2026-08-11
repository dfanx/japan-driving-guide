import { canonicalJson, DIAGRAM_GENERATOR_VERSION, hashContent, type DiagramArtifact } from "./manifest";
import {
  NPA_RED_TRAFFIC_LIGHT_ASSET,
  officialAssetProvenance,
} from "./official-assets";
import type { DiagramScene } from "./schema";
import { renderFourWayIntersectionTemplate, TEMPLATE_IDS } from "./templates";
import { presetTemplateId, renderPresetScene } from "./preset-renderer";
import { referenceAssetProvenance } from "./reference-assets";

export function buildDiagramArtifact(scene: DiagramScene): DiagramArtifact {
  const isFourWay = scene.template === "FourWayIntersection";
  const svg = isFourWay
    ? renderFourWayIntersectionTemplate(scene)
    : renderPresetScene(scene);
  const templateId = isFourWay
    ? TEMPLATE_IDS.FourWayIntersection
    : presetTemplateId(scene);
  const officialVisualAssets = isFourWay
    ? [officialAssetProvenance(NPA_RED_TRAFFIC_LIGHT_ASSET)]
    : referenceAssetProvenance(scene.assetIds);
  return {
    id: scene.id,
    templateId,
    candidatePath: `tools/diagram-generator/review/${scene.id}.svg`,
    sceneHash: hashContent(
      canonicalJson({
        scene,
        officialVisualAssets,
      }),
    ),
    outputHash: hashContent(svg),
    generatorVersion: DIAGRAM_GENERATOR_VERSION,
    sceneReviewStatus: scene.reviewStatus,
    svg,
  };
}
