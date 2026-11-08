import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { chromium } from "../frontend/node_modules/playwright-core/index.mjs";

export async function careerEvidenceAcceptance({
  root,
  source,
  config,
  sql,
  docker,
  base,
  resumeAfterMigrations = false,
}) {
  const admin = {
    apikey: config.ANON_KEY,
    Authorization: "Bearer " + config.SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
  };
  const email = "evidence-" + randomUUID() + "@example.test";
  const password = "synthetic " + randomUUID();
  const created = await fetch(config.API_URL + "/auth/v1/admin/users", {
    method: "POST",
    headers: admin,
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!created.ok)
    throw new Error("Could not create isolated evidence learner");
  const uid = (await created.json()).id;
  let browser;
  let stage = "preservation fixture";
  const backend = "http://127.0.0.1:" + (base + 6);
  const mocked = "http://127.0.0.1:" + (base + 7);
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
    if (!login.ok) throw new Error("Evidence learner login failed");
    const token = (await login.json()).access_token;
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    async function response(path, body, method = "PATCH", origin = backend) {
      return fetch(origin + "/api/v1/" + path, {
        headers,
        method: body ? method : "GET",
        body: body ? JSON.stringify(body) : undefined,
      });
    }
    async function api(path, body, method, origin) {
      const result = await response(path, body, method, origin);
      if (!result.ok) throw new Error(`Evidence API ${path}: ${result.status}`);
      return result.json();
    }
    await api("me/profile", {
      first_name: "Evidence learner",
      expected_version: 0,
    });
    const careers = (await api("careers?limit=100")).items;
    if (careers.length !== 12) throw new Error("Expected all twelve careers");
    const roadmap = await api("roadmaps/" + careers[0].roadmap_ids[0]);
    const learning = await api("me/learning");
    await api("me/learning", {
      roadmap_id: roadmap.id,
      expected_version: learning.version,
    });
    const topic = roadmap.milestones.flatMap((m) => m.topics)[0];
    await api(`me/roadmaps/${roadmap.id}/topics/${topic.id}`, {
      status: "done",
      expected_version: 0,
    });
    const skill = (await api("competencies?limit=2")).items[0];
    await api("me/competencies/" + skill.id, { expected_version: 0, level: 0 });
    const tables = sql(
      "SELECT tablename FROM pg_tables WHERE schemaname='asgard_private' ORDER BY tablename;",
    )
      .trim()
      .split(/\r?\n/);
    const columns = tables.map((table) => ({
      table,
      columns: sql(
        `SELECT column_name FROM information_schema.columns WHERE table_schema='asgard_private' AND table_name='${table}' ORDER BY ordinal_position;`,
      )
        .trim()
        .split(/\r?\n/),
    }));
    const digest = () =>
      columns
        .map(({ table, columns }) => {
          if (![table, ...columns].every((name) => /^[a-z_]+$/.test(name)))
            throw new Error("Invalid fixture identifier");
          return sql(
            `SELECT md5(coalesce(string_agg(to_jsonb(v)::text,'|' ORDER BY to_jsonb(v)::text),'')) FROM (SELECT ${columns.map((name) => '"' + name + '"').join(",")} FROM asgard_private.${table}) v;`,
          ).trim();
        })
        .join("|");
    const before = digest();
    stage = "migration preservation";
    if (!resumeAfterMigrations) {
      sql(
        readFileSync(
          join(source, "docs/plans/occupational-releases-proposed.sql"),
          "utf8",
        ),
      );
      sql(
        readFileSync(
          join(source, "docs/plans/skill-recommendation-privacy-proposed.sql"),
          "utf8",
        ),
      );
    } else if (
      sql(
        "SELECT to_regclass('asgard_private.recommendation_skill_inputs') IS NOT NULL;",
      ).trim() !== "t"
    ) {
      throw new Error("Cannot resume without the isolated privacy migration");
    }
    if (digest() !== before)
      throw new Error(
        "Occupational migrations changed existing private fields",
      );
    const profile = await api("me/competencies");
    if (!profile.recommendations_enabled || profile.items[0]?.level !== 0)
      throw new Error("Skill upgrade failed");
    stage = "publication and activation";
    docker([
      "compose",
      "exec",
      "-T",
      "backend",
      "python",
      "/checkout/backend/scripts/render_occupational_release.py",
      "--output",
      "/tmp/evidence-publication.sql",
      "--activate",
    ]);
    docker([
      "compose",
      "cp",
      "backend:/tmp/evidence-publication.sql",
      join(root, "evidence-publication.sql"),
    ]);
    const publication = readFileSync(
      join(root, "evidence-publication.sql"),
      "utf8",
    );
    sql(publication);
    sql(publication);
    if (digest() !== before)
      throw new Error("Reference publication changed private data");
    for (const career of careers) {
      const page = await api(`careers/${career.id}/evidence?limit=2`);
      if (!page.release_id || page.items.length !== 2 || !page.roles.length)
        throw new Error("Incomplete career profile");
      const next = await api(
        `careers/${career.id}/evidence?limit=2&offset=2&expected_release_id=${page.release_id}`,
      );
      if (
        next.items.some((item) =>
          page.items.some((previous) => previous.record_id === item.record_id),
        )
      )
        throw new Error("Pagination repeated records");
      const filtered = await api(
        `careers/${career.id}/evidence?source_role=${page.items[0].occupation_id}&limit=2`,
      );
      if (
        filtered.items.some(
          (item) => item.occupation_id !== page.items[0].occupation_id,
        )
      )
        throw new Error("Role filter leaked records");
      const stale = await response(
        `careers/${career.id}/evidence?expected_release_id=${randomUUID()}`,
      );
      if (stale.status !== 409)
        throw new Error("Stale reference request was accepted");
    }
    stage = "isolated synthetic provider server";
    docker([
      "compose",
      "exec",
      "-d",
      "backend",
      "python",
      "-m",
      "uvicorn",
      "career_evidence_app:app",
      "--app-dir",
      "/workspace/tests",
      "--host",
      "0.0.0.0",
      "--port",
      "8001",
      "--no-access-log",
    ]);
    const deadline = Date.now() + 15000;
    while (true) {
      try {
        if ((await fetch(mocked + "/health")).ok) break;
      } catch {}
      if (Date.now() > deadline)
        throw new Error("Synthetic provider server did not start");
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    stage = "browser integrated journey";
    const ready = await api("me/recommendations", undefined, undefined, mocked);
    if (!ready.available || !ready.has_reported_skills)
      throw new Error("Skill-only generation is not available");
    browser = await chromium.launch({
      channel: process.env.ASGARD_BROWSER_CHANNEL ?? "chrome",
      headless: true,
    });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
    });
    page.setDefaultTimeout(20000);
    await page.route("**/api/v1/me/recommendations**", async (route) => {
      const url = new URL(route.request().url());
      const result = await route.fetch({
        url: mocked + url.pathname + url.search,
      });
      await route.fulfill({ response: result });
    });
    const frontend = "http://127.0.0.1:" + (base + 5);
    await page.goto(frontend + "/sign-in");
    await page.getByLabel("Email", { exact: true }).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForURL("**/dashboard");
    await page.goto(frontend + "/recommendations");
    await page
      .getByRole("button", { name: "Prepare suggestions", exact: true })
      .click();
    await page
      .getByText(
        "Synthetic acceptance suggestion using supplied experience and references.",
        { exact: true },
      )
      .waitFor();
    await page.getByText("Evidence used", { exact: true }).click();
    await page.getByText(/no proficiency transfer or target/).waitFor();
    const first = (
      await api("me/recommendations", undefined, undefined, mocked)
    ).current;
    if (
      !first.source_references.length ||
      !first.items[0].source_reference_ids.length
    )
      throw new Error("Source citations missing");
    await page.screenshot({
      path: join(root, "evidence-suggestions-1440.png"),
      fullPage: true,
    });
    await page.goto(frontend + `/roadmaps/${careers[0].id}`);
    await page
      .getByRole("button", { name: "Compare my skills", exact: true })
      .click();
    await page
      .getByText("Occupational references and learning coverage", {
        exact: true,
      })
      .click();
    await page.getByLabel("Source role", { exact: true }).waitFor();
    await page
      .getByRole("button", { name: "Next references", exact: true })
      .click();
    await page.getByText(/^21–40 of /).waitFor();
    await page.screenshot({
      path: join(root, "evidence-comparison-1440.png"),
      fullPage: true,
    });
    await page.keyboard.press("Escape");
    await page.goto(frontend + "/settings/profile#profile-skills");
    await page
      .getByRole("button", { name: "Edit " + skill.label, exact: true })
      .click();
    await page.getByLabel("Your experience").selectOption("1");
    await page.getByRole("button", { name: "Save skill", exact: true }).click();
    await page.getByText("Skill saved.", { exact: true }).waitFor();
    await page.goto(frontend + "/recommendations");
    await page.getByText(/Affected suggestions were erased/).waitFor();
    await page.reload();
    await page.getByText(/Affected suggestions were erased/).waitFor();
    const erased = (
      await api("me/recommendations", undefined, undefined, mocked)
    ).current;
    if (
      !erased.payload_erased_at ||
      erased.items.length ||
      erased.source_references.length
    )
      throw new Error("Erased payload remained readable");
    // Advance only this fixture learner's reservation time; preserve the real quota implementation.
    sql(
      `UPDATE asgard_private.analysis_attempts SET reserved_at=reserved_at-interval '61 seconds' WHERE user_id='${uid}';`,
    );
    await page
      .getByRole("button", { name: "Update suggestions", exact: true })
      .click();
    await page
      .getByText(
        "Synthetic acceptance suggestion using supplied experience and references.",
        { exact: true },
      )
      .waitFor();
    const replacement = (
      await api("me/recommendations", undefined, undefined, mocked)
    ).current;
    if (replacement.id === first.id || replacement.outdated)
      throw new Error("Replacement did not use current inputs");
    console.log(
      "Career evidence: preservation, twelve profiles, mocked browser generation, citations, edit erasure and replacement passed.",
    );
  } catch (error) {
    const page = browser?.contexts()[0]?.pages()[0];
    if (page && !page.isClosed()) {
      await page
        .screenshot({
          path: join(root, "evidence-failure.png"),
          fullPage: true,
        })
        .catch(() => {});
      const text = await page
        .locator("body")
        .innerText()
        .catch(() => "Unavailable");
      writeFileSync(join(root, "evidence-failure.txt"), text, { mode: 0o600 });
    }
    throw new Error(stage + ": " + error.message);
  } finally {
    if (browser) await browser.close();
    await fetch(config.API_URL + "/auth/v1/admin/users/" + uid, {
      method: "DELETE",
      headers: admin,
    });
  }
}
