import { expect, test } from "@playwright/test";

test("@f033 D020 shows a smooth expressway merge at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/expressways/");

  const pair = page.locator('[data-paired-diagram-id="D020"]');
  await expect(pair).toHaveCount(1);
  const diagram = pair.locator('[data-visual-kind="deterministic-diagram"] img');
  await expect(diagram).toBeVisible();

  const svg = await diagram.evaluate(async (image: HTMLImageElement) =>
    fetch(image.src).then((response) => response.text()),
  );
  expect(svg).toContain('data-join="tangent-horizontal"');
  expect(svg).toContain('data-taper-end="1030,490"');
  expect(svg).toContain('x1="400" x2="500" y1="650" y2="610"');
  expect(svg).not.toContain("L 560 490 C 410 620");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
});
