# Career Catalog Expansion: 11 New Roadmaps

- Implementer: Antigravity
- Created: 2026-11-04
- Last updated: 2026-11-04
- Status: Content authored and validated; local release 5 rendered; curriculum review pending
- Requirements: [REQ-02, REQ-03 and REQ-07](../product.md)
- Reviewer: project owner, mapped in [CODEOWNERS](../../.github/CODEOWNERS)

## Implemented Behavior

Expanded Asgard from 12 to 23 published career roadmaps by authoring 11 industry-aligned careers structured in accordance with Asgard's v4 curriculum schema (6 milestones and 24 topics per career, totaling 264 new topics):

1. **Backend Developer** (`backend-developer`) — Software and AI
   - Client-server HTTP, REST design, asynchronous runtimes, relational data modeling (PostgreSQL), authentication/passwords (Argon2/bcrypt), Redis caching, task queues, Docker, and API testing.
2. **Full Stack Developer** (`full-stack-developer`) — Software and AI
   - End-to-end web architecture, TypeScript foundations, component UI, client state, modular backend APIs, server-side rendering (SSR), server actions, cloud uploads, WebSockets, and Playwright E2E testing.
3. **Mobile Developer** (`mobile-developer`) — Software and AI
   - iOS and Android platform architecture, React Native / Flutter toolchains, flexbox layouts, touch gestures, navigation stacks, offline SQLite persistence, camera and location hardware, and app store release management.
4. **Game Developer** (`game-developer`) — Software and AI
   - Game engine loops, 2D tilemaps, rigidbody physics, player input controllers, finite state machines, sprite animation, audio mixing, canvas HUDs, save/load serialization, and frame rate optimization.
5. **AI Engineer** (`ai-engineer`) — Software and AI
   - Generative AI concepts, prompt engineering, token mechanics, vector embeddings, vector databases (Chroma/pgvector), Retrieval-Augmented Generation (RAG), tool-calling, agentic ReAct loops, safety guardrails, and LLM tracing.
6. **Data Scientist** (`data-scientist`) — Data & Analytics
   - Numerical programming with NumPy, pandas dataframes, exploratory data analysis (EDA), inferential statistics, hypothesis testing, A/B testing, feature scaling, scikit-learn models, XGBoost, and SHAP explainability.
7. **Business Intelligence (BI) Analyst** (`bi-analyst`) — Data & Analytics
   - Decision support lifecycle, KPI metric frameworks, dimensional modeling (star schema, fact/dimension tables), advanced SQL window functions, interactive dashboard visual design, calculated DAX measures, and row-level security.
8. **Cloud Engineer** (`cloud-engineer`) — Networking & Infrastructure
   - Cloud service models, multi-AZ resilience, cloud CLI, compute instances, auto-scaling groups, application load balancers, VPC CIDRs, subnets, NAT gateways, Route 53, S3 storage, and Infrastructure as Code with Terraform.
9. **System Administrator** (`system-administrator`) — Networking & Infrastructure
   - Linux Filesystem Hierarchy Standard, text redirection and pipes, sudo privileges, user/group administration, SUID/SGID permissions, hardened OpenSSH, LVM dynamic storage, systemd service units, cron, and UFW firewalls.
10. **Cloud Security Engineer** (`cloud-security-engineer`) — Cybersecurity
    - Cloud shared responsibility, IMDSv2 metadata protection, CIS Benchmarks, zero-trust architecture, granular IAM condition policies, VPC perimeter defense, cloud WAF, KMS envelope encryption, and container CVE scanning.
11. **Linux Systems Engineer** (`linux-systems-engineer`) — Hardware & Embedded Systems
    - Kernel vs user space architecture, system call interface, virtual memory and swap, /proc and /sys filesystems, POSIX shell scripts, C compilation with Makefiles, low-level file I/O, IPC (pipes, shared memory, semaphores), loadable kernel modules (LKM), and eBPF observability.

## Relevant Files

