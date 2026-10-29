import { readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";

export async function publicationAcceptance({ root, project, config, backend, publish }) {
  const email = "asgard-publish-" + randomUUID() + "@example.test";
  const password = "synthetic " + randomUUID();
  const admin = { apikey: config.ANON_KEY, Authorization: "Bearer " + config.SERVICE_ROLE_KEY,
    "Content-Type": "application/json" };
  const created = await fetch(config.API_URL + "/auth/v1/admin/users", {
    method: "POST", headers: admin, body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!created.ok) throw new Error("Synthetic publication account could not be created.");
  const uid = (await created.json()).id;
  try {
    const login = await fetch(config.API_URL + "/auth/v1/token?grant_type=password", {
      method: "POST", headers: { apikey: config.ANON_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!login.ok) throw new Error("Synthetic publication login failed.");
    const token = (await login.json()).access_token;
    async function api(path, body) {
      const response = await fetch(backend + "/api/v1/" + path, {
        method: body ? "PATCH" : "GET",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!response.ok) throw new Error("Publication API check failed: " + path + " " + response.status);
      return response.json();
    }
    const catalog = (await api("careers")).items;
    const career = catalog.find(c => c.slug === "data-analyst");
    if (!career || catalog.length !== 3) throw new Error("Starter catalog is incomplete.");
    const path = await api("roadmaps/" + career.roadmap_ids[0]);
    if (path.revision !== 1) throw new Error("Upgrade acceptance must start at release 1.");
    const learning = await api("me/learning");
    await api("me/learning", { expected_version: learning.version, roadmap_id: path.id });
    const group = path.milestones.flatMap(m => m.branch_groups)[0];
    const branch = group.branches[0];
    await api("me/roadmaps/" + path.id + "/branches/" + group.id,
      { expected_version: 0, branch_id: branch.id });
    const topic = path.milestones.flatMap(m => m.topics).find(t => !t.branch_id);
    await api("me/roadmaps/" + path.id + "/topics/" + topic.id,
      { expected_version: 0, status: "done" });
    const month = new Date().toISOString().slice(0, 7);
    const resources = ["me/learning", "me/roadmaps/" + path.id + "/branches",
      "me/roadmaps/" + path.id + "/progress", "me/activity?month=" + month];
    const before = await Promise.all(resources.map(p => api(p)));
    publish();
    publish();
    const after = await Promise.all(resources.map(p => api(p)));
    if (JSON.stringify(before) !== JSON.stringify(after))
      throw new Error("Content upgrade changed saved learning state or activity.");
    const upgraded = await api("roadmaps/" + path.id);
    const summary = await api("me/roadmaps/" + path.id + "/summary");
    if (upgraded.id !== path.id || upgraded.milestones.length !== 5 ||
        upgraded.milestones.flatMap(m => m.topics).length !== 24 ||
        summary.applicable !== 20 || summary.done !== 1 || summary.percentage !== 5)
      throw new Error("Detailed roadmap counts or identities are incorrect.");
    for (const item of catalog)
      for (const id of item.roadmap_ids) await api("roadmaps/" + id);
    function sql(input) {
      return spawnSync("docker", ["exec", "-i", "supabase_db_" + project, "psql",
        "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-At"], {
        input, encoding: "utf8", maxBuffer: 4 * 1024 * 1024,
      });
    }
    const originalTitle = sql("SELECT title FROM asgard_catalog.topics WHERE id='" + topic.id + "';");
    if (originalTitle.status !== 0) throw new Error("Cannot read content before conflict check.");
    const revision = readFileSync(join(root, "supabase/content/20261029_data_analyst.sql"), "utf8")
      .replace(/^\uFEFF/, "").replace(/^BEGIN;\s*/, "").replace(/COMMIT;\s*$/, "");
    const conflict = sql("BEGIN; UPDATE asgard_catalog.topics SET title='Synthetic conflict' WHERE id='" +
      topic.id + "';\n" + revision + "\nROLLBACK;");
    if (conflict.status === 0) throw new Error("Conflicting content was incorrectly accepted.");
    const restoredTitle = sql("SELECT title FROM asgard_catalog.topics WHERE id='" + topic.id + "';");
    if (restoredTitle.status !== 0 || restoredTitle.stdout !== originalTitle.stdout)
      throw new Error("Conflict rejection did not roll back atomically.");
    console.log("Publication acceptance passed: fresh release 1, preserved saves, release 2, repeat and conflict rollback.");
  } finally {
    const response = await fetch(config.API_URL + "/auth/v1/admin/users/" + uid,
      { method: "DELETE", headers: admin });
    if (!response.ok) throw new Error("Synthetic publication account cleanup failed.");
  }
}
