import { expect, test } from "@playwright/test";

test("@f037 D025 keeps all three concrete guide-strip panels legible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/intersections/");

  const pair = page.locator('[data-paired-diagram-id="D025"]');
  await expect(pair).toBeVisible();
  const svg = await pair.locator('img[src*="D025.svg"]').getAttribute("src");
  expect(svg).toBeTruthy();
  const markup = await (await page.request.get(svg!)).text();
  expect(markup).toContain('data-panel="white-guide-strip"');
  expect(markup).toContain('data-panel="entry-prohibited"');
  expect(markup).toContain('data-panel="vehicle-conflict"');
  expect(markup.match(/data-turn-lane="right"/g)?.length).toBe(3);
  await expect(pair).toHaveJSProperty("scrollWidth", await pair.evaluate((node) => node.clientWidth));
});
