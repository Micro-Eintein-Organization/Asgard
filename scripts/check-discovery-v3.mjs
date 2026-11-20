import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { chromium } from "../frontend/node_modules/playwright-core/index.mjs";
import { checkedPort, localConfig } from "./dev-config.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const local = localConfig(readFileSync(new URL("../supabase/config.toml", import.meta.url), "utf8"));
const env = parseEnv(readFileSync(new URL("../.env", import.meta.url), "utf8"));
const frontend = "http://127.0.0.1:" + checkedPort(env.FRONTEND_PORT ?? 5173, "FRONTEND_PORT");
const status = spawnSync(process.execPath, [
  fileURLToPath(new URL("../node_modules/supabase/dist/supabase.js", import.meta.url)),
  "status", "--output", "json",
], { cwd: root, encoding: "utf8" });
if (status.status !== 0) throw new Error("The local Supabase stack is unavailable.");
const config = JSON.parse(status.stdout);
assert.equal(config.API_URL, "http://127.0.0.1:" + local.api);
const admin = {
  apikey: config.ANON_KEY,
  Authorization: "Bearer " + config.SERVICE_ROLE_KEY,
  "Content-Type": "application/json",
};
const accounts = [];
let stage = "create disposable accounts";
let browser;
let page;

async function syntheticAccount() {
  const email = "asgard-discovery-v2-" + randomUUID() + "@example.test";
  const password = "synthetic " + randomUUID();
  const created = await fetch(config.API_URL + "/auth/v1/admin/users", {
    method: "POST", headers: admin, signal: AbortSignal.timeout(12000),
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  assert.ok(created.ok, "Synthetic account creation failed");
  accounts.push((await created.json()).id);
  const login = await fetch(config.API_URL + "/auth/v1/token?grant_type=password", {
    method: "POST", signal: AbortSignal.timeout(12000),
    headers: { apikey: config.ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert.ok(login.ok, "Synthetic account login failed");
  return { email, password, token: (await login.json()).access_token };
}

async function api(account, path, { method = "GET", body, expected = 200 } = {}) {
  const response = await fetch(frontend + "/api/v1/" + path, {
    method, signal: AbortSignal.timeout(12000),
    headers: { Authorization: "Bearer " + account.token, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  assert.equal(response.status, expected, method + " " + path);
  return response.json();
}

try {
  const owner = await syntheticAccount();
  const other = await syntheticAccount();
  stage = "v3 publication and experience gate";
  const definition = await api(owner, "discovery/questionnaire");
  assert.equal(definition.version, 3);
  let draft = await api(owner, "me/discovery", { method: "POST", body: { questionnaire_id: definition.id } });
  const checkpoint = (account, answers, expected = 200) => api(account, `me/discovery/${draft.id}/answers`, {
    method: "PATCH", expected, body: { expected_version: draft.revision, answers },
  });
  await checkpoint(owner, [{ question_id: "experience_preference", option_ids: ["use_experience"] }], 422);
  await checkpoint(other, [{ question_id: "experience_preference", option_ids: ["basics"] }], 404);
  stage = "NLP preview, confirmation, stale save and ownership";
  const preview = await api(owner, "me/competencies/interpret", { method: "POST", body: { text: "I used advanced SQL queries and window functions to create reports." } });
  assert.ok(preview.items.length, "Explicit published SQL task should yield a supported match");
  console.log("Semantic interpretation available: " + preview.interpretation_available);
  const skill = preview.items[0].competency_id;
  const before = await api(owner, "me/competencies");
  const confirmed = await api(owner, "me/competencies/confirm", { method: "POST", body: {
    expected_version: before.version, items: [{ competency_id: skill }],
  } });
  assert.equal(confirmed.items.find(item => item.competency_id === skill).evidence_confirmed, true);
  assert.equal(confirmed.items.find(item => item.competency_id === skill).level, null);
  await api(owner, "me/competencies/confirm", { method: "POST", expected: 409, body: {
    expected_version: before.version, items: [{ competency_id: skill }],
  } });
  assert.equal((await api(other, "me/competencies")).items.length, 0);
  const learning = await api(owner, "me/learning");
  stage = "data and security completion";
  const answers = {
    experience_preference: ["use_experience"], interests: ["data", "security"],
    bridge_data_security: ["both"], activities_data: ["analyze"], scenario_analyze: ["analyze"],
    activities_security: ["respond"], scenario_respond: ["respond"],
  };
  for (const [question_id, option_ids] of Object.entries(answers)) {
    draft = await checkpoint(owner, [{ question_id, option_ids }]);
  }
  const completed = await api(owner, `me/discovery/${draft.id}/complete`, { method: "POST", body: { expected_revision: draft.revision } });
  assert.equal(completed.status, "completed");
  stage = "deterministic experience result and cross-account denial";
  const state = await api(owner, "me/recommendations");
  const request = { idempotency_key: randomUUID(), expected_context_revision: state.context_revision,
    catalog_release_id: state.catalog_release_id };
  const result = await api(owner, "me/recommendations", { method: "POST", expected: 202, body: request });
  assert.equal(result.status, "completed");
  assert.equal(result.prompt_version, "discovery-rules-3.1");
  assert.ok(result.items.every(item => item.explanation?.first_topics.length));
  assert.equal((await api(owner, "me/recommendations", { method: "POST", expected: 202, body: request })).id, result.id);
  await api(other, `me/recommendations/${result.id}`, { expected: 404 });
  stage = "signed-in Results rendering and reflow";
  browser = await chromium.launch({ channel: "chrome", headless: true });
  page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(15000);
  await page.goto(frontend + "/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(owner.email);
  await page.getByLabel("Password", { exact: true }).fill(owner.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/dashboard");
  await page.goto(frontend + "/recommendations");
  await page.locator(".recommendation-card").first().waitFor();
  stage = "expanded roadmap reasoning";
  await page.getByText("Answers, experience and roadmap reasoning", { exact: true }).first().click();
  await page.getByRole("heading", { name: "Why this roadmap", exact: true }).first().waitFor();
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
  }
  stage = "support removal and learning preservation";
  const saved = await api(owner, "me/competencies");
  await api(owner, `me/competencies/${skill}/remove`, { method: "POST", body: { expected_version: saved.version } });
  const removed = await api(owner, "me/recommendations");
  assert.ok(removed.current.outdated || removed.current.payload_erased_at);
  const afterLearning = await api(owner, "me/learning");
  assert.equal(afterLearning.current_roadmap_id, learning.current_roadmap_id);
  stage = "retake intake and paired-interest browser route";
  await page.goto(frontend + "/recommendations");
  await page.getByRole("button", { name: "Retake Discovery", exact: true }).click();
  await page.getByText("Use my experience", { exact: true }).click();
  await page.getByRole("heading", { name: "Bring your experience into Discovery" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Next", exact: true }).isDisabled(), true);
  await page.getByText("Start with the basics", { exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByText("Find answers in data", { exact: true }).click();
  await page.getByText("Find and fix security weaknesses", { exact: true }).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByRole("heading", { name: /Suspicious activity appears/ }).waitFor();
  assert.equal(await page.locator(".question-choices").getByText("Find the security risk", { exact: true }).count(), 1);
  await page.screenshot({ path: "tmp/discovery-v3-data-security.png", fullPage: true });
  console.log("PASS: local v3 experience gate, NLP confirmation, stale writes, two-account isolation, result reuse/removal, browser Results and reflow");
} catch (error) {
  if (page) console.error("Browser state: " + (await page.locator("body").innerText()).slice(0, 2500));
  console.error("Discovery v3 check failed at " + stage + ": " + error.message.split("\n")[0]);
  process.exitCode = 1;
} finally {
  await browser?.close();
  for (const id of accounts) {
    const response = await fetch(config.API_URL + "/auth/v1/admin/users/" + id, {
      method: "DELETE", headers: admin, signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) process.exitCode = 1;
  }
  console.log("Disposable account cleanup attempted: " + accounts.length);
}
