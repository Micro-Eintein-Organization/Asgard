import { expect, test } from "@playwright/test";

test("browser calls the backend through the frontend proxy", async ({
  page,
}) => {
  await page.goto("/status");
  await expect(
    page.getByRole("heading", { name: "Asgard foundation" }),
  ).toBeVisible();
  await expect(page.getByText("Backend: Connected")).toBeVisible();
  await expect(page.getByText("Supabase API: Ready")).toBeVisible();
  await page.getByRole("button", { name: "Check connectivity" }).click();
  await expect(page.getByText("Backend: Connected")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("unknown paths have a recovery link", async ({ page }) => {
  await page.goto("/missing");
  await expect(
    page.getByRole("heading", { name: "Page unavailable" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Foundation status" }).click();
  await expect(page.getByText("Backend: Connected")).toBeVisible();
});
