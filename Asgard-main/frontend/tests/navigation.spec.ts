import { expect, test } from "@playwright/test";

test("public account entry has one flow and retired Preview addresses are unavailable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /UI preview/i })).toHaveCount(0);
  await page
    .getByRole("link", { name: "Get started", exact: true })
    .first()
    .click();
  await expect(
    page.getByLabel("Confirm password", { exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "autocomplete",
    "new-password",
  );
  await page
    .getByRole("button", { name: "Show password", exact: true })
    .click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("link", { name: "Return to sign-in" }).click();
  await page.getByRole("link", { name: "Forgot your password?" }).click();
  await expect(
    page.getByRole("button", { name: "Send recovery instructions" }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Return to sign-in" }).click();
  for (const path of [
    "/preview",
    "/preview/dashboard",
    "/preview/settings/profile",
    "/preview/components",
  ]) {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: "Page unavailable" }),
    ).toBeVisible();
  }
});
