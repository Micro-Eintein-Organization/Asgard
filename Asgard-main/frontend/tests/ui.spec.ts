import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const screens = [
  ["landing", "/", "A direction to explore."],
  ["login", "/sign-in", "Welcome back."],
  ["register", "/create-account", "Create an account."],
  ["recovery", "/password-recovery", "Reset your password."],
  ["verify", "/check-email", "Check your email."],
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
