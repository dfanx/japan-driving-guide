import { expect, test } from "@playwright/test";

const localeCases = [
  {
    locale: "zh-TW",
    path: "/zh-TW/learn/signals/",
    heading: "紅黃綠燈與箭頭",
    scenario: "紅燈、路口沒車，現在怎麼做",
    previous: "上一課",
    next: "下一課",
    alternateLabel: "EN",
    alternatePath: "/en/learn/signals/",
  },
  {
    locale: "en",
    path: "/en/learn/signals/",
    heading: "Traffic Lights and Arrows",
    scenario: "Red light, empty junction—what now",
    previous: "Previous lesson",
    next: "Next lesson",
    alternateLabel: "中",
    alternatePath: "/zh-TW/learn/signals/",
  },
] as const;

for (const localeCase of localeCases) {
  test(`@f020 ${localeCase.locale} connects the approved vertical slice`, async ({
    page,
  }) => {
    await page.goto(localeCase.path);

    await expect(page.locator("html")).toHaveAttribute("lang", localeCase.locale);
    await expect(
      page.getByRole("heading", { level: 1, name: localeCase.heading }),
    ).toBeVisible();

    const lesson = page.locator("[data-lesson-id='M02-signals']");
    await expect(lesson).toHaveAttribute(
      "data-rule-id",
      "JP-RULE-SIGNAL-RED-001",
    );
    await expect(lesson).toHaveAttribute("data-diagram-id", "D002");
    await expect(lesson).not.toHaveAttribute("data-question-id");

    const diagram = page.getByTestId("lesson-diagram");
    await expect(diagram).toBeVisible();
    await expect(diagram).toHaveAttribute("src", "/diagrams/D002.svg");
    const imageState = await diagram.evaluate((image: HTMLImageElement) => ({
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
    }));
    expect(imageState.complete).toBe(true);
    expect(imageState.naturalWidth).toBeGreaterThan(0);
    expect(imageState.naturalHeight).toBeGreaterThan(0);
    expect(imageState.naturalWidth / imageState.naturalHeight).toBe(1.5);

    await expect(page.getByRole("heading", { name: localeCase.scenario })).toBeVisible();
    await expect(page.getByRole("link", { name: new RegExp(localeCase.previous) })).toBeVisible();
    await expect(page.getByRole("link", { name: new RegExp(localeCase.next) })).toBeVisible();
    await expect(page.locator("[data-quiz-session], [data-full-review]")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: localeCase.alternateLabel, exact: true }),
    ).toHaveAttribute("href", localeCase.alternatePath);
  });
}

test("@f020 @f030 360px lesson keeps the diagram and lesson paging readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/signals/");

  const layout = await page.evaluate(() => {
    const diagram = document.querySelector<HTMLElement>(
      "[data-testid='lesson-diagram']",
    );
    const main = document.querySelector<HTMLElement>("main");
    const pagination = document.querySelector<HTMLElement>(".lesson-pagination");
    if (!diagram || !main || !pagination) throw new Error("F030 elements are missing");

    return {
      viewportWidth: document.documentElement.clientWidth,
      contentWidth: document.documentElement.scrollWidth,
      diagramWidth: diagram.getBoundingClientRect().width,
      mainWidth: main.getBoundingClientRect().width,
      paginationColumns: getComputedStyle(pagination).gridTemplateColumns.split(" ").length,
    };
  });

  expect(layout.contentWidth).toBe(layout.viewportWidth);
  expect(layout.diagramWidth).toBeGreaterThanOrEqual(250);
  expect(layout.diagramWidth).toBeLessThanOrEqual(layout.mainWidth);
  expect(layout.paginationColumns).toBe(1);
  await expect(page.locator("#D002-caption")).toBeVisible();
  await expect(page.locator("[data-quiz-session]")).toHaveCount(0);
});
