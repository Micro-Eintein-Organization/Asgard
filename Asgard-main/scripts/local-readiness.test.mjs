import test from "node:test";
import assert from "node:assert/strict";
import { applicationIssues, offerContentPublication, prepareLocalSetup } from "./local-readiness.mjs";

const values = { ASGARD_AUTH_ENABLED: "true", ASGARD_DATABASE_URL: "private-placeholder" };
const ready = { auth_enabled: true, database_ready: true, content_ready: true };

test("ready core does not depend on optional Groq", () => {
  assert.deepEqual(applicationIssues(values, { ...ready, groq_configured: false }), []);
});
test("disabled Auth, missing credential and missing content have distinct recovery", () => {
  const issues = applicationIssues({}, {});
  assert.equal(issues.length, 3);
  assert.match(issues[0], /ENABLE AUTH/);
  assert.match(issues[1], /credential setup/);
  assert.match(issues[2], /PUBLISH CONTENT/);
  assert.ok(!issues.join(" ").includes(values.ASGARD_DATABASE_URL));
  assert.equal(applicationIssues(values, { ...ready, database_ready: false }).length, 1);
  assert.equal(applicationIssues(values, { ...ready, content_ready: false }).length, 1);
});
test("declining publication never invokes the publisher", async () => {
  let published = false;
  assert.equal(await offerContentPublication(async () => false, () => { published = true; }), false);
  assert.equal(published, false);
});
test("approved publication uses the existing publisher once and propagates conflicts", async () => {
  let calls = 0;
  assert.equal(await offerContentPublication(async (_, required) => required === "PUBLISH CONTENT", () => { calls++; }), true);
  assert.equal(calls, 1);
  await assert.rejects(offerContentPublication(async () => true, () => { throw new Error("content conflict"); }), /content conflict/);
});

function setupActions(approved, calls = []) {
  return {
    confirm: async (_, required) => { calls.push(required); return approved.includes(required); },
    ...Object.fromEntries(["createSigningKey", "bootstrap", "provision", "enableAuth", "publish"].map(name => [name, async () => { calls.push(name); }])),
  };
}
test("declining initialization performs no bootstrap or credential work", async () => {
  const calls = [];
  assert.equal(await prepareLocalSetup({}, setupActions([], calls)), false);
  assert.deepEqual(calls, ["INITIALIZE"]);
});
test("fresh setup bootstraps before provisioning and honors separate approvals", async () => {
  const calls = [];
  await prepareLocalSetup({}, setupActions(["INITIALIZE"], calls));
  assert.deepEqual(calls, ["INITIALIZE", "createSigningKey", "bootstrap", "provision", "ENABLE AUTH", "PUBLISH CONTENT"]);
});
test("existing setup preserves secrets and publication follows bootstrap", async () => {
  const calls = [];
  await prepareLocalSetup({ hasKey: true, hasDatabaseCredential: true, authEnabled: true }, setupActions(["PUBLISH CONTENT"], calls));
  assert.deepEqual(calls, ["bootstrap", "PUBLISH CONTENT", "publish"]);
});
test("partial credentials and pending migrations stop dependent setup actions", async () => {
  const calls = [];
  await assert.rejects(prepareLocalSetup({ hasDatabaseCredential: true }, setupActions([], calls)), /without its signing key/);
  assert.deepEqual(calls, []);
  const actions = setupActions(["INITIALIZE"], calls);
  actions.bootstrap = async () => { throw new Error("pending migrations"); };
  await assert.rejects(prepareLocalSetup({ hasKey: true }, actions), /pending migrations/);
  assert.deepEqual(calls, ["INITIALIZE"]);
});
