import { describe, expect, it } from "vitest";

import { hasRequiredLocales, projectSummary } from "../../src/lib/project";

describe("project foundation", () => {
  it("keeps the two required locales in one product", () => {
    expect(hasRequiredLocales(projectSummary.locales)).toBe(true);
  });

  it("rejects an incomplete locale set", () => {
    expect(hasRequiredLocales(["zh-TW"])).toBe(false);
  });
});

