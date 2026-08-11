import { expect, test } from "@playwright/test";

test("@f027 Fast Track exposes ten high-risk visitor mistakes", async ({ page }) => {
  await page.goto("/zh-TW/fast-track/");

  await expect(page.locator("[data-fast-track-items] > li")).toHaveCount(10);
  await expect(page.getByText("駐車禁止和駐停車禁止不一樣")).toBeVisible();
  await expect(page.getByText("高速公路錯過出口，去下一個")).toBeVisible();
  await expect(page.getByText("小擦撞也要打 110")).toBeVisible();
});

test("@f027 parking lesson compares both official signs and related limits", async ({ page }) => {
  await page.goto("/zh-TW/learn/parking/");

  const parkingSign = page.locator('[data-sign-id="SIGN-PARKING-RESTRICTIONS"]');
  await expect(parkingSign.locator("img")).toHaveCount(2);
  await expect(parkingSign.getByText("紅色 X：駐停車禁止")).toBeVisible();
  await expect(parkingSign.getByText("一條斜線：駐車禁止")).toBeVisible();
  await expect(page.getByText("兩分鐘和雙黃燈都不是護身符")).toBeVisible();
  await expect(page.getByText("先記 5 公尺、10 公尺")).toBeVisible();
  await expect(page.locator('[data-rule-id="JP-RULE-PARKING-SIGN-DISTINCTION-001"]')).toBeVisible();
  await expect(page.locator('[data-rule-id="JP-RULE-PARKING-CLEAR-ZONES-001"]')).toBeVisible();
});

test("@f027 safety lesson covers phone, all-seat belts and child restraints", async ({ page }) => {
  await page.goto("/zh-TW/learn/safety-basics/");

  await expect(page.getByText("手機和導航，車在動就別碰")).toBeVisible();
  await expect(page.getByText("前後座都要繫，孩子先準備座椅")).toBeVisible();
  await expect(page.getByText(/未滿 6 歲兒童原則上要用/)).toBeVisible();
  await expect(page.locator('[data-rule-id="JP-RULE-DISTRACTED-DRIVING-001"]')).toBeVisible();
  await expect(page.locator('[data-rule-id="JP-RULE-SEATBELT-ALL-001"]')).toBeVisible();
  await expect(page.locator('[data-rule-id="JP-RULE-CHILD-SEAT-001"]')).toBeVisible();
});

test("@f027 Fast Track and parking lesson do not overflow at 360px", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const path of ["/zh-TW/fast-track/", "/zh-TW/learn/parking/"]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(360);
  }
});