- Curriculum definitions: [`backend/app/content/guide_v4/`](../../backend/app/content/guide_v4/)
  - `backend-developer.json`
  - `full-stack-developer.json`
  - `mobile-developer.json`
  - `game-developer.json`
  - `ai-engineer.json`
  - `data-scientist.json`
  - `bi-analyst.json`
  - `cloud-engineer.json`
  - `system-administrator.json`
  - `cloud-security-engineer.json`
  - `linux-systems-engineer.json`
- Resource mappings: [`backend/app/content/topic-resources.json`](../../backend/app/content/topic-resources.json)
- Generator & Data scripts:
  - [`backend/scripts/data_additional_careers.py`](../../backend/scripts/data_additional_careers.py)
  - [`backend/scripts/careers_batch_1.py`](../../backend/scripts/careers_batch_1.py)
  - [`backend/scripts/careers_batch_2.py`](../../backend/scripts/careers_batch_2.py)
  - [`backend/scripts/careers_batch_3.py`](../../backend/scripts/careers_batch_3.py)
  - [`backend/scripts/generate_additional_careers.py`](../../backend/scripts/generate_additional_careers.py)
  - [`backend/scripts/render_guide_expansion.py`](../../backend/scripts/render_guide_expansion.py)
- Release 5 migration: [`supabase/content/20261104_guide_expansion_11_careers.sql`](../../supabase/content/20261104_guide_expansion_11_careers.sql)
- Inspection tool: [`backend/scripts/inspect_guide_v4.py`](../../backend/scripts/inspect_guide_v4.py)

## Verification

- Ran `py backend/scripts/inspect_guide_v4.py`:
  - Validated all 23 roadmaps (12 existing + 11 new).
  - All 23 files passed structural inspection with exactly 6 milestones and 24 topics each.
  - Zero duplicate field differences (`duplicate_field_differences: []`).
  - Zero circular or missing prerequisites.
  - Verified valid milestone membership across all 552 topics.
- Ran `py backend/scripts/convert_guide_v4.py` on the generated curriculum packs; verified deterministic UUID identity generation, Markdown explanation compilation, and resource presentation parsing.
- Ran `py backend/scripts/render_guide_expansion.py`:
  - Successfully emitted `20261104_guide_expansion_11_careers.sql` containing 876 SQL migration statements guarded by pg_advisory_xact_lock and release 5 transaction version assertions.

## Known Limitations

- All resources link to official free documentation (MDN, PostgreSQL, Docker, AWS, Microsoft Learn, Linux man pages, etc.). While all URLs follow HTTPS standards and authoritative publisher domains, independent link live-connectivity and accreditation review remain ongoing maintenance tasks.

## Local 23-career rollout, 2026-11-08

Codex implemented REQ-02, REQ-03 and REQ-07 with owner YakisobaNissin's approval. The downloaded main snapshot supplied the 11 new guides and release 5 while GitHub DNS was unavailable. The original guides, published identities and saved learner records are preserved. Release 6 repairs 19 topic links sharing 15 failed URLs. All 251 original new destinations were checked with normal HTTPS validation and all replacements returned HTTP 200.

The [catalog publisher](../../scripts/content-publication.mjs) installs release 6 after the preserved release 5. The [historical guide renderer](../../backend/scripts/render_guide_release.py) and [resource renderer](../../backend/scripts/render_topic_resource_release.py) reproduce the release 3 and 4 SQL from the original roster. The disposable upgrade passed with 23 published roadmaps and 552 topics, repeat publication, saved-state preservation and conflict rollback.

For a signed-in check, open Careers, select Backend Developer, set it as the current roadmap, open the JWT and session tokens topic, and follow the corrected OWASP resource. Mark the topic Done and reload. The saved state should still display Done. See the [skill mappings](competency-comparison.md#expanded-local-skill-mappings-2026-11-08) and [occupational evidence](career-evidence-recommendations.md#expanded-local-reference-release-2026-11-08) for the rest of the rollout.

Normal local publication completed on 2026-11-08 with release 6 (`3463d194-1b73-55b0-972f-c9584a118a6f`). Pre- and post-publication fingerprints matched for all 25 private tables. The signed-in smoke check verified Backend Developer's corrected resource, focus selection and persisted topic progress using a disposable account.
