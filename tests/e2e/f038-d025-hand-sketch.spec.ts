import { expect, test } from "@playwright/test";

test("@f038 D025 publishes the hand-sketched lane logic and right indicator", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/intersections/");

  const pair = page.locator('[data-paired-diagram-id="D025"]');
  await expect(pair).toBeVisible();
  const src = await pair.locator('img[src*="D025.svg"]').getAttribute("src");
  const svg = await (await page.request.get(src!)).text();
  expect(svg.match(/data-road-layout="straight-and-right-turn-lanes"/g)?.length).toBe(3);
  expect(svg.match(/data-indicator="right"/g)?.length).toBe(3);
  expect(svg.match(/data-turn-lane="right"/g)?.length).toBe(3);
  await expect(pair).toHaveJSProperty("scrollWidth", await pair.evaluate((node) => node.clientWidth));
});
