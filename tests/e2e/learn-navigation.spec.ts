import { expect, test } from "@playwright/test";

const lessons = [
  ["eligibility", "合法駕駛文件", "Licence and documents"],
  ["left-side-driving", "靠左行駛", "Left-side driving"],
  ["signals", "紅黃綠燈與箭頭", "Traffic Lights and Arrows"],
  ["stop-signs", "停車再開", "Stop signs"],
  ["intersections", "路口與轉彎", "Intersections and turns"],
  ["pedestrians", "行人優先", "Pedestrians first"],
  ["cyclists", "自行車", "Cyclists"],
  ["speed", "速限", "Speed limits"],
  ["rail-crossings", "鐵路平交道", "Railway crossings"],
  ["signs", "必要標誌", "Essential signs"],
  ["parking", "停車", "Parking"],
  ["expressways", "高速公路與 ETC", "Expressways and ETC"],
  ["fuel", "加油", "Fuel"],
  ["weather", "雨雪與山路", "Weather and mountain roads"],
  ["emergency", "事故與故障", "Accidents and breakdowns"],
  ["safety-basics", "上路前安全底線", "Safety basics"],
] as const;

test("@f008 both Learn indexes expose all approved modules", async ({ page }) => {
  for (const [locale, heading] of [
    ["zh-TW", "日本自駕新手攻略"],
    ["en", "Learn to drive safely in Japan"],
  ] as const) {
    await page.goto(`/${locale}/learn/`);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.locator(".lesson-card-grid > li")).toHaveCount(16);
  }
});

test("@f008 every approved module has equivalent reachable locale routes", async ({
  page,
}) => {
  for (const [slug, zhTitle, enTitle] of lessons) {
    await page.goto(`/zh-TW/learn/${slug}/`);
    await expect(page.getByRole("heading", { level: 1, name: zhTitle })).toBeVisible();
    await expect(page.getByRole("link", { name: "EN", exact: true })).toHaveAttribute(
      "href",
      `/en/learn/${slug}/`,
    );

    await page.goto(`/en/learn/${slug}/`);
    await expect(page.getByRole("heading", { level: 1, name: enTitle })).toBeVisible();
    await expect(page.getByRole("link", { name: "中", exact: true })).toHaveAttribute(
      "href",
      `/zh-TW/learn/${slug}/`,
    );
  }
});

test("@f008 360px module navigation stays inside the page", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/intersections/");

  await expect(page.locator(".module-rail-list li")).toHaveCount(16);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBe(360);
  await expect(page.getByRole("link", { name: /上一課/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /下一課/ })).toBeVisible();
});

test("@f030 the curriculum ends at the full review instead of a lesson checkpoint", async ({ page }) => {
  await page.goto("/zh-TW/learn/");
  await expect(page.getByRole("link", { name: "開始上路總複習" })).toHaveAttribute(
    "href",
    "/zh-TW/review/",
  );

  await page.goto("/zh-TW/learn/safety-basics/");
  await expect(page.getByRole("link", { name: /24 題上路總複習/ })).toHaveAttribute(
    "href",
    "/zh-TW/review/",
  );
  await expect(page.locator("[data-quiz-session]")).toHaveCount(0);
});
