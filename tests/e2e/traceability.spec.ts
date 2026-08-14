import { expect, test } from "@playwright/test";

for (const localeCase of [
  {
    locale: "zh-TW",
    heading: "資料來源與內容驗證",
    alternate: "/en/sources/",
    footer: "資料來源與內容驗證",
  },
  {
    locale: "en",
    heading: "Sources and content verification",
    alternate: "/zh-TW/sources/",
    footer: "Sources & verification",
  },
] as const) {
  test(`@f021 ${localeCase.locale} traceability route exposes full evidence`, async ({ page }) => {
    await page.goto(`/${localeCase.locale}/sources/`);
    await expect(page.locator("html")).toHaveAttribute("lang", localeCase.locale);
    await expect(page.getByRole("heading", { level: 1, name: localeCase.heading })).toBeVisible();
    await expect(page.locator(".source-entry")).toHaveCount(40);
    await expect(page.locator(".classification-card")).toHaveCount(3);
    await expect(page.locator(".classification-card li")).toHaveCount(57);
    await expect(page.locator('time[datetime="2026-08-10"]')).toHaveCount(21);
    await expect(page.locator('time[datetime="2026-08-12"]')).toHaveCount(8);
    await expect(page.locator('time[datetime="2026-08-14"]')).toHaveCount(7);
    await expect(page.locator(".locale-status a").filter({ hasText: localeCase.locale === "en" ? "中" : "EN" })).toHaveAttribute("href", localeCase.alternate);

    await page.goto(`/${localeCase.locale}/learn/`);
    await expect(page.getByRole("link", { name: localeCase.footer, exact: true })).toHaveAttribute(
      "href",
      `/${localeCase.locale}/sources/`,
    );
  });
}

test("@f021 traceability remains usable at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/sources/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
  await expect(page.locator(".traceability-stats")).toHaveCSS("grid-template-columns", /.+ .+/);
  const footerLink = page.getByRole("link", { name: "資料來源與內容驗證", exact: true });
  expect((await footerLink.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});
