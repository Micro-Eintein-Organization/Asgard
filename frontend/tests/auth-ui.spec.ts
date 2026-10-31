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
  await page.getByLabel("Confirm password", { exact: true }).fill("12345678");
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
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Log out", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("sb-127-auth-token")))
    .toBeNull();
  await page.goto("/settings/profile");
  await expect(page).toHaveURL(/\/sign-in$/);
});

test.describe("canonical application presentation", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(
      (value) =>
        localStorage.setItem("sb-127-auth-token", JSON.stringify(value)),
      session(),
    );
    await page.route("**/api/v1/me/profile", (route) =>
      route.fulfill({ json: { profile: null } }),
    );
  });

  const screens = [
    ["dashboard", "/dashboard", "Your next step is here."],
    ["entry", "/welcome", "How would you like to begin?"],
    ["discovery", "/discovery", "What kinds of work interest you?"],
    ["results", "/recommendations", "Careers to explore."],
    ["catalog", "/careers", "Find a direction worth exploring."],
    ["roadmap", "/roadmaps/frontend?topic=semantic-html", "Frontend Developer"],
    ["profile", "/settings/profile", "Your profile."],
    ["account", "/settings/account", "Account and security"],
  ];

  test("Discovery footer and shared button styling work at desktop and mobile widths", async ({
    page,
  }) => {
    const footer = page.locator("footer.site-footer");

    await page.goto("/welcome");
    await expect(footer).toHaveCount(0);
    await page.getByRole("radio", { name: /Guided Discovery/ }).check();
    const continueLink = page.getByRole("link", {
      name: "Continue",
      exact: true,
    });
    await continueLink.hover();
    await expect(continueLink).toHaveCSS(
      "background-color",
      "rgb(63, 138, 200)",
    );
    await continueLink.click();

    await expect(footer).toHaveCount(0);
    const firstBack = page.getByRole("link", { name: "Back" });
    await expect(firstBack.locator("svg")).toBeVisible();
    await expect(firstBack).toHaveAttribute("href", "/welcome");
    await expect(firstBack).toHaveAttribute("data-variant", "ghost");
    await expect(firstBack).toHaveCSS("border-radius", "999px");
    await expect(firstBack).toHaveCSS("border-style", "none");
    const firstBackLayout = await firstBack.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, left: rect.left };
    });
    const expectBackVisible = async (control: typeof firstBack) => {
      const bounds = await control.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const arrow = element.querySelector("svg")?.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          arrowTop: arrow?.top ?? -1,
          arrowBottom: arrow?.bottom ?? -1,
        };
      });
      expect(bounds.top).toBeGreaterThanOrEqual(0);
      expect(bounds.bottom).toBeLessThanOrEqual(
        await page.evaluate(() => innerHeight),
      );
      expect(bounds.arrowTop).toBeGreaterThanOrEqual(0);
      expect(bounds.arrowBottom).toBeLessThanOrEqual(
        await page.evaluate(() => innerHeight),
      );
    };
    await expectBackVisible(firstBack);

    await page.locator(".skip-link").focus();
    await page.keyboard.press("Tab");
    await expect(firstBack).toBeFocused();
    await expect(firstBack).toHaveCSS("outline-style", "solid");
    await expect(firstBack).toHaveCSS("outline-width", "3px");

    await page.getByRole("checkbox", { name: /Creating useful tools/ }).check();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    const subsequentBack = page.getByRole("button", { name: "Back" });
    await expect(subsequentBack.locator("svg")).toBeVisible();
    await expectBackVisible(subsequentBack);
    await expect
      .poll(() =>
        subsequentBack.evaluate((element) => element.getBoundingClientRect().top),
      )
      .toBe(firstBackLayout.top);
    await expect(subsequentBack).toHaveAttribute(
      "class",
      (await firstBack.getAttribute("class")) ?? "",
    );
    await expect(footer).toHaveCount(0);

    await subsequentBack.click();
    await expect(
      page.getByRole("checkbox", { name: /Creating useful tools/ }),
    ).toBeChecked();
    await page.getByRole("button", { name: "Next", exact: true }).click();
    const remainingQuestions = [
      { role: "checkbox", name: /Building software logic/, action: "Next" },
      { role: "checkbox", name: /Working on my own/, action: "Next" },
      { role: "checkbox", name: /I'm new to technology/, action: "Next" },
      { role: "radio", name: /Start learning/, action: "See suggestions" },
    ] as const;
    for (const question of remainingQuestions) {
      await page.getByRole(question.role, { name: question.name }).check();
      await page
        .getByRole("button", { name: question.action, exact: true })
        .click();
      await expect(footer).toHaveCount(0);
      if (question.action === "Next") {
        const back = page.getByRole("button", { name: "Back" });
        await expect(
          back.locator("svg"),
        ).toBeVisible();
        await expectBackVisible(back);
      }
    }
    await expect(page).toHaveURL(/\/recommendations$/);
    await expect(
      page.getByRole("heading", { name: "Careers to explore." }),
    ).toBeVisible();
    await expect(footer).toHaveCount(0);

    await page.goto("/careers");
    await expect(footer).toHaveCount(1);
    await expect(footer).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await expect(footer).toHaveCSS("color", "rgb(255, 255, 255)");
    await expect(footer.locator("a")).toHaveCSS(
      "color",
      "rgb(255, 255, 255)",
    );
  });

  test("roadmap task visibility animates and topic details stay in view", async ({
    page,
  }) => {
    await page.goto("/roadmaps/frontend");
    const footer = page.locator("footer.site-footer");
    const footerEdges = await footer.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        marginLeft: getComputedStyle(element).marginLeft,
      };
    });
    expect(footerEdges.left).toBe(0);
    expect(footerEdges.right).toBe(await page.evaluate(() => innerWidth));
    expect(footerEdges.width).toBe(await page.evaluate(() => innerWidth));
    expect(footerEdges.marginLeft).toBe("0px");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const footerBottom = await footer.evaluate(
      (element) =>
        element.getBoundingClientRect().bottom + window.scrollY,
    );
    expect(footerBottom).toBe(
      await page.evaluate(() => document.documentElement.scrollHeight),
    );
    await page.evaluate(() => window.scrollTo(0, 0));

    const task = page.locator("#topic-task-how-the-web-works");
    const taskButton = page.locator("#topic-how-the-web-works");
    const incompleteTaskButton = page.locator("#topic-semantic-html");
    const hideTask = page.getByRole("button", {
      name: "Hide task: How the web works",
    });
    await expect(taskButton).toContainText("Done");
    await expect(taskButton.locator("svg.lucide-check")).toBeVisible();
    await expect(incompleteTaskButton.locator("svg.lucide-circle")).toBeVisible();
    await expect(incompleteTaskButton.locator("svg.lucide-check")).toHaveCount(0);
    await expect(hideTask.locator("svg")).toBeVisible();
    const transition = await task.evaluate((element) => ({
      property: getComputedStyle(element).transitionProperty,
      duration: getComputedStyle(element).transitionDuration,
    }));
    expect(transition.property).toContain("grid-template-rows");
    expect(transition.duration).toContain("220ms");

    await hideTask.click();
    await expect(task).toHaveAttribute("aria-hidden", "true");
    await expect(task).toHaveAttribute("inert", "");
    await expect
      .poll(() => task.evaluate((element) => element.getBoundingClientRect().height))
      .toBe(0);
    await expect(
      page.getByRole("button", { name: "Show task: How the web works" }),
    ).toBeVisible();
    await expect(taskButton).toContainText("Done");
    await expect(taskButton.locator("svg.lucide-check")).toBeVisible();

    await page.getByRole("button", { name: "Show task: How the web works" }).click();
    await expect(task).toHaveAttribute("aria-hidden", "false");
    await expect
      .poll(() => task.evaluate((element) => element.getBoundingClientRect().height))
      .toBeGreaterThan(0);
    await expect(taskButton).toContainText("Done");
    await expect(taskButton.locator("svg.lucide-check")).toBeVisible();
    expect(await page.evaluate(() => localStorage.getItem("asgard.topic-statuses"))).toBeNull();
    expect(await page.evaluate(() => window.location.search)).toBe("");

    await page.locator("#topic-css-layout").click();
    const panel = page.locator("#topic-details");
    await expect(
      panel.getByRole("heading", { name: "CSS and layout" }),
    ).toBeVisible();
    const viewportWidth = await page.evaluate(() => innerWidth);
    if (viewportWidth >= 1024) {
      await page.evaluate(() => window.scrollTo(0, 400));
      const panelLayout = await panel.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const header = document.querySelector(".site-header")!;
        const headerBottom = header.getBoundingClientRect().bottom;
        const clippedAncestors = [];
        for (
          let ancestor = element.parentElement;
          ancestor;
          ancestor = ancestor.parentElement
        ) {
          const overflowY = getComputedStyle(ancestor).overflowY;
          if (overflowY !== "visible") clippedAncestors.push(overflowY);
        }
        return {
          position: getComputedStyle(element).position,
          top: rect.top,
          bottom: rect.bottom,
          headerBottom,
          clippedAncestors,
        };
      });
      expect(panelLayout.position).toBe("sticky");
      expect(panelLayout.top - panelLayout.headerBottom).toBeGreaterThanOrEqual(
        20,
      );
      expect(panelLayout.bottom).toBeLessThanOrEqual(
        await page.evaluate(() => innerHeight),
      );
      expect(panelLayout.clippedAncestors).toEqual([]);
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight),
      );
      const panelAtPageEnd = await panel.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const headerBottom = document
          .querySelector(".site-header")!
          .getBoundingClientRect().bottom;
        return {
          top: rect.top,
          bottom: rect.bottom,
          headerBottom,
        };
      });
      expect(panelAtPageEnd.top - panelAtPageEnd.headerBottom).toBeGreaterThanOrEqual(
        20,
      );
      expect(panelAtPageEnd.bottom).toBeLessThanOrEqual(
        await page.evaluate(() => innerHeight),
      );
    } else {
      const panelLayout = await panel.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const heading = element.querySelector("h2")!.getBoundingClientRect();
        const headerBottom = document
          .querySelector(".site-header")!
          .getBoundingClientRect().bottom;
        return {
          position: getComputedStyle(element).position,
          top: rect.top,
          headerBottom,
          headingTop: heading.top,
          headingBottom: heading.bottom,
        };
      });
      expect(panelLayout.position).toBe("static");
      expect(panelLayout.top - panelLayout.headerBottom).toBeGreaterThanOrEqual(
        20,
      );
      expect(panelLayout.headingTop).toBeGreaterThanOrEqual(
        panelLayout.headerBottom,
      );
      expect(panelLayout.headingBottom).toBeLessThanOrEqual(
        await page.evaluate(() => innerHeight),
      );
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
  });

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
        if (
          (pathname.startsWith("/api/") && pathname !== "/api/v1/me/profile") ||
          pathname.startsWith("/auth/v1/")
        )
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
    await page.goto("/careers");
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
    await page
      .getByRole("button", { name: "Clear search and filters" })
      .click();
    await expect(
      page.getByRole("link", { name: /^View roadmap for/ }),
    ).toHaveCount(7);
  });

  test("catalog search renders one clear control and supports pointer and keyboard use", async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto("/careers?category=software-ai&q=missing");
      const search = page.getByRole("searchbox", {
        name: "Search career roles or skills",
      });
      const clearQuery = page.getByRole("button", {
        name: "Clear search query",
      });
      await expect(search).toHaveValue("missing");
      await expect(clearQuery).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Clear search query" }),
      ).toHaveCount(1);
      await clearQuery.click();
      await expect(search).toHaveValue("");
      await expect(search).toBeFocused();
      await expect(page).toHaveURL(
        (url) =>
          url.searchParams.get("category") === "software-ai" &&
          !url.searchParams.has("q"),
      );
      await expect(clearQuery).toHaveCount(0);

      await search.fill("still-missing");
      await expect(
        page.getByRole("button", { name: "Clear search query" }),
      ).toHaveCount(1);
      await expect(clearQuery).toBeVisible();
      await search.focus();
      await page.keyboard.press("Tab");
      await expect(clearQuery).toBeFocused();
      const focusStyle = await clearQuery.evaluate((element) => ({
        outlineWidth: getComputedStyle(element).outlineWidth,
        outlineStyle: getComputedStyle(element).outlineStyle,
      }));
      expect(focusStyle).toEqual({
        outlineWidth: "3px",
        outlineStyle: "solid",
      });
      await page.keyboard.press("Enter");
      await expect(search).toHaveValue("");
      await expect(page).toHaveURL(
        (url) =>
          url.searchParams.get("category") === "software-ai" &&
          !url.searchParams.has("q"),
      );
      await expect(clearQuery).toHaveCount(0);

      await search.fill("space-clears-search");
      await search.focus();
      await page.keyboard.press("Tab");
      await expect(clearQuery).toBeFocused();
      await page.keyboard.press("Space");
      await expect(search).toHaveValue("");
      await expect(page).toHaveURL(
        (url) =>
          url.searchParams.get("category") === "software-ai" &&
          !url.searchParams.has("q"),
      );

      await search.fill("escape-clears-search");
      await search.focus();
      await page.keyboard.press("Escape");
      await expect(search).toHaveValue("");
      await expect(page).toHaveURL(
        (url) =>
          url.searchParams.get("category") === "software-ai" &&
          !url.searchParams.has("q"),
      );
    }
  });

  test("Discovery choices, correction, exclusivity and discard are presentational", async ({
    page,
  }) => {
    await page.goto("/welcome");
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
    await expect(
      page.getByRole("button", { name: "See suggestions" }),
    ).toBeDisabled();
    await page.getByRole("radio", { name: /Start learning/ }).check();
    await expect(
      page.getByRole("button", { name: "See suggestions" }),
    ).toBeEnabled();
    await page.getByRole("button", { name: "See suggestions" }).click();
    await expect(page).toHaveURL(/\/recommendations$/);
    await expect(page.getByRole("banner")).toHaveCount(0);
    await expect(
      page.getByText(/These roles were not generated from your answers/),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Careers to explore." }),
    ).toBeVisible();
    await expect(
      page.getByRole("combobox", { name: "Review layout state" }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: "Back to Discovery" }).click();
    await expect(page).toHaveURL(/\/discovery$/);
    await expect(
      page.getByRole("radio", { name: /Start learning/ }),
    ).toBeChecked();
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await expect(
      page.getByRole("checkbox", { name: /I'm new to technology/ }),
    ).toBeChecked();
  });

  test("profile enables name saves, keeps prototype actions unavailable and guards unsaved input", async ({
    page,
  }) => {
    await page.goto("/settings/profile");
    await page
      .getByRole("textbox", { name: "First name", exact: true })
      .fill("Preview input");
    await expect(
      page.getByRole("button", { name: "Save profile", exact: true }),
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Choose PDF" }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Save preferences" }),
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

  test("account menu and responsive navigation work by keyboard", async ({
    page,
  }) => {
    await page.goto("/settings/account");
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
    await page.setViewportSize({ width: 390, height: 844 });
    const brandLink = page.getByRole("link", {
      name: "Asgard, go to dashboard",
    });
    await expect(brandLink).toHaveAttribute("href", "/dashboard");
    const brandImage = brandLink.getByRole("img", { name: "Asgard" });
    await expect(brandImage).toHaveAttribute("width", "650");
    await expect(brandImage).toHaveAttribute("height", "146");
    const logoBox = await brandImage.boundingBox();
    const headerBox = await page.locator(".site-header").boundingBox();
    expect(logoBox?.height).toBeLessThanOrEqual(32);
    expect((logoBox?.x ?? 0) + (logoBox?.width ?? 0)).toBeLessThanOrEqual(
      (headerBox?.x ?? 0) + (headerBox?.width ?? 0),
    );
  });

  test("real empty state, progress filter and calendar work", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "No current learning topic yet" }),
    ).toBeVisible();
    await expect(page.getByText("Current streak 0 days")).toBeVisible();
    await expect(
      page.getByText("Complete a topic to start your learning streak."),
    ).toBeVisible();
    await expect(page.locator(".calendar-day.today")).toHaveCount(1);
    await expect(
      page.getByRole("combobox", { name: "Review layout state" }),
    ).toHaveCount(0);
    await page.getByRole("link", { name: "Choose a topic" }).click();
    await page.getByRole("button", { name: /How the web works/ }).click();
    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(
      page.getByRole("heading", { name: "How the web works" }),
    ).toBeVisible();
    const pastMonthLabel = await page.evaluate(() => {
      const current = new Date();
      return new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
      }).format(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    });
    await page.getByRole("button", { name: "Previous month" }).click();
    await expect(page.getByRole("heading", { name: pastMonthLabel })).toBeVisible();
    await page.getByRole("button", { name: "Next month" }).click();
    await page.getByRole("button", { name: "Dismiss sample guidance" }).click();
    await expect(
      page.getByRole("link", { name: "Open Discovery", exact: true }),
    ).toHaveCount(0);
    await page.goto("/careers");
    await expect(
      page.getByRole("combobox", { name: "Review layout state" }),
    ).toHaveCount(0);
    await page.goto("/roadmaps/frontend");
    await page.getByRole("checkbox", { name: "Hide completed" }).check();
    await expect(
      page.getByRole("button", { name: /How the web works/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Accessible, responsive pages/ }),
    ).toBeVisible();
  });

  test("entry, catalog categories, roadmap disclosure and resource navigation", async ({
    page,
  }) => {
    await page.goto("/welcome");
    await page.getByRole("radio", { name: /^Browse careers/ }).check();
    await page.getByRole("link", { name: "Continue", exact: true }).click();
    await page
      .getByRole("button", { name: "Design & UX", exact: true })
      .click();
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
});
