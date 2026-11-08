import { readFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { parseEnv } from "node:util";
import { chromium } from "../frontend/node_modules/playwright-core/index.mjs";

export async function competencyAcceptance({
  root,
  project,
  config,
  sql,
  docker,
  backend,
  applyMigration,
  resumeAfterPublication = false,
  skipBackendChecks = false,
}) {
  const admin = {
    apikey: config.ANON_KEY,
    Authorization: "Bearer " + config.SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
  };
  const email = "asgard-skills-" + randomUUID() + "@example.test";
  const password = "synthetic " + randomUUID();
  const created = await fetch(config.API_URL + "/auth/v1/admin/users", {
    method: "POST",
    headers: admin,
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!created.ok)
    throw new Error("Could not create isolated synthetic learner.");
  const uid = (await created.json()).id;
  let browser;
  let stage = "seed saved state";
  try {
    const login = await fetch(
      config.API_URL + "/auth/v1/token?grant_type=password",
      {
        method: "POST",
        headers: {
          apikey: config.ANON_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );
    if (!login.ok) throw new Error("Synthetic login failed.");
    const token = (await login.json()).access_token;
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    async function api(path, body, method = "PATCH") {
      const response = await fetch(backend + "/api/v1/" + path, {
        method: body ? method : "GET",
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok)
        throw new Error(`Synthetic API ${path}: ${response.status}`);
      return response.json();
    }
    const career = (await api("careers?limit=100")).items.find(
      (c) => c.slug === "data-analyst",
    );
    const roadmap = await api("roadmaps/" + career.roadmap_ids[0]);
    const topic = roadmap.milestones.flatMap((m) => m.topics)[0];
    await api("me/profile", {
      first_name: "Synthetic learner",
      expected_version: 0,
    });
    const learning = await api("me/learning");
    await api("me/learning", {
      roadmap_id: roadmap.id,
      expected_version: learning.version,
    });
    await api(`me/roadmaps/${roadmap.id}/topics/${topic.id}`, {
      status: "done",
      expected_version: 0,
    });
    const paths = [
      "me/profile",
      "me/learning",
      `me/roadmaps/${roadmap.id}/progress`,
    ];
    const before = JSON.stringify(await Promise.all(paths.map((p) => api(p))));
    const legacyTables = sql(
      "SELECT tablename FROM pg_tables WHERE schemaname='asgard_private' ORDER BY tablename;",
    )
      .trim()
      .split(/\r?\n/);
    const digest = () =>
      legacyTables
        .map((name) => {
          if (!/^[a-z_]+$/.test(name))
            throw new Error("Unexpected private table identifier.");
          return sql(
            `SELECT md5(coalesce(string_agg(to_jsonb(t)::text, '|' ORDER BY to_jsonb(t)::text),'')) FROM asgard_private.${name} t;`,
          ).trim();
        })
        .join("|");
    const privateBefore = digest();
    const reviewedFixture = docker([
      "compose",
      "exec",
      "-T",
      "backend",
      "python",
      "scripts/render_competencies.py",
      "--publish-reviewed",
      "--reviewer",
      "Synthetic isolated fixture; not human content approval",
    ]);
    if (!resumeAfterPublication) {
      stage = "migration upgrade";
      applyMigration();
      if (
        before !==
          JSON.stringify(await Promise.all(paths.map((p) => api(p)))) ||
        privateBefore !== digest()
      )
        throw new Error("Competency migration changed existing private state.");
      stage = "draft and repeat publication";
      const draft = readFileSync(
        join(root, "supabase/content/20261104_competencies_draft.sql"),
        "utf8",
      );
      sql(draft);
      sql(draft);
      if (
        sql(
          "SELECT count(*) || '|' || count(*) FILTER(WHERE published) FROM asgard_catalog.competencies;",
        ).trim() !== "120|0"
      )
        throw new Error("Draft mapping counts/publication state differ.");
      if ((await api("competencies?limit=100")).total !== 0)
        throw new Error("Draft references leaked to runtime search.");
      stage = "synthetic reference fixture";

      sql(reviewedFixture);
      sql(reviewedFixture);
      if (
        (await api("competencies?limit=100")).total !== 120 ||
        privateBefore !== digest()
      )
        throw new Error(
          "Reference fixture publication failed or changed private state.",
        );
      const catalog = (await api("careers?limit=100")).items;
      for (const item of catalog) {
        const comparison = await api(
          `me/careers/${item.id}/competency-comparison`,
        );
        if (
          comparison.items.length !== 10 ||
          comparison.items.some((s) => !s.topics.length || s.recorded)
        )
          throw new Error("Incomplete/incorrect comparison for " + item.slug);
      }
    }
    const environment = parseEnv(readFileSync(join(root, ".env"), "utf8"));
    if (!skipBackendChecks) {
      stage = "conflict rejection";
      const conflict = reviewedFixture.replaceAll(
        "'How browsers deliver pages'",
        "'Synthetic conflicting label'",
      );
      let rejected = false;
      try {
        sql(conflict);
      } catch {
        rejected = true;
      }
      if (
        !rejected ||
        privateBefore !== digest() ||
        (await api("competencies?q=Synthetic%20conflicting")).total
      )
        throw new Error("Conflicting mapping was not rolled back safely.");
      stage = "container unit and actual-role integration tests";
      const testEnvironment = {
        ASGARD_RUN_LOCAL_AUTH_TESTS: "1",
        ASGARD_TEST_PROJECT_ID: project,
        ASGARD_TEST_AUTH_URL: `http://supabase_kong_${project}:8000`,
        ASGARD_TEST_DATABASE_URL: environment.ASGARD_DATABASE_URL,
        ASGARD_TEST_PUBLIC_KEY: config.ANON_KEY,
        ASGARD_TEST_SERVICE_KEY: config.SERVICE_ROLE_KEY,
      };
      const result = docker(
        [
          "compose",
          "exec",
          "-T",
          "backend",
          "python",
          "-c",
          "import os,json,sys,pytest; os.environ.update(json.load(sys.stdin)); sys.exit(pytest.main(['-q','tests/test_competencies.py','tests/integration/test_local_auth.py']))",
        ],
        JSON.stringify(testEnvironment),
      );
      console.log(result.trim());
    }
    stage = "browser profile skill save/readback";
    browser = await chromium.launch({
      channel: process.env.ASGARD_BROWSER_CHANNEL ?? "chrome",
      headless: true,
    });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    });
    page.setDefaultTimeout(15000);
    await page.route("**/api/v1/me/recommendations", (route) =>
      route.request().method() === "POST"
        ? route.fulfill({
            status: 503,
            json: {
              code: "provider_unavailable",
              message: "Synthetic check; no model call.",
              request_id: "skill-check",
            },
          })
        : route.continue(),
    );
    const base = "http://127.0.0.1:" + environment.FRONTEND_PORT;
    await page.goto(base + "/sign-in");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL("**/dashboard");
    await page.goto(base + "/settings/profile#profile-skills");
    const skill = (
      await api("competencies?career_id=" + career.id + "&limit=1")
    ).items[0];
    await page.getByLabel("Find a skill").fill(skill.label);
    await page
      .getByRole("button", { name: "Add " + skill.label, exact: true })
      .click();
    await page.getByLabel("Your experience").selectOption("0");
    await page.getByRole("button", { name: "Save skill", exact: true }).click();
    await page.getByText("Skill saved.", { exact: true }).waitFor();
    await page.reload();
    await page.getByText("0 · No experience", { exact: true }).waitFor();
    await page
      .getByRole("button", { name: "Edit " + skill.label, exact: true })
      .click();
    await page.getByLabel("Your experience").selectOption("");
    await page.getByRole("button", { name: "Save skill", exact: true }).click();
    await page.getByText("Skill saved.", { exact: true }).waitFor();
    await page.reload();
    await page.getByText("Experience unknown", { exact: true }).waitFor();
    stage = "browser layout and comparison";
    for (const width of [1280, 1440, 1920, 320]) {
      await page.setViewportSize({ width, height: 900 });
      if (
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        )
      )
        throw new Error("Profile overflow at " + width);
      await page.screenshot({
        path: join(root, `skills-profile-${width}.png`),
        fullPage: true,
      });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(base + `/roadmaps/${career.id}`);
    const trigger = page.getByRole("button", {
      name: "Compare my skills",
      exact: true,
    });
    await trigger.waitFor();
    const contrast = await trigger.evaluate((element) => {
      const style = getComputedStyle(element);
      const luminance = (color) => {
        const channels = color
          .match(/[\d.]+/g)
          .slice(0, 3)
          .map(Number)
          .map((v) => {
            const n = v / 255;
            return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
          });
        return (
          channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
        );
      };
      const foreground = luminance(style.color),
        background = luminance(style.backgroundColor);
      return (
        (Math.max(foreground, background) + 0.05) /
        (Math.min(foreground, background) + 0.05)
      );
    });
    if (contrast < 4.5)
      throw new Error("Comparison trigger contrast below 4.5:1");
    await page.screenshot({
      path: join(root, "skills-roadmap-1440.png"),
      fullPage: true,
    });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await dialog
      .getByRole("link", { name: topic.title, exact: true })
      .waitFor();
    await dialog.getByText("Experience unknown", { exact: true }).waitFor();
    await page.screenshot({
      path: join(root, "skills-comparison-1440.png"),
      fullPage: true,
    });
    await page.keyboard.press("Escape");
    await page.waitForFunction(
      () => document.activeElement?.textContent?.trim() === "Compare my skills",
    );
    if (
      !(await trigger.evaluate((element) => element === document.activeElement))
    )
      throw new Error("Comparison focus did not return.");
    await trigger.click();
    await dialog.getByRole("link", { name: topic.title, exact: true }).click();
    await page.waitForURL((url) => url.searchParams.get("topic") === topic.id);
    await page
      .getByRole("heading", { name: topic.title, exact: true })
      .last()
      .waitFor();
    if (before !== JSON.stringify(await Promise.all(paths.map((p) => api(p)))))
      throw new Error(
        "Skill editing/comparison changed existing learning state.",
      );
    stage = "browser removal and refresh";
    await page.goto(base + "/settings/profile#profile-skills");
    await page
      .getByRole("button", { name: "Edit " + skill.label, exact: true })
      .click();
    page.once("dialog", (dialog) => dialog.accept());
    await page
      .getByRole("button", { name: "Remove skill", exact: true })
      .click();
    await page.getByText("Skill removed.", { exact: true }).waitFor();
    await page.reload();
    await page
      .getByText("No skills recorded yet. Adding a skill is optional.", {
        exact: true,
      })
      .waitFor();
    console.log(
      skipBackendChecks
        ? "PASS: affected Chrome skill flow, layout, comparison-trigger contrast and focus return. Backend checks reused from the previous passing run."
        : "PASS: competency upgrade, 12-career mappings, draft/repeat/conflict publication, actual-role integration and Chrome save/refresh/comparison/removal. Synthetic isolated data only; zero provider calls.",
    );
  } catch (error) {
    throw new Error(stage + ": " + error.message);
  } finally {
    await browser?.close();
    const removed = await fetch(
      config.API_URL + "/auth/v1/admin/users/" + uid,
      { method: "DELETE", headers: admin },
    );
    if (!removed.ok) throw new Error("Synthetic learner cleanup failed.");
  }
}
