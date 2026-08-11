import { isoDateSchema, type Rule } from "../content/schema";
import contentRelease from "../../data/content-release.json";

export const EFFECTIVE_STATUSES = ["active", "upcoming", "expired"] as const;

export type EffectiveStatus = (typeof EFFECTIVE_STATUSES)[number];
export type EffectiveWindow = Pick<Rule, "effectiveFrom" | "effectiveTo">;

function assertIsoDate(value: string, label: string): string {
  const result = isoDateSchema.safeParse(value);
  if (!result.success) {
    throw new Error(`${label} must be a real calendar date in YYYY-MM-DD format`);
  }
  return result.data;
}

export function classifyEffectiveWindow(
  window: EffectiveWindow,
  asOfDate: string,
): EffectiveStatus {
  const asOf = assertIsoDate(asOfDate, "asOfDate");

  if (window.effectiveFrom && asOf < window.effectiveFrom) return "upcoming";
  if (window.effectiveTo && asOf > window.effectiveTo) return "expired";
  return "active";
}

export function resolveContentAsOfDate(options?: {
  environment?: Readonly<Record<string, string | undefined>>;
}): string {
  const environment = options?.environment ?? process.env;
  const explicitDate = environment.CONTENT_AS_OF_DATE;

  if (explicitDate) {
    return assertIsoDate(explicitDate, "CONTENT_AS_OF_DATE");
  }

  return assertIsoDate(contentRelease.contentAsOfDate, "release contentAsOfDate");
}

export function summarizeRuleEffectivity(
  rules: readonly EffectiveWindow[],
  asOfDate: string,
): Record<EffectiveStatus, number> {
  const summary: Record<EffectiveStatus, number> = {
    active: 0,
    upcoming: 0,
    expired: 0,
  };

  for (const rule of rules) {
    summary[classifyEffectiveWindow(rule, asOfDate)] += 1;
  }

  return summary;
}
