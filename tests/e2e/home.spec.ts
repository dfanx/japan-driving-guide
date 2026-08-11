import { expect, test } from "@playwright/test";

test("@smoke loads the base learning shell", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Japan Driving Guide");
  await expect(
    page.getByRole("heading", { level: 1, name: "Japan Driving Guide" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /繁體中文/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /English/ })).toBeVisible();
  await expect(page.getByTestId("app-header")).toBeVisible();
  await expect(page.getByTestId("learning-shell")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
