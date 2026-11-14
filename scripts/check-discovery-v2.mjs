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
  stage = "running API version and catalog";
  const definition = await api(owner, "discovery/questionnaire");
  assert.equal(definition.version, 2);
  assert.equal(definition.questions.length, 13);
  const v1 = await api(owner, "discovery/questionnaire?questionnaire_id=c43761e3-b78b-5295-9737-e46b93365379");
  assert.equal(v1.version, 1);
  const career = (await api(owner, "careers?limit=100")).items.find(item => item.title === "AI Engineer");
  assert.ok(career?.roadmap_ids[0], "Published AI Engineer roadmap is required");
  const roadmap = career.roadmap_ids[0];
  const learning = await api(owner, "me/learning");
  const progress = await api(owner, "me/roadmaps/" + roadmap + "/progress");
  const skill = (await api(owner, "me/careers/" + career.id + "/competency-comparison")).items[0];
  assert.ok(skill?.id, "A reviewed skill is required for the privacy check");
  const profile = await api(owner, "me/competencies");
  await api(owner, "me/competencies/" + skill.id, {
    method: "PATCH", body: { expected_version: profile.version, level: 1 },
  });

  stage = "signed-in browser and blank Discovery";
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(12000);
  await page.goto(frontend + "/sign-in");
  await page.getByLabel("Email", { exact: true }).fill(owner.email);
  await page.getByLabel("Password", { exact: true }).fill(owner.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.waitForURL("**/dashboard");
  await page.goto(frontend + "/welcome");
  await page.getByText("Guided Discovery", { exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  const choose = label => page.locator(".question-choices").getByText(label, { exact: true }).click();
  const button = name => page.getByRole("button", { name, exact: true });
  const opening = page.getByRole("heading", { name: "Would you like to build on skills or experience you already have?" });
  const blank = async () => {
    await opening.waitFor();
    assert.equal(await page.locator(".question-choices input:checked").count(), 0);
  };
  await blank();
  await choose("Use my experience");
  await button("Next").click();
  stage = "v2 branching, selection limit, reflow and authorization";
  await choose("Build apps, websites, or games");
  await choose("Find answers in data");
  await choose("Design how products look and work");
  assert.equal(await page.locator(".question-choices input:checked").count(), 2);
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false,
      "Discovery has horizontal overflow at " + width);
  }
  await button("Next").click();
  await choose("Add AI features to a product");
  await button("Next").click();
  await choose("Train models and improve how they perform");
  await button("Next").click();
  await page.getByRole("heading", { name: "Which would you rather try first?" }).waitFor();
  await choose("Add AI features to a product");
  await button("Next").click();
  await page.getByRole("heading", { name: "What would you like help with right now?" }).waitFor();
  const draft = (await api(owner, "me/discovery")).draft;
  assert.equal(draft.active_question_ids.length, 6);
  assert.ok(draft.active_question_ids.includes("prefer_ai_ml"));
  assert.equal((await api(other, "me/discovery")).draft, null);
  await api(other, "me/discovery/" + draft.id, { expected: 404 });
  await api(other, "me/discovery/" + draft.id + "/answers", {
    method: "PATCH", expected: 404,
    body: { expected_version: draft.revision, answers: [{ question_id: "goals", option_ids: ["start"] }] },
  });
  await api(owner, "me/discovery/" + draft.id + "/answers", {
    method: "PATCH", expected: 409,
    body: { expected_version: draft.revision - 1, answers: [{ question_id: "goals", option_ids: ["start"] }] },
  });
  await page.reload();
  await choose("Explore a career change");
  await button("See suggestions").click();
  await page.waitForURL("**/recommendations");
  const completed = (await api(owner, "me/discovery")).latest_completed;
  assert.equal(completed.id, draft.id);

  stage = "saved deterministic results, replay and isolation";
  const card = page.locator(".recommendation-card").filter({
    has: page.getByRole("heading", { name: "AI Engineer", exact: true }),
  });
  await card.waitFor();
  const savedState = await api(owner, "me/recommendations");
  const run = savedState.current;
  assert.equal(run.model_id, null);
  assert.equal(run.prompt_version, "discovery-rules-2");
  assert.equal(run.discovery.session_id, completed.id);
  assert.equal(run.items[0].career_id, career.id);
  assert.equal(run.items.length, 3);
  assert.ok(run.items[2].reason.startsWith("Related option:"));
  assert.deepEqual(run.items[0].evidence_fact_ids, ["discovery:prefer_ai_ml:ai_features"]);
  assert.ok(run.evidence.every(fact => fact.source === "discovery"));
  assert.equal(run.skill_profile_version, null);
  assert.equal(run.outdated, false);
  const request = {
    idempotency_key: randomUUID(), expected_context_revision: savedState.context_revision,
    catalog_release_id: savedState.catalog_release_id,
  };
  for (const key of [request.idempotency_key, request.idempotency_key, randomUUID()]) {
    assert.equal((await api(owner, "me/recommendations", {
      method: "POST", expected: 202, body: { ...request, idempotency_key: key },
    })).id, run.id);
  }
  await api(other, "me/recommendations/" + run.id, { expected: 404 });
  const savedSkills = await api(owner, "me/competencies");
  await api(owner, "me/competencies/" + skill.id + "/remove", {
    method: "POST", body: { expected_version: savedSkills.version },
  });
  const afterRemoval = await api(owner, "me/recommendations");
  assert.equal(afterRemoval.current.id, run.id);
  assert.equal(afterRemoval.current.outdated, false);
  assert.equal(afterRemoval.current.payload_erased_at, null);
  assert.equal((await api(owner, "me/recommendations", {
    method: "POST", expected: 202,
    body: { ...request, idempotency_key: randomUUID(), expected_context_revision: afterRemoval.context_revision },
  })).id, run.id);

  stage = "Results to skill comparison and Profile resume handoff";
  const compare = card.getByRole("link", { name: "Compare my skills to this career", exact: true });
  await compare.waitFor();
  await page.getByText(/Considering a career change/).waitFor();
  assert.equal(await card.getByText("Suggestion details").count(), 0);
  assert.equal(await page.locator("details").filter({ hasText: "Suggestion details" }).getAttribute("open"), null);
  assert.ok((await button("Retake Discovery").boundingBox()).y < (await card.boundingBox()).y);
  const cardHeights = {};
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false,
      "Results has horizontal overflow at " + width);
    cardHeights[width] = Math.round((await card.boundingBox()).height);
  }
  assert.equal(await compare.evaluate(element => element.parentElement.firstElementChild === element), true);
  await compare.click();
  await page.getByRole("dialog", { name: "Your experience with this learning path" }).waitFor();
  await page.getByRole("link", { name: "Review skills from a resume" }).click();
  await page.getByRole("link", { name: "Return to skill comparison" }).waitFor();
  const resume = await api(owner, "me/documents/resume-skill-review");
  if (resume.enabled) {
    const picker = page.locator("#resume-career");
    await picker.waitFor();
    assert.equal(await picker.inputValue(), career.id);
  }
  await page.getByRole("link", { name: "Return to skill comparison" }).click();
  await page.getByRole("dialog", { name: "Your experience with this learning path" }).waitFor();

  stage = "full retake from Results and Profile";
  await page.goto(frontend + "/recommendations");
  await button("Retake Discovery").click();
  await blank();
  const retake = (await api(owner, "me/discovery")).draft;
  assert.equal(retake.source_session_id, completed.id);
  assert.deepEqual(retake.answers, [], "Results retake must start without answers");
  await page.goto(frontend + "/settings/profile#saved-discovery");
  await button("Resume Discovery").click();
  await blank();
  await button("Skip").click();
  await choose("I'm not sure yet");
  await button("Next").click();
  await choose("Still not sure");
  await button("Next").click();
  await page.getByRole("heading", { name: "What would you like help with right now?" }).waitFor();
  const pendingGoal = (await api(owner, "me/discovery")).draft;
  const savedGoal = await api(owner, "me/discovery/" + pendingGoal.id + "/answers", {
    method: "PATCH",
    body: { expected_version: pendingGoal.revision, answers: [{ question_id: "goals", option_ids: ["start"] }] },
  });
  await api(owner, "me/discovery/" + pendingGoal.id + "/complete", {
    method: "POST", body: { expected_revision: savedGoal.revision },
  });
  await page.goto(frontend + "/recommendations");
  await page.locator(".recommendation-card").first().waitFor();
  const uncertain = (await api(owner, "me/recommendations")).current;
  assert.equal(uncertain.discovery.session_id, pendingGoal.id);
  assert.equal(await button("Update suggestions").count(), 0);
  assert.equal(await button("Prepare suggestions").count(), 0);
  assert.equal(uncertain.model_id, null);
  assert.equal(uncertain.items.length, 3);
  assert.ok(uncertain.items.every(item => item.uncertainty_note));
  const reserved = spawnSync("docker", ["exec", "-i", "supabase_db_" + local.project,
    "psql", "-X", "-U", "postgres", "-d", "postgres", "-At", "-v", "ON_ERROR_STOP=1",
    "-v", "first=" + run.id, "-v", "second=" + uncertain.id], {
    input: "SELECT count(*) FROM asgard_private.analysis_attempts WHERE recommendation_run_id IN (:'first'::uuid, :'second'::uuid);",
    encoding: "utf8",
  });
  assert.equal(reserved.status, 0, "Could not inspect synthetic run reservation counts");
  assert.equal(reserved.stdout.trim(), "0");
  await page.goto(frontend + "/settings/profile#saved-discovery");
  await button("Retake Discovery").click();
  await blank();
  assert.equal((await api(owner, "me/discovery")).draft.questionnaire_id, definition.id);
  assert.deepEqual(await api(owner, "me/discovery/" + completed.id), completed,
    "Retakes must preserve the completed session");
  const afterLearning = await api(owner, "me/learning");
  assert.equal(afterLearning.current_roadmap_id, learning.current_roadmap_id,
    "Discovery and skill review must preserve learning focus");
  assert.ok(afterLearning.context_revision > learning.context_revision,
    "Discovery completion must invalidate old recommendation context");
  assert.deepEqual(await api(owner, "me/roadmaps/" + roadmap + "/progress"), progress,
    "Discovery and skill review must preserve topic progress");
  console.log(JSON.stringify({
    status: "passed", default_version: 2, v1_readable: true, six_step_and_uncertain_routes: true,
    account_isolation: true, stale_write_rejected: true, reflow_widths: [320, 1440],
    retake_from_results_and_profile: true, skill_resume_round_trip: true,
    resume_career_preselected: resume.enabled, deterministic_run_reuse: true, unrelated_skill_removal: true,
    direct_results_auto_prepared: true,
    result_card_heights: cardHeights,
    external_provider_calls: 0,
  }));
} catch (error) {
  console.error("Discovery v2 check failed at " + stage + ": " + error.message.split("\n")[0]);
  process.exitCode = 1;
} finally {
  try {
    await browser?.close();
  } finally {
    const cleanup = await Promise.allSettled(accounts.map(id => fetch(
      config.API_URL + "/auth/v1/admin/users/" + id,
      { method: "DELETE", headers: admin, signal: AbortSignal.timeout(12000) },
    )));
    const removed = cleanup.filter(result => result.status === "fulfilled" && result.value.ok).length;
    console.log("Disposable accounts removed: " + removed + "/" + accounts.length);
    if (removed !== accounts.length) process.exitCode = 1;
  }
}
