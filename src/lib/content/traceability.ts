import { ruleCatalog, sourceCatalog } from "./catalog";
import {
  CONTENT_CLASSIFICATIONS,
  type Rule,
  type Source,
} from "./schema";

export type TraceableSource = Source & {
  ruleIds: readonly string[];
};

export const rulesByClassification = Object.freeze(
  Object.fromEntries(
    CONTENT_CLASSIFICATIONS.map((classification) => [
      classification,
      Object.freeze(
        ruleCatalog.filter(
          (rule) => rule.legalOrGuidance === classification,
        ),
      ),
    ]),
  ) as Record<(typeof CONTENT_CLASSIFICATIONS)[number], readonly Rule[]>,
);

export const traceableSources: readonly TraceableSource[] = Object.freeze(
  sourceCatalog.map((source) =>
    Object.freeze({
      ...source,
      ruleIds: Object.freeze(
        ruleCatalog
          .filter((rule) => rule.sourceIds.includes(source.id))
          .map((rule) => rule.id),
      ),
    }),
  ),
);

export function reviewCoverageDate(dates: readonly string[]): string {
  if (dates.length === 0) throw new Error("Review coverage requires at least one date");
  return [...dates].sort().at(0)!;
}

export const traceabilityDates = Object.freeze({
  sourcesCheckedThrough: reviewCoverageDate(
    sourceCatalog.map((source) => source.checkedAt),
  ),
  rulesVerifiedThrough: reviewCoverageDate(
    ruleCatalog.map((rule) => rule.verifiedAt),
  ),
});
