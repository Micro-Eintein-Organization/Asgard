import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.skip(
  process.env.ASGARD_AUTH_UI_TESTS !== "1",
  "Requires the isolated Auth-enabled UI server with mocked provider/API responses.",
);

function session() {
  const user = {
    id: "1c570c66-3515-44c1-9f39-9628bb069b90",
    email: "owner@example.test",
    email_confirmed_at: "2026-01-01T00:00:00Z",
    aud: "authenticated",
    role: "authenticated",
    app_metadata: { provider: "email" },
    user_metadata: {},
    created_at: "2026-01-01T00:00:00Z",
  };
  const payload = Buffer.from(
    JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600 }),
  ).toString("base64url");
  return {
    user,
    access_token: `eyJhbGciOiJFUzI1NiJ9.${payload}.ui-fixture-signature`,
    refresh_token: "ui-fixture-refresh",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  };
}

test("guest routing, registration confirmation and code validation", async ({
  page,
}) => {
  await page.route("**/auth/v1/signup*", (route) =>
    route.fulfill({ json: { user: { id: session().user.id }, session: null } }),
  );
  await page.route("**/auth/v1/verify*", (route) =>
    route.fulfill({
      status: 400,
      json: { code: "otp_expired", msg: "The code is invalid or has expired." },
    }),
  );
  await page.goto("/settings/profile");
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goto("/create-account");
  await page.getByLabel("Email", { exact: true }).fill("owner@example.test");
  await page.getByLabel("Password", { exact: true }).fill("1234567");
  await page.getByLabel("Confirm password", { exact: true }).fill("1234567");
  await page.getByRole("button", { name: "Send email code" }).click();
  await expect(page.getByText("Use at least 8 characters.")).toBeVisible();
  await page.getByLabel("Password", { exact: true }).fill("12345678");
  await page
    .getByLabel("Confirm password", { exact: true })
    .fill("12345678");
  await page.getByRole("button", { name: "Send email code" }).click();
  await expect(page).toHaveURL(/\/check-email$/);
  await expect(
    page.getByText(
      "We sent a six-digit code to owner@example.test. Check your inbox and spam folder. If the address is wrong, edit it below and request a new code.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Didn’t get the email? You can request another code when the timer ends.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Resend code in/ }),
  ).toBeDisabled();
  await page.getByLabel("Email confirmation code").fill("123");
  await page.getByRole("button", { name: "Verify", exact: true }).click();
  await expect(page.getByText("Enter the six-digit code.")).toBeVisible();
  await page.getByLabel("Email confirmation code").fill("123456");
  await page.getByRole("button", { name: "Verify", exact: true }).click();
  await expect(
    page.getByText(
      "That code did not work or has expired. Check your latest email, or request a new code when the timer ends.",
      { exact: true },
    ),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});

test("restores session, preserves failed edits and saves explicitly", async ({
  page,
}, testInfo) => {
  const initial = session();
  await page.addInitScript(
    (value) => localStorage.setItem("sb-127-auth-token", JSON.stringify(value)),
    initial,
  );
  let profile = {
    first_name: "Ada",
    surname: "",
    version: 1,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };
  let reject = true;
  await page.route("**/api/v1/me/profile", async (route) => {
    expect(route.request().headers().authorization).toBe(
      `Bearer ${initial.access_token}`,
    );
    if (route.request().method() === "PATCH") {
      if (reject)
        return route.fulfill({
          status: 409,
          json: {
            code: "profile_conflict",
            message: "Your profile changed. Reload it before saving again.",
            request_id: "fixture",
          },
        });
      const body = route.request().postDataJSON();
      expect(body.expected_version).toBe(profile.version);
      profile = {
        ...profile,
        first_name: body.first_name,
        surname: body.surname,
        version: profile.version + 1,
      };
    }
    await route.fulfill({ json: { profile } });
  });
  await page.goto("/settings/profile");
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue(
    "Ada",
  );
  await page.getByLabel("First name", { exact: true }).fill("");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(
    page.getByText("Check the name fields below.", { exact: true }),
  ).toBeFocused();
  await page.getByLabel("First name", { exact: true }).fill("Grace");
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(page.getByText(/Your profile changed/)).toBeVisible();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue(
    "Grace",
  );
  await expect(page.getByText("Profile saved.", { exact: true })).toHaveCount(
    0,
  );
  reject = false;
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(page.getByText("Profile saved.", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("First name", { exact: true })).toHaveValue(
    "Grace",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath("authenticated-profile.png"),
    fullPage: true,
  });
});

test("logout clears the browser session and protects the profile route", async ({
  page,
}) => {
  await page.addInitScript(
    (value) => localStorage.setItem("sb-127-auth-token", JSON.stringify(value)),
    session(),
  );
  await page.route("**/api/v1/me/profile", (route) =>
    route.fulfill({ json: { profile: null } }),
  );
  await page.route("**/auth/v1/logout*", (route) =>
    route.fulfill({ status: 204 }),
  );
  await page.goto("/settings/profile");
  await expect(
    page.getByRole("heading", { name: "Your profile.", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("sb-127-auth-token")))
    .toBeNull();
});
