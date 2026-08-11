import { expect, test } from "@playwright/test";

const localeCases = [
  {
    locale: "zh-TW",
    path: "/zh-TW/learn/signals/",
    heading: "紅黃綠燈與箭頭",
    prompt: "紅燈時沒有綠色箭頭",
    alternateLabel: "EN",
    alternatePath: "/en/learn/signals/",
  },
  {
    locale: "en",
    path: "/en/learn/signals/",
    heading: "Traffic Lights and Arrows",
    prompt: "At a red light with no green arrow",
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
    await expect(lesson).toHaveAttribute("data-question-id", "Q002");

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

    await expect(page.getByText(localeCase.prompt, { exact: false })).toBeVisible();
    await expect(
      page.getByRole("link", { name: localeCase.alternateLabel, exact: true }),
    ).toHaveAttribute("href", localeCase.alternatePath);
  });
}

test("@f020 360px lesson keeps the diagram and checkpoint readable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/zh-TW/learn/signals/");

  const layout = await page.evaluate(() => {
    const diagram = document.querySelector<HTMLElement>(
      "[data-testid='lesson-diagram']",
    );
    const main = document.querySelector<HTMLElement>("main");
    const options = document.querySelector<HTMLElement>(".checkpoint-options");
    if (!diagram || !main || !options) throw new Error("F020 elements are missing");

    return {
      viewportWidth: document.documentElement.clientWidth,
      contentWidth: document.documentElement.scrollWidth,
      diagramWidth: diagram.getBoundingClientRect().width,
      mainWidth: main.getBoundingClientRect().width,
      optionColumns: getComputedStyle(options).gridTemplateColumns.split(" ").length,
    };
  });

  expect(layout.contentWidth).toBe(layout.viewportWidth);
  expect(layout.diagramWidth).toBeGreaterThan(250);
  expect(layout.diagramWidth).toBeLessThanOrEqual(layout.mainWidth);
  expect(layout.optionColumns).toBe(1);
  await expect(page.locator("#D002-caption")).toBeVisible();
  await expect(page.locator("#Q002")).toBeVisible();
});
