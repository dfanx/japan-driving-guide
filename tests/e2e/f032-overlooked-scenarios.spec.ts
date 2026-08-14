import { expect, test } from "@playwright/test";

test("@f032 home starts the ordered course without a ten-minute option", async ({ page }) => {
  await page.goto("/zh-TW/");
  await expect(page.getByRole("link", { name: "開始第 1 課" })).toHaveAttribute("href", "/zh-TW/learn/eligibility/");
  await expect(page.getByText(/10 分鐘/)).toHaveCount(0);
});

test("@f032 affected lessons expose every new scenario pair", async ({ page }) => {
  for (const [path, ids] of [
    ["/zh-TW/learn/signals/", ["D026", "D027"]],
    ["/zh-TW/learn/intersections/", ["D007", "D025", "D028"]],
    ["/zh-TW/learn/parking/", ["D019"]],
  ] as const) {
    await page.goto(path);
    for (const id of ids) {
      const pair = page.locator(`[data-paired-diagram-id="${id}"]`);
      await expect(pair).toHaveCount(1);
      await expect(pair.locator('[data-simulation-id]')).toHaveCount(1);
      await expect(pair.locator('[data-visual-kind="deterministic-diagram"]')).toHaveCount(1);
    }
  }
});
