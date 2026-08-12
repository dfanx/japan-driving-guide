import { expect, test } from "@playwright/test";

const configuredBase = process.env.TEST_BASE_PATH;
const base = configuredBase === "/"
  ? "/"
  : `/${(configuredBase || "/japan-driving-guide/").replace(/^\/+|\/+$/g, "")}/`;

test.skip(!configuredBase || configuredBase === "/", "F022 requires an explicit project-base build");

test("@f022 project Pages base path preserves routes and static assets", async ({ page }) => {
  await page.goto(base);
  const zhEntry = page.getByRole("link", { name: /繁體中文/ });
  await expect(zhEntry).toHaveAttribute("href", `${base}zh-TW/`);
  await zhEntry.click();
  await expect(page).toHaveURL(new RegExp(`${base.replaceAll("/", "\\/")}zh-TW/$`));

  const learn = page.getByRole("link", { name: "查看 16 課目錄" });
  await expect(learn).toHaveAttribute("href", `${base}zh-TW/learn/`);
  await learn.click();
  await expect(page.locator(".lesson-card-grid > li")).toHaveCount(16);

  await page.goto(`${base}zh-TW/learn/signs/`);
  await expect(page.locator(".sign-card img")).toHaveCount(10);
  expect(
    await page.locator(".sign-card img").evaluateAll((images) =>
      images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0),
    ),
  ).toBe(true);

  await page.goto(`${base}zh-TW/learn/signals/`);
  const diagram = page.locator('img[src$="/diagrams/D002.svg"]');
  await expect(diagram).toBeVisible();
  expect(await diagram.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});
