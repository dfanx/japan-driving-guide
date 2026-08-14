import { expect, test } from "@playwright/test";

const slugs = [
  "eligibility",
  "left-side-driving",
  "signals",
  "stop-signs",
  "intersections",
  "pedestrians",
  "cyclists",
  "speed",
  "rail-crossings",
  "signs",
  "parking",
  "expressways",
  "fuel",
  "weather",
  "emergency",
  "safety-basics",
] as const;

test("@f026 every bilingual lesson loads a relevant visual", async ({ page }) => {
  for (const locale of ["zh-TW", "en"] as const) {
    for (const slug of slugs) {
      await page.goto(`/${locale}/learn/${slug}/`);
      const section = page.locator("[data-lesson-visuals]");
      await expect(section, `${locale}/${slug}`).toBeVisible();
      expect(await section.locator("[data-lesson-visual]").count(), `${locale}/${slug}`).toBeGreaterThan(0);
      const imageAudit = await section.locator("img").evaluateAll((elements) =>
        elements.map((element) => {
          const image = element as HTMLImageElement;
          return {
            alt: image.getAttribute("alt")?.trim(),
            complete: image.complete,
            width: image.naturalWidth,
            height: image.naturalHeight,
          };
        }),
      );
      expect(imageAudit.length, `${locale}/${slug}`).toBeGreaterThan(0);
      expect(
        imageAudit.every((image) => image.alt && image.complete && image.width > 0 && image.height > 0),
        `${locale}/${slug}`,
      ).toBe(true);
    }
  }
});

test("@f026 relevant lessons show exact official signs and honest ETC fallback", async ({ page }) => {
  await page.goto("/zh-TW/learn/stop-signs/");
  await expect(page.locator('[data-sign-id="SIGN-STOP"] [data-asset-id="NPA-SIGN-STOP-BILINGUAL"]')).toBeVisible();

  await page.goto("/en/learn/expressways/");
  await expect(page.locator('[data-sign-id="SIGN-ETC-ONLY"] [data-count="link-only"]')).toBeVisible();
  await expect(page.locator('[data-sign-id="SIGN-NO-U-TURN"] [data-asset-id="NPA-SIGN-NO-U-TURN"]')).toBeVisible();

  await page.goto("/zh-TW/learn/signs/");
  await expect(page.locator('[data-diagram-id="D013"]')).toBeVisible();
  await expect(page.locator('[data-diagram-id="D017"]')).toBeVisible();
  await expect(page.locator("[data-essential-signs] [data-asset-id]")).toHaveCount(10);
});

test("@f026 visual grids and official sign cards fit 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const route of [
    "/zh-TW/learn/eligibility/",
    "/zh-TW/learn/signs/",
    "/en/learn/expressways/",
    "/en/learn/weather/",
  ]) {
    await page.goto(route);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBe(360);
    await expect(page.locator("[data-lesson-visuals]")).toBeVisible();
  }
});

test("@f028 every diagram is taught as driver view then deterministic explanation", async ({ page }) => {
  const seen = new Set<string>();

  for (const locale of ["zh-TW", "en"] as const) {
    for (const slug of slugs) {
      await page.goto(`/${locale}/learn/${slug}/`);
      const pairs = page.locator("[data-scenario-pair]");
      for (let index = 0; index < (await pairs.count()); index += 1) {
        const pair = pairs.nth(index);
        const diagramId = await pair.getAttribute("data-paired-diagram-id");
        expect(diagramId, `${locale}/${slug}`).toMatch(/^D\d{3}$/);
        await expect(
          pair.locator('[data-simulation-id] img, [data-driver-simulation] img'),
          `${locale}/${slug}/${diagramId} simulation`,
        ).toHaveCount(1);
        await expect(
          pair.locator('[data-visual-kind="deterministic-diagram"] img, [data-testid="lesson-diagram"]'),
          `${locale}/${slug}/${diagramId} diagram`,
        ).toHaveCount(1);
        if (locale === "zh-TW" && diagramId) seen.add(diagramId);
      }
    }
  }

  expect([...seen].sort()).toEqual(
    Array.from({ length: 28 }, (_, index) => `D${String(index + 1).padStart(3, "0")}`),
  );
});

test("@f028 @f030 every scenario teaches risk and action without internal production copy", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/signs/");
  await expect(page.getByText("先注意", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("建議做法", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/生成模擬|查核圖解|官方原圖/)).toHaveCount(0);
  await expect(page.locator('[data-visual-kind="generated-driver-simulation"]')).toHaveCount(5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
});

test("@f029 D006 right turn enters the eastbound left-side lane", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/intersections/");
  const diagram = page.locator('[data-diagram-id="D006"] img');
  await expect(diagram).toBeVisible();
  const svg = await diagram.evaluate(async (image: HTMLImageElement) =>
    fetch(image.src).then((response) => response.text()),
  );
  expect(svg).toContain('data-destination-lane="eastbound-left"');
  expect(svg).toContain('x1="740" x2="835" y1="335" y2="335"');
  expect(svg).not.toContain('x1="740" x2="835" y1="465" y2="465"');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
});
