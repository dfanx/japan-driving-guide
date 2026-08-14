import { expect, test } from "@playwright/test";

test("@f035 audited visitor tips remain readable on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const [path, marker] of [
    ["/zh-TW/learn/signals/", "綠燈右轉，先分清三個時機"],
    ["/zh-TW/learn/stop-signs/", "法規沒有「一定停滿 3 秒」"],
    ["/zh-TW/learn/intersections/", "別用「實線都不能跨」硬背"],
    ["/zh-TW/learn/speed/", "超太多，不是繳藍單就結束"],
    ["/zh-TW/learn/parking/", "先認設備，再付款"],
    ["/zh-TW/learn/expressways/", "Smart IC 是另一套規則"],
    ["/zh-TW/learn/fuel/", "用現金，拿完收據先別走"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByText(marker, { exact: false }).first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow, path).toBe(false);
  }
});
