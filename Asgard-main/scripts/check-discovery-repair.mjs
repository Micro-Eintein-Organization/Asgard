import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { chromium } from "../frontend/node_modules/playwright-core/index.mjs";
import { localConfig } from "./dev-config.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const env = parseEnv(readFileSync(join(root, ".env"), "utf8"));
const base = "http://127.0.0.1:" + Number(env.FRONTEND_PORT || 5173);
const result = spawnSync(process.execPath, [join(root, "node_modules/supabase/dist/supabase.js"), "status", "--output", "json"], { cwd: root, encoding: "utf8" });
if (result.status !== 0) throw new Error("Local stack unavailable.");
const config = JSON.parse(result.stdout);
if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(config.API_URL)) throw new Error("Local stack required.");
const admin = { apikey: config.ANON_KEY, Authorization: "Bearer " + config.SERVICE_ROLE_KEY };
const email = "asgard-discovery-" + randomUUID() + "@example.test";
const password = "synthetic " + randomUUID();
const output = join(root, "tmp/discovery-repair");
mkdirSync(output, { recursive: true });
let uid, browser, stage = "browser";
let requests = 0;
const checks = [];
try {
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(15000);
  await page.route("**/api/v1/me/recommendations", route => {
    if (route.request().method() !== "POST") return route.continue();
    requests++;
    return route.fulfill({ status: 503, json: { code: "provider_unavailable", message: "Synthetic check: suggestions temporarily unavailable. Your answers are saved.", request_id: "synthetic-browser" } });
  });
  stage = "registration";
  await page.goto(base + "/create-account");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Send email code", exact: true }).click();
  await page.getByLabel("Email confirmation code", { exact: true }).waitFor();
  const users = await fetch(config.API_URL + "/auth/v1/admin/users?per_page=1000", { headers: admin });
  if (!users.ok) throw new Error("Synthetic account lookup failed.");
  uid = (await users.json()).users.find(user => user.email === email)?.id;
  const mail = "http://127.0.0.1:" + localConfig(readFileSync(join(root, "supabase/config.toml"), "utf8")).mail;
  let code;
  for (let attempt = 0; attempt < 40 && !code; attempt++) {
    const inbox = await fetch(mail + "/api/v1/messages?query=" + encodeURIComponent("to:" + email));
    for (const message of (await inbox.json()).messages ?? []) {
      if (!message.To?.some(to => to.Address?.toLowerCase() === email.toLowerCase())) continue;
      const detail = await (await fetch(mail + "/api/v1/message/" + message.ID)).json();
      const codes = [...new Set(((detail.Text ?? "") + " " + (detail.HTML ?? "")).match(/(?<!\d)\d{6}(?!\d)/g))];
      if (codes.length === 1) code = codes[0];
    }
    if (!code) await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!code) throw new Error("Synthetic verification code unavailable.");
  await page.getByLabel("Email confirmation code", { exact: true }).fill(code);
  await page.getByRole("button", { name: "Verify", exact: true }).click();
  await page.waitForURL("**/welcome");
  checks.push("registration and local verification");
  stage = "new_account_dashboard";
  await page.goto(base + "/dashboard");
  await page.getByRole("heading", { name: "Choose your first roadmap" }).waitFor();
  await page.getByRole("link", { name: "Browse careers", exact: true }).last().click();
  await page.getByRole("heading", { name: "Data Analyst", exact: true }).waitFor();
  checks.push("new-account Dashboard and published catalog");
  if (process.argv.includes("--catalog-review")) {
    stage = "catalog_review";
    const heights = [];
    for (const width of [1280, 1440, 1920, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.mouse.move(0, 0);
      const geometry = await page.locator(".catalog-career-card").evaluateAll(cards => cards.map(card => ({
        height: Math.round(card.getBoundingClientRect().height),
        skills: card.querySelectorAll(".career-skills li").length,
        description: card.querySelector(":scope > p")?.textContent?.length ?? 0,
      })));
      if (!geometry.length || geometry.some(card => card.skills > 3 || card.description > 160)) throw new Error("Catalog summaries are not bounded.");
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw new Error("Catalog horizontal overflow.");
      if (width >= 1280) {
        const starts = await page.locator(".catalog-sidebar .category-name").evaluateAll(labels => labels.map(label => Math.round(label.getBoundingClientRect().left)));
        if (new Set(starts).size !== 1) throw new Error("Category labels are not aligned.");
      }
      heights.push({ width, max_card_height: Math.max(...geometry.map(card => card.height)) });
      await page.screenshot({ path: join(output, "catalog-" + width + ".png"), fullPage: true });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole("button", { name: "Hardware & Embedded Systems", exact: true }).click();
    await page.getByRole("button", { name: "Hardware & Embedded Systems", pressed: true }).waitFor();
    await page.screenshot({ path: join(output, "catalog-category-selected.png"), fullPage: true });
    await page.getByRole("button", { name: "All fields", exact: true }).click();
    await page.getByRole("searchbox", { name: "Search career roles or skills" }).fill("Frontend");
    await page.getByRole("button", { name: "View Frontend Developer roadmap", exact: true }).click();
    await page.getByRole("link", { name: "Back to catalog", exact: true }).click();
    await page.getByRole("searchbox", { name: "Search career roles or skills" }).waitFor();
    if (await page.getByRole("searchbox", { name: "Search career roles or skills" }).inputValue() !== "Frontend") throw new Error("Catalog search did not survive roadmap navigation.");
    checks.push("compact catalog, aligned category labels, selection, narrow reflow and roadmap/search return");
    console.log(JSON.stringify({ status: "passed", checks, heights, external_provider_calls: 0 }));
  } else if (process.argv.includes("--cabusao-ui")) {
    stage = "reference_settings";
    const catalogRead = page.waitForResponse(response => new URL(response.url()).pathname === "/api/v1/careers" && response.ok());
    await page.reload();
    const published = (await (await catalogRead).json()).items;
    await page.goto(base + "/settings/profile");
    for (const name of ["Personal details", "Career background", "Saved Discovery suggestions", "Preferred primary field"]) await page.getByRole("heading", { name, exact: true }).waitFor();
    for (const name of ["Change photo", "Choose PDF"]) if (!(await page.getByRole("button", { name, exact: true }).isDisabled())) throw new Error("Unavailable feature enabled.");
    for (const width of [1280, 1440, 1920, 320]) {
      await page.setViewportSize({ width, height: 900 });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw new Error("Settings overflow.");
      await page.screenshot({ path: join(output, "cabusao-profile-" + width + ".png"), fullPage: true });
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByLabel("First name", { exact: true }).fill("Synthetic");
    await page.getByLabel("Surname (optional)", { exact: true }).fill("Example");
    await page.getByRole("button", { name: "Save profile", exact: true }).click();
    await page.getByText("Profile saved.", { exact: true }).waitFor();
    await page.getByLabel("First name", { exact: true }).fill("Unsaved");
    await page.getByRole("link", { name: "Career", exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Stay", exact: true }).click();
    if (await page.getByLabel("First name", { exact: true }).inputValue() !== "Unsaved") throw new Error("Dirty profile was lost.");
    await page.getByRole("button", { name: "Discard changes", exact: true }).click();
    await page.getByRole("radio", { name: "Data & Analytics", exact: true }).check();
    await page.getByLabel("Timezone for future activity", { exact: true }).fill("Asia/Manila");
    await page.getByRole("button", { name: "Save preferences", exact: true }).click();
    await page.getByText("Preferences saved.", { exact: true }).waitFor();
    await page.getByLabel("First name", { exact: true }).fill("Still unsaved");
    const settingsNav = page.getByRole("navigation", { name: "Settings sections" });
    await settingsNav.getByRole("link", { name: "Account and security", exact: true }).click();
    await page.getByRole("heading", { name: "Sign-in methods", exact: true }).waitFor();
    await page.waitForFunction(() => {
      const heading = document.querySelector(".settings-content h1");
      const header = document.querySelector(".site-header");
      return heading && header && heading.getBoundingClientRect().top >= header.getBoundingClientRect().bottom;
    });
    for (const name of ["Link Google", "Set up authenticator", "Delete account"]) if (!(await page.getByRole("button", { name, exact: true }).isDisabled())) throw new Error("Unavailable security feature enabled.");
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(output, "cabusao-account.png"), fullPage: true });
    await settingsNav.getByRole("link", { name: "Profile", exact: true }).click();
    if (await page.getByLabel("First name", { exact: true }).inputValue() !== "Still unsaved") throw new Error("Settings tab switch lost edits.");
    await page.getByRole("button", { name: "Discard changes", exact: true }).click();
    await page.reload();
    await page.getByLabel("First name", { exact: true }).waitFor();
    if (await page.getByLabel("First name", { exact: true }).inputValue() !== "Synthetic" || await page.getByLabel("Timezone for future activity", { exact: true }).inputValue() !== "Asia/Manila") throw new Error("Profile/preferences did not persist.");
    checks.push("reference Settings cards, disabled features, profile/preferences readback, dirty dialog and tab preservation");
    stage = "reference_roadmap";
    await page.getByRole("link", { name: "Career", exact: true }).click();
    await page.getByRole("button", { name: "View Data Analyst roadmap", exact: true }).click();
    await page.getByRole("button", { name: "Set as current roadmap", exact: true }).click();
    await page.getByRole("button", { name: "Current roadmap", exact: true }).waitFor();
    await page.locator(".topic-selector").first().click();
    const panel = page.getByRole("complementary", { name: "Topic details" });
    for (const name of ["Overview", "Learning outcome", "Tools and setup", "Links and resources", "Completion"]) await panel.getByRole("heading", { name, exact: true }).waitFor();
    if (await panel.getByText("A separate learning outcome has not been provided for this topic.", { exact: true }).count()) throw new Error("Published outcome was not mapped into its section.");
    await panel.getByRole("button", { name: "Learning", exact: true }).click();
    await panel.locator("header .status-learning").waitFor();
    await panel.getByRole("button", { name: "Done", exact: true }).click();
    await panel.getByText("You marked this topic complete.", { exact: true }).waitFor();
    await page.reload();
    await panel.getByText("You marked this topic complete.", { exact: true }).waitFor();
    await page.screenshot({ path: join(output, "cabusao-roadmap-topic.png") });
    await page.goto(base + "/dashboard");
    await page.getByRole("link", { name: "View milestone", exact: true }).waitFor();
    await page.screenshot({ path: join(output, "cabusao-dashboard.png"), fullPage: true });
    stage = "reference_milestone_landmark";
    await page.getByRole("link", { name: "View milestone", exact: true }).click();
    await page.waitForFunction(() => location.hash.startsWith("#milestone-") && document.activeElement?.id === location.hash.slice(1));
    checks.push("roadmap sections and completion readback, Dashboard milestone landmark");
    stage = "reference_results";
    await page.goto(base + "/welcome");
    await page.getByRole("radio", { name: /Guided Discovery/ }).check();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    let completion;
    for (let question = 1; question <= 5; question++) {
      await page.locator(".question-choices .choice-card").filter({ hasText: "I'm not sure yet" }).click();
      const accepted = question === 5 ? page.waitForResponse(response => response.request().method() === "POST" && new URL(response.url()).pathname.endsWith("/complete")) : null;
      await page.getByRole("button", { name: question === 5 ? "See suggestions" : "Next", exact: true }).click();
      if (question < 5) await page.waitForFunction(value => document.querySelector('[aria-label="Discovery question progress"]')?.getAttribute("aria-valuenow") === String(value), question + 1);
      if (accepted) completion = await (await accepted).json();
    }
    await page.getByRole("alert").filter({ hasText: "Synthetic check:" }).waitFor();
    const stamp = new Date().toISOString();
    const run = { id: randomUUID(), status: "completed", context_revision: 1, catalog_release_id: randomUUID(), prompt_version: "ui-fixture", schema_version: "3", model_id: "synthetic-ui", created_at: stamp, finished_at: stamp, failure_code: null,
      discovery: { session_id: completion.id, revision: completion.revision, questionnaire_id: completion.questionnaire_id },
      items: published.slice(0, 3).map(career => ({ career_id: career.id, roadmap_id: career.roadmap_ids[0], starting_topic_id: null, reason: "Synthetic visual fixture for inspecting the agreed Results layout.", evidence_fact_ids: [], uncertainty_note: "UI fixture only; recommendation persistence is checked separately." })), evidence: [], outdated: false };
    await page.route("**/api/v1/me/recommendations", route => route.request().method() === "GET" ? route.fulfill({ json: { current: run, previous_eligible_success: null, context_revision: 1, catalog_release_id: run.catalog_release_id, available: true, unavailable_reason: null } }) : route.fallback());
    await page.reload();
    await page.locator(".recommendation-card").first().waitFor();
    if (await page.locator(".recommendation-card .card-category").count() !== 3) throw new Error("Result category labels missing.");
    const radio = page.getByRole("radio").first();
    await page.keyboard.press("Tab");
    await radio.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("link", { name: "View selected roadmap", exact: true }).waitFor();
    await page.waitForFunction(() => {
      const card = document.querySelector(".result-selected");
      return card && getComputedStyle(card).backgroundColor === "rgb(40, 107, 159)";
    });
    await page.screenshot({ path: join(output, "cabusao-results.png"), fullPage: true });
    if (await page.getByRole("link", { name: "Back to Discovery", exact: true }).getAttribute("href") !== "/discovery") throw new Error("Results back destination changed.");
    await page.getByRole("link", { name: "Retake Discovery", exact: true }).click();
    await page.getByRole("button", { name: "Retake Discovery", exact: true }).click();
    await page.waitForURL("**/discovery");
    await page.locator(".question-choices").waitFor();
    if (await page.locator(".question-choices input:checked").count()) throw new Error("Retake did not start blank.");
    if (requests !== 1) throw new Error("Unexpected generation on Results revisit/retake.");
    checks.push("Results categories/selection/retake navigation, real blank retake with visual-only result fixture");
    console.log(JSON.stringify({ status: "passed", checks, external_provider_calls: 0, result_fixture: "visual-only; real account writes used for profile/preferences/progress/Discovery" }));
  } else {
  stage = "discovery";
  await page.goto(base + "/welcome");
  await page.getByRole("radio", { name: /Guided Discovery/ }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator(".question-choices .choice-card").first().waitFor();
  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.mouse.move(0, 0);
    const tops = await page.locator(".question-choices .choice-card").evaluateAll(cards => cards.map(card => card.offsetTop));
    await page.screenshot({ path: join(output, "choices-" + width + ".png"), fullPage: true });
    if (new Set(tops).size !== 1 || tops.length !== 5) throw new Error("Choices did not fit one row at " + width + ": " + tops.join(","));
  }
  await page.setViewportSize({ width: 320, height: 800 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw new Error("Discovery reflow overflow.");
  await page.setViewportSize({ width: 640, height: 800 });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) throw new Error("Discovery 200-percent-equivalent reflow overflow.");
  await page.setViewportSize({ width: 1440, height: 900 });
  const input = page.locator(".question-choices input").first();
  await page.keyboard.press("Tab");
  await input.focus();
  if (!(await input.evaluate(element => element.matches(":focus-visible")))) throw new Error("Keyboard focus unavailable.");
  if (await input.evaluate(element => getComputedStyle(element.closest("label")).outlineStyle === "none")) throw new Error("Choice focus outline unavailable.");
  await page.keyboard.press("Space");
  if (!(await input.isChecked())) throw new Error("Keyboard choice did not toggle.");
  checks.push("one row at 1280/1440/1920, keyboard selection, 320/640 CSS reflow");
  for (let question = 1; question <= 5; question++) {
    await page.getByRole("progressbar").filter({ has: page.locator("span") }).waitFor();
    await page.locator(".question-choices .choice-card").filter({ hasText: "I'm not sure yet" }).click();
    await page.getByRole("button", { name: question === 5 ? "See suggestions" : "Next", exact: true }).click();
    if (question < 5) await page.waitForFunction(value => document.querySelector('[aria-label="Discovery question progress"]')?.getAttribute("aria-valuenow") === String(value), question + 1);
  }
  stage = "automatic_results";
  await page.waitForURL("**/recommendations");
  await page.getByRole("alert").filter({ hasText: "Synthetic check:" }).waitFor();
  if (requests !== 1 || await page.getByRole("button", { name: "Prepare suggestions" }).count()) throw new Error("Initial generation was not a single automatic request.");
  await page.getByRole("button", { name: "Try again", exact: true }).waitFor();
  await page.screenshot({ path: join(output, "results-recovery.png"), fullPage: true });
  await page.reload();
  await page.getByRole("heading", { name: "Careers to explore." }).waitFor();
  if (requests !== 1) throw new Error("Results revisit regenerated suggestions.");
  checks.push("saved final submission, one automatic request, explicit retry, no generation on refresh");
  stage = "roadmap";
  await page.goto(base + "/careers");
  await page.getByRole("button", { name: "View Data Analyst roadmap", exact: true }).click();
  await page.getByRole("button", { name: "Set as current roadmap", exact: true }).click();
  await page.getByRole("button", { name: "Current roadmap", exact: true }).waitFor();
  checks.push("published roadmap and explicit focus save");
  stage = "logout_login";
  await page.goto(base + "/settings/profile");
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await page.waitForURL(base + "/");
  await page.goto(base + "/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/dashboard");
  await page.getByRole("heading", { name: "Your next step is here." }).waitFor();
  checks.push("logout/login and populated Dashboard");
  console.log(JSON.stringify({ status: "passed", checks, external_provider_calls: 0, intercepted_generation_requests: requests }));
  }
} catch (error) {
  if (stage.startsWith("reference_") && browser) {
    const failedPage = browser.contexts()[0]?.pages()[0];
    if (failedPage) {
      await failedPage.screenshot({ path: join(output, "cabusao-failure.png"), fullPage: true });
      console.error(JSON.stringify(await failedPage.evaluate(() => ({ path: location.pathname, hash: location.hash, focused: document.activeElement?.id, landmarkExists: !!document.getElementById(location.hash.slice(1)) }))));
    }
  }
  console.error(JSON.stringify({ status: "failed", stage, reason: error.name, detail: stage === "discovery" || stage.startsWith("reference_") ? error.message : undefined, checks }));
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (!uid) {
    const users = await fetch(config.API_URL + "/auth/v1/admin/users?per_page=1000", { headers: admin });
    if (users.ok) uid = (await users.json()).users.find(user => user.email === email)?.id;
  }
  if (uid) {
    const deleted = await fetch(config.API_URL + "/auth/v1/admin/users/" + uid, { method: "DELETE", headers: admin });
    if (!deleted.ok) { console.error("Synthetic account cleanup failed."); process.exitCode = 1; }
  }
}
