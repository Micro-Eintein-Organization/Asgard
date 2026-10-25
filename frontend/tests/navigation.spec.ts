import { expect, test } from "@playwright/test";

test("public entry, catalog categories, roadmap disclosure and resource navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Create an account", exact: true })
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
    .getByRole("link", { name: "Sign in", exact: true })
    .first()
    .click();
  await page.getByRole("link", { name: "Forgot your password?" }).click();
  await page.getByRole("link", { name: "Return to sign-in" }).click();
  await page.getByRole("link", { name: "Open the UI preview" }).click();
  await page.getByRole("radio", { name: /^Browse careers/ }).check();
  await page.getByRole("link", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Design & UX", exact: true }).click();
  await expect(
    page.getByRole("link", { name: /^View roadmap for/ }),
  ).toHaveCount(1);
  await page
    .getByRole("link", { name: "View roadmap for UX Designer" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "This roadmap is awaiting content review",
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "View the sample Frontend layout" })
    .click();
  await page.getByText("Read more about the work", { exact: true }).click();
  await expect(
    page.getByText("Translate designs into interfaces"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "2. Your first interactive page" })
    .click();
  await page.getByRole("button", { name: /JavaScript fundamentals/ }).click();
  await expect(
    page.getByText("Sample topic · Your first interactive page"),
  ).toBeVisible();
  const popup = page.waitForEvent("popup");
  await page
    .getByRole("link", { name: /Dynamic scripting with JavaScript/ })
    .click();
  const resource = await popup;
  await expect(resource).toHaveURL(/developer.mozilla.org/);
  await resource.close();
  await page.getByRole("button", { name: "Account menu" }).click();
  await page
    .getByRole("menuitem", { name: "Edit profile", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your profile." }),
  ).toBeVisible();
});
