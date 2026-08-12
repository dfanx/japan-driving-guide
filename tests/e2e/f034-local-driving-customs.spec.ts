import { expect, test } from "@playwright/test";

test("@f034 affected lessons teach customs with explicit safety boundaries", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const [path, marker] of [
    ["/zh-TW/learn/intersections/", "進路口前選好，通過時先別換"],
    ["/zh-TW/learn/speed/", "沒有「速限正負 15」這條默契"],
    ["/zh-TW/learn/rail-crossings/", "每一台車，都要自己停一次、看一次"],
    ["/zh-TW/learn/parking/", "雙黃燈是提醒，不是通行證"],
    ["/zh-TW/learn/expressways/", "塞車匯流，一台接一台"],
    ["/zh-TW/learn/safety-basics/", "雙黃燈閃兩下，可能是在說謝謝"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: marker })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow, path).toBe(false);
  }
});
