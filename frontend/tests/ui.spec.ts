import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const screens = [
  ["landing", "/", "A direction to explore."],
  ["login", "/sign-in", "Welcome back."],
  ["register", "/create-account", "Create an account."],
  ["recovery", "/password-recovery", "Reset your password."],
  ["verify", "/check-email", "Check your email."],
  ["dashboard", "/preview/dashboard", "Your next step is here."],
  ["entry", "/preview/welcome", "How would you like to begin?"],
  ["discovery", "/preview/discovery", "What kinds of work interest you?"],
  ["results", "/preview/results", "Careers to explore."],
  ["catalog", "/preview/careers", "Find a direction worth exploring."],
  [
    "roadmap",
    "/preview/roadmaps/frontend?topic=semantic-html",
    "Frontend Developer",
  ],
  ["profile", "/preview/settings/profile", "Your profile."],
  ["account", "/preview/settings/account", "Account and security"],
  ["components", "/preview/components", "One visual language."],
];

for (const [name, path, heading] of screens) {
  test(`${name}: render, reflow, browser errors and automated accessibility`, async ({
    page,
  }, testInfo) => {
    const browserErrors: string[] = [];
    const featureRequests: string[] = [];
    page.on("pageerror", (error) => browserErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") browserErrors.push(message.text());
    });
    page.on("request", (request) => {
      const pathname = new URL(request.url()).pathname;
      if (pathname.startsWith("/api/") || pathname.startsWith("/auth/v1/"))
        featureRequests.push(request.url());
    });
    await page.goto(path);
    await expect(
      page.getByRole("heading", { name: heading, exact: name !== "landing" }),
    ).toBeVisible();
    await expect(page.locator("body")).not.toContainText(
      "Unexpected Application Error",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((item) => ({
          id: item.id,
          nodes: item.nodes.map((node) => node.target),
        })),
      ),
    ).toEqual([]);
    expect(browserErrors).toEqual([]);
    expect(featureRequests).toEqual([]);
    await page.screenshot({
      path: testInfo.outputPath(`${name}.png`),
      fullPage: true,
    });
  });
}

test("catalog retains filters through roadmap details and topic close restores focus", async ({
  page,
}) => {
  await page.goto("/preview/careers");
  await page.getByRole("searchbox").fill("HTML");
  await expect(
    page.getByRole("heading", { name: "Frontend Developer", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "View roadmap for Frontend Developer" })
    .click();
  const topic = page.getByRole("button", { name: /Semantic HTML/ });
  await topic.click();
  await expect(
    page.getByRole("heading", { name: "Semantic HTML", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Close topic details" }).click();
  await expect(topic).toBeFocused();
  await page.getByRole("link", { name: "Back to catalog" }).click();
  await expect(page.getByRole("searchbox")).toHaveValue("HTML");
  await page.getByRole("searchbox").fill("no-matching-role");
  await expect(
    page.getByRole("heading", { name: "No matching careers" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(
    page.getByRole("link", { name: /^View roadmap for/ }),
  ).toHaveCount(7);
});

test("Discovery choices, correction, exclusivity and discard are presentational", async ({
  page,
}) => {
  await page.goto("/preview/welcome");
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
  await page.getByRole("radio", { name: /Guided Discovery/ }).check();
  await page.getByRole("link", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox", { name: /Creating useful tools/ }).check();
  await page.getByRole("checkbox", { name: /I'm not sure yet/ }).check();
  await expect(
    page.getByRole("checkbox", { name: /Creating useful tools/ }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("checkbox", { name: /I'm not sure yet/ }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  for (let round = 2; round <= 3; round++) {
    await page.getByRole("checkbox", { name: /I'm not sure yet/ }).check();
    await page.getByRole("button", { name: "Next", exact: true }).click();
  }
  await page.getByRole("checkbox", { name: /I'm new to technology/ }).check();
  await page
    .getByRole("checkbox", { name: /I have experience with technology/ })
    .check();
  await expect(
    page.getByRole("checkbox", { name: /I'm new to technology/ }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("radio", { name: /Start learning/ }).check();
  await expect(
    page.getByRole("button", { name: "See suggestions" }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "View sample results layout" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Stay on this page" }).click();
  await expect(
    page.getByRole("radio", { name: /Start learning/ }),
  ).toBeChecked();
  await page.getByRole("link", { name: "View sample results layout" }).click();
  await page.getByRole("button", { name: "Discard and leave" }).click();
  await expect(
    page.getByRole("heading", { name: "Careers to explore." }),
  ).toBeVisible();
});

test("profile has no fake saves and guards unsaved input", async ({ page }) => {
  await page.goto("/preview/settings/profile");
  await page
    .getByRole("textbox", { name: "First name", exact: true })
    .fill("Preview input");
  await expect(
    page.getByRole("button", { name: "Save profile", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("navigation", { name: "Settings sections" })
    .getByRole("link", { name: "Account and security" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("textbox", { name: "First name", exact: true }),
  ).toHaveValue("Preview input");
  await page
    .getByRole("navigation", { name: "Settings sections" })
    .getByRole("link", { name: "Account and security" })
    .click();
  await page.getByRole("button", { name: "Discard and leave" }).click();
  await expect(
    page.getByRole("button", { name: "Delete account", exact: true }),
  ).toBeDisabled();
});

test("dialog Escape, focus return, tabs and menu work by keyboard", async ({
  page,
}) => {
  await page.goto("/preview/components");
  const trigger = page.getByRole("button", { name: "Open example dialog" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.getByRole("tab", { name: "Empty", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("heading", { name: "Loading roadmap" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Account menu" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("menuitem", { name: "Edit profile", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Account menu" }),
  ).toBeFocused();
  if ((page.viewportSize()?.width ?? 1440) < 832) {
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Dashboard" })
      .focus();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Menu", exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
  }
});

test("review states, progress filter, calendar and password visibility work", async ({
  page,
}) => {
  await page.goto("/preview/dashboard");
  await page.getByRole("button", { name: "Previous month" }).click();
  await expect(
    page.getByRole("heading", { name: "September 2026" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Next month" }).click();
  await page.getByRole("button", { name: "Dismiss preview guidance" }).click();
  await expect(
    page.getByRole("link", { name: "Open Discovery", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("combobox", { name: "Review layout state" })
    .selectOption("error");
  await expect(
    page.getByRole("heading", { name: "We could not load learning activity" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Show sample content" }).click();
  await page.goto("/preview/roadmaps/frontend");
  await page.getByRole("checkbox", { name: "Hide completed" }).check();
  await expect(
    page.getByRole("button", { name: /How the web works/ }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /Accessible, responsive pages/ }),
  ).toBeVisible();
  await page.goto("/sign-in");
  await page
    .getByRole("button", { name: "Show password", exact: true })
    .click();
  await expect(page.getByLabel("Password", { exact: true })).toHaveAttribute(
    "type",
    "text",
  );
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeDisabled();
});
