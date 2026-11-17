> Implementation record. Dated sections preserve their original evidence and limitations. For current behavior and activation status, use the [documentation baseline](../README.md) and linked owning specifications. Earlier plans do not override later recorded decisions.

# ESCO reference catalog

Implementer: Codex. Created and updated 2026-11-05. Requirements PM-W02, PM-W04 and FUT-01. Status is offline staging and draft mapping review. Technical reviewer @YakisobaNissin approved the implementation plan and removed the deferral on 2026-11-05. Independent data/content reviewer is unassigned. [Scope resolution](../decisions.md#esco-integration-scope-resolution-2026-11-05)

## Offline import

Run the [standard-library importer](../../backend/scripts/import_esco.py) from the checkout root with Python 3.12 or newer and the path to the original ESCO v1.2.1 English CSV ZIP. This is a maintainer command outside the normal Docker startup workflow.

```powershell
python -B backend/scripts/import_esco.py '<path to the ESCO ZIP>'
```

The importer prints a manifest and stores it in `staging.sqlite3` alongside the verified archive under `.local/esco/v1.2.1/`. Git ignores both artifacts. The source rows retain their CSV member and logical record number, with the header as record 1. All 181,562 data records are staged. The occupation CSV's 3,043 records represent 3,039 distinct URIs and the skill CSV's 13,960 records represent 13,939 distinct URIs. The repeated rows differ only by modification date. The indexed 126,051 occupation–skill links retain their source relationship type and resolve to staged concepts.

## Draft mapping review

Codex compared candidate occupation descriptions and linked skill labels in the pinned archive. Each candidate key is the UUID suffix of `http://data.europa.eu/esco/occupation/`. The dispositions below are draft judgments. Each needs independent review and source reuse clearance before inclusion in a release.

| Asgard career | ESCO candidate key | Draft disposition and basis |
| --- | --- | --- |
| Frontend Developer | `866c7813-2c03-47d7-9bdc-192cfbace57c` | Accept as related. Interface implementation and stylesheet work overlap. General web developer `c40a2919-48a9-40ea-b506-1f34f693496d` is rejected as an equivalent. |
| Data Analyst | `d3edb8f8-3a06-47a0-8fb9-9b212c006aa2` | Accept as related. Data quality, statistical analysis, and visualisation overlap. |
| UI Designer | `96e20037-0a25-4bf6-a25e-808d1605d890` | Accept as related. Interface design, wireframing, and accessibility overlap. |
| UX Designer | `faed411a-f920-4100-86a8-b877928b429c` | Accept as partial. User research, interviews, and prototyping cover part of the design role. |
| Data Engineer | `2079755f-d809-49e6-8037-4de6180e54c0` | Accept as related. Pipeline infrastructure, databases, and warehousing overlap. |
| Machine Learning Engineer | `35553663-deab-4d9a-bf22-15c1625d28e8` | Accept as partial. Programming and neural networks overlap. Its robotics and knowledge-system scope is broader, and ML deployment coverage remains unresolved. |
| Network Engineer | `cf2b03cd-feb7-4f47-90f6-ff1ed6016d3d` | Accept as related. Routing, network design, and performance analysis overlap. |
| Cybersecurity Analyst | `a44a1dc5-be08-4840-8bd5-770c4ac1ca6d` | Accept as partial for attack vectors and countermeasures. The technician also implements security measures and provides training. Analyst equivalence remains unresolved. |
| Penetration Tester | `76ef0a87-6afe-4560-b5d0-9a086abe45c5` | Accept as related. The description covers penetration tests and vulnerability assessments, supported by security testing and penetration-testing tool links. |
| Hardware Engineer | `92bb3d8c-8a9f-4cd7-80ec-247bbf173004` | Accept as partial. Board design and prototype testing overlap within the computer hardware scope. |
| Embedded Systems Developer | `57af9090-55b4-4911-b2d0-86db01c00b02` | Accept as related. Firmware-adjacent software, device drivers, and debugging overlap. |
| DevOps Engineer | `cc867bee-ab5c-427f-9244-f7a204d9574b` | Accept as partial. Continuous delivery, deployment, and automation overlap. The ESCO scope focuses on cloud workloads. |

## Verification and pending work

The full import and byte-identical repeat passed. SQLite integrity, inventory counts, draft mapping IDs, and the pending clearance state were verified. A modified ZIP and a conflicting existing staging database were rejected. To verify locally, run the import twice, check for 19 members in the printed manifest, and confirm both commands succeed. Report a failure with the command's error and the archive's SHA-256.

The member inventory marks reuse clearance pending. Start review with the [ESCO notice](../../licenses/esco.md) and [occupational data notices](../../licenses/README.md). Record clearance at the applicable table, field, or record level. Recommendation activation additionally requires the [AI quality gate](../verification.md#ai-quality-gate).

## Expanded digital and computing screening, 2026-11-05

Codex implemented the offline review packet for PM-W02, PM-W04, and FUT-01. The approved scope includes roles beyond the existing 12 Asgard careers. New ESCO-only roles are planned as browseable references. Personalized recommendations require an approved Asgard career, roadmap, and evidence mapping.

Run from the checkout root after staging the pinned archive:

```powershell
python -B backend/scripts/screen_esco.py
```

The command writes `occupations.csv`, `skills.csv`, and `manifest.json` to the ignored `.local/esco/v1.2.1/review-digital-computing-v2/` directory. It regenerates byte-identical output on repeat and rejects conflicting output to preserve reviewer edits. The manifest binds the packet to the archive and screening policy and records file hashes, attribution, and adaptation notes.

The draft rules screened all 3,039 distinct occupations. They marked 116 included, 304 for further review, and 2,619 excluded. The second policy version routes adjacent commercial and education titles to review. The ledger includes all 20,807 occupation–skill links for the included and uncertain occupations, with 8,984 provisionally included and 11,823 for further review. Every row carries a source record locator, a draft rationale, pending reuse status, and ineligible recommendation status. Title, scope, ICT codes and digital-skill signals support triage. A reviewer must resolve ambiguity, audit exclusions for missed roles, and assess transferable skills in context before the counts can describe publishable coverage.

The manifest records zero cleared records. A release candidate with publishable data requires the independent content and reuse decisions. The independent reviewer remains unassigned.

## App browse integration, 2026-11-05

Implemented the schema-only local app integration under the project owner's explicit request and approval. The [ESCO migration](../../supabase/migrations/20261105000200_esco_reference.sql) adds a separately versioned concept, relationship, and career mapping store. Activation seals a release and switches the pointer transactionally. Only administrators can activate or roll back the pointer. The runtime role can read the active release through the existing authenticated API boundary.

The [ESCO API](../../backend/app/modules/careers/esco.py) exposes paginated concept search and related concepts, with an expected release guard. The [catalog page](../../frontend/src/features/catalog/esco.tsx) includes search, concept type, original source, release attribution, and roadmap links where available. Existing career Sources and limitations pages show mappings from the active ESCO release.

The schema migration was applied to the local Supabase database after a dry run listed only the ESCO migration. A follow-up dry run was current. A rollback-only database probe passed active-only visibility, restricted-role privileges, immutability, and rollback between synthetic releases. TypeScript, targeted ESLint, backend Ruff, OpenAPI drift and explicit TypeScript regeneration comparison passed. The frontend wrapper for contract checking hit a Windows temporary-path error. An explicit output path produced a byte-identical generated contract.

Manual verification pending. Sign in at the local app and open [ESCO reference](http://127.0.0.1:5173/catalog/esco). With no published release, the page should show **ESCO data is awaiting publication**. After a cleared test release is activated, verify preferred and alternate-label search, type filters, related concepts, source attribution, roadmap links, and a reference-only occupation. Report the navigation and actual result if any step fails.

The schema migration contains no ESCO records. Keep all staged data offline until independent review clears the records for the release.

## Publication and recommendation preparation, 2026-11-05

The [offline release renderer](../../backend/scripts/render_esco_release.py) prepares the catalog SQL and optionally the occupational recommendation SQL. It never connects to a database or activates a release. Keep the review input and rendered bundle in the ignored local staging directory until the concrete publication bundle is reviewed.

The independent approval file is JSON. Use the pinned `archive_sha256` and recorded references in `content_review` and `reuse_review`. List `concepts` as a map from source URI to cleared fields. Every approved concept needs `preferredLabel`; add `altLabels` or `description` only where the reviewer cleared them. List `links` as triples of occupation URI, skill URI, and source relationship. List `mappings` as pairs of Asgard career UUID and occupation URI. For recommendation evidence, provide a separate `recommendation_links` list of career UUID, occupation URI, skill URI, and relationship. The renderer verifies those references against the cleared catalog and the base occupational release.

From the checkout root, run `python -B backend/scripts/render_esco_release.py <approval.json> <output-directory>` after review. To prepare recommendation SQL as well, pass `--base-occupational <reviewed-base-payload.json>` using the approved occupational release's canonical payload. Verify the resulting manifest and SQL digests before applying either bundle. Catalog SQL stages the release; the approved administrative activation call seals it. Occupational SQL stages a separate immutable release, which needs its own activation after the model evaluation. This leaves rollback to the existing pointer mechanisms.

Recommendation generation supports a distinct ESCO occupation–skill reference with the source relationship, archive version, and record locator. Report-linked references retain priority, and all sources share the existing six-reference limit per career. ESCO citations are pinned to the occupational release and validated against the selected career. The app renders the original essential or optional label as occupational context. It does not use these labels as personal proficiency targets.

Verification passed after both paths were implemented. The renderer reproduced identical SQL, withheld fields outside the clearance list, and rejected missing clearance and cross-career recommendation mappings. A rollback-only PostgreSQL probe executed rendered SQL and read the resulting synthetic release through the restricted app role. Seven occupational context and renderer tests passed from the checkout. The initial container invocation could not find the existing occupational fixture paths, so the pure-Python tests were rerun from the checkout. Backend Ruff, OpenAPI generation, and TypeScript passed. Real ESCO publication, signed-in browser acceptance with a cleared release, and live model evaluation remain pending.

## Owner-reviewed local browse release, 2026-11-05

The owner, @YakisobaNissin, identified themselves as the reviewer and approved integration in chat. Codex treated that as approval for a bounded local catalog release under the Commission's ESCO reuse conditions. The [decision record](../decisions.md#esco-integration-scope-resolution-2026-11-05) records this scope.

Local release `7789e387-6e48-592a-b8ee-edc651be08f9` was staged and activated in one transaction. It contains 101 occupation URIs and preferred labels, with related reference mappings for the 12 Asgard careers. Of the 116 draft-included occupations, 15 commercial or tool-operation roles were withheld after reviewing the labels against the digital and computing scope. The 304 uncertain occupations and all excluded occupations remain offline. The release omits skill links, descriptions, alternative labels and ISCO content. Its approval file, manifest and SQL are under the ignored `.local/esco/v1.2.1/owner-approved-local-browse/` directory.

No tests or model calls were run for this activation at the owner's request. The database command confirmed activation. Signed-in browser verification remains pending. Recommendation evidence remains inactive pending cleared skill relationships and the recorded model-quality gate. No hosted release was applied.

## Skill-link release review, 2026-11-05

Prepared 36 proposed essential occupation–skill links, three per mapped Asgard career. The local review CSV contains each skill label and description, occupation and skill URIs, and exact CSV locators for both the skill and the relationship. The candidate JSON retains the 101 published occupation labels and the 12 existing mappings. It adds only the proposed skill labels and available descriptions, with no hierarchy, alternative labels, or ISCO fields. The approval fields remain blank pending review of this specific list and its reuse scope.

The review CSV, candidate JSON and base occupational payload are in the ignored `.local/esco/v1.2.1/skill-link-review/` directory. The base payload was read from the active local occupational release so that preparing the new recommendation release preserves existing source evidence. Use the offline renderer after approving the candidate. Activate catalog links first. Recommendation activation still requires the model evaluation recorded above.

Recommendation cards now display the label and description for these references. The required acknowledgement remains in the reference catalog, and citation provenance remains in the saved occupational release and recommendation records. Tests and model calls remain deferred at the owner's request.

## Local skill-link publication, 2026-11-05

The owner and reviewer, @YakisobaNissin, explicitly approved the 36-link review list and end-to-end local integration in chat. Codex rendered and applied the hash-verified bundles from `.local/esco/v1.2.1/skill-link-review/release/`. Catalog release `b8d75823-c03a-52bf-84be-b657427d1eac` is active with 101 occupations, 36 skills, 36 essential relationships, and 12 career mappings. The prior catalog release is retained for rollback.

Occupational release `dc91901a-b654-5ecc-bf8d-549e9923f698` is staged locally with 36 ESCO recommendation references. The previous occupational release remains active. The release preview confirmed three ESCO references per mapped career within the shared six-reference limit and confirmed that the original occupational payload was preserved apart from the additions.

TypeScript and seven focused occupational tests passed. Docker initially stopped and prevented the authenticated check. After restoring Docker and starting Asgard, a disposable signed-in account verified the occupation and skill counts, Data Analyst search and related concepts, the career mapping, and HTTP 409 for an outdated catalog release. The account was removed.

Browser visual verification remains pending. Open [ESCO reference](http://127.0.0.1:5173/catalog/esco), search **Data Analyst**, open the occupation, and expect three linked skills and an Asgard career link. On that career's **Sources and limitations** page, expect the published reference and service attribution. The [AI quality gate](../verification.md#ai-quality-gate) still requires the two-model evaluation and scores from two reviewers before recommendation activation. No live model calls or hosted changes were made.

## Owner-directed local recommendation activation, 2026-11-06

The owner directed that W04 activate the staged ESCO-backed recommendation
release locally without waiting for the two-model evaluation. That evaluation is
waived for this local activation and remains not run, not passed. This direction
does not authorize hosted publication or claim that recommendation quality was
established.

Codex activated release `dc91901a-b654-5ecc-bf8d-549e9923f698` locally after
the owner's implementation request. The committed pointer readback confirmed
the new release and its 12 career profiles. The app role's SELECT grant was
confirmed, but the database session could not assume that role. A signed-in
recommendation run remains unverified. The previous release
`3a8c465a-4789-536a-ba20-8057ba924952` is retained for rollback.
