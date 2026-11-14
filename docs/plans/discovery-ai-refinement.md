# Optional AI refinement for Guided Discovery

Prepared by Codex on 2026-11-09 for PM-W05. Owner: Codex. W01 reviewer:
`@YakisobaNissin`, per [CODEOWNERS](../../.github/CODEOWNERS). The owner
requested implementation after discussing one small model request. This
packet defines the proposed shared contract and provider-input boundary for
review. The [deterministic first result](discovery-deterministic-results.md)
remains the default. F-001-AC-08 and the [F-002 evidence and privacy
rules](../specs/career-recommendations.md) apply.

## Learner flow

- Add a collapsed **Refine suggestions** section below the current
  deterministic Results cards. Offer an extra question only if two directly
  supported roles match a reviewed contrast, neither has a stronger signal
  from a saved follow-up, and the answer could change their order. Related
  alternatives alone never trigger a question. Use the priority order AI
  Engineer versus Machine Learning Engineer, UI versus UX, then Cloud
  versus DevOps. Show at most one. Uncertain answers can continue without
  further questions.
- Also offer **Anything else you’d like to explore? (optional)** with a
  300-character limit and a note that pressing **Find preferences** sends
  the entered text to Groq. Ask the learner to leave out personal details.
  Show any extracted preferences as removable options and let the learner
  choose or edit them before applying. Keep manual selection available.
- Applying confirmed preferences changes only the order in the current
  Results view. Promote a shortlist role associated with a confirmed liked
  activity, place a confirmed avoided activity last, and otherwise retain
  the original order. A preference outside the shortlist leaves its order
  intact and offers Browse careers. Reset the preview when the displayed
  run changes. Neither the text nor the refinement changes saved answers,
  suggestions, skills, focus or progress.

## Shared contract for W01 approval

- Add `POST /api/v1/me/recommendations/{run_id}/refine`. Accept only
  `text` (trimmed, 1–300 characters). Authenticate the caller and require
  an owned, current, completed deterministic run with published shortlist
  entries. Reject stale or unavailable runs before reserving a call.
  Return at most four liked and four avoided authored activity IDs, as
  `{likes, avoids}`. Both arrays may be empty. Reject invalid or duplicate
  IDs and overlapping choices. The response contains no model-authored
  rankings, suggested IDs, or explanations.
- Send one bounded structured-output request with the explicit text, the
  allowlisted activity vocabulary, and at most three shortlist titles.
  Apply the existing text safety and contact-redaction helpers before
  dispatch. Never include saved answer text, a resume, skill reports,
  private account IDs or history. Keep the input and output in memory
  for this interaction. Exclude both from logs and durable storage.
- Reuse the existing Groq availability gate and the [Counselor quota
  reservation](../../backend/app/modules/ai_guidance.py), charging the
  same account and application budget as a counselor turn. This use of
  the existing quota needs review. One provider call per explicit click,
  with a short deadline and no automatic AI retry. Recheck run ownership
  and eligibility after the call before returning preferences. Provider
  failure leaves the authored choice and manual preference controls usable.
- Add OpenAPI and generated TypeScript for the endpoint. No database schema,
  new privileges, or dependency change is proposed. Preserve the compact
  Results layout and versioned Discovery and recommendation records.

## Verification

Exercise auth, cross-account rejection, obsolete and retired runs, the
300-character limit, contact redaction, quota, one-call behavior, output
validation, and the manual fallback. Use mocked provider responses. Confirm
the deterministic cards render first, text is sent only on explicit action,
edits apply only after confirmation, and stale responses cannot change the
next run. Record acceptance in the [Discovery implementation guide](../features/guided-discovery-v2.md).
