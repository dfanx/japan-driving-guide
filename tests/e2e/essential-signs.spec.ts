import { expect, test } from "@playwright/test";

for (const locale of ["zh-TW", "en"] as const) {
  test(`@f009 ${locale} Essential Signs uses the same official asset set`, async ({ page }) => {
    await page.goto(`/${locale}/learn/signs/`);
    await expect(page.locator("[data-essential-signs]")).toBeVisible();
    await expect(page.locator("[data-sign-id]")).toHaveCount(10);
    await expect(page.locator("img[data-asset-id]")).toHaveCount(10);
    await expect(page.locator('[data-sign-id="SIGN-ETC-ONLY"]')).toContainText(
      locale === "en" ? "prohibit reposting" : "不允許轉載",
    );

    const imageFailures = await page.locator("img[data-asset-id]").evaluateAll((images) =>
      images.filter((image) => !(image instanceof HTMLImageElement) || !image.complete || image.naturalWidth === 0).length,
    );
    expect(imageFailures).toBe(0);
  });
}

test("@f009 Essential Signs remains contained at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await page.goto("/zh-TW/learn/signs/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const cardLayout = await page.locator(".sign-card").first().evaluate((card) => ({
    columns: getComputedStyle(card).gridTemplateColumns.split(" ").length,
    right: card.getBoundingClientRect().right,
    viewport: document.documentElement.clientWidth,
  }));
  expect(cardLayout.columns).toBe(1);
  expect(cardLayout.right).toBeLessThanOrEqual(cardLayout.viewport);
});
