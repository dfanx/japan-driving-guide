import { expect, test } from "@playwright/test";

test("@f036 D025 teaches the corrected guide-strip distinction at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/intersections/");

  await expect(page.getByRole("heading", { name: "白色導流帶可以跨，但黃框禁止區不能進" })).toBeVisible();
  const pair = page.locator('[data-paired-diagram-id="D025"]');
  await expect(pair).toHaveCount(1);
  await expect(pair.locator('[data-visual-kind="user-supplied-context-photo"] img')).toBeVisible();

  const diagram = pair.locator('[data-visual-kind="deterministic-diagram"] img');
  await expect(diagram).toBeVisible();
  const svg = await diagram.evaluate(async (image: HTMLImageElement) => fetch(image.src).then((response) => response.text()));
  expect(svg).toContain('data-guide-strip="crossable-white"');
  expect(svg).toContain('data-entry-prohibited="yellow-bordered"');
  expect(svg).toContain('data-risk="vehicle-in-hatching"');
  expect(svg).toContain('data-turn-lane="right"');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
});
