# Research artifact verification

Date: 2026-11-03. Scope: revised [paper](asgard-consolidated-paper.md), [original-paper alignment review](original-paper-alignment-review.md), [initial consolidation review](consolidation-review.md), planning cross-references, and exported PDF at `output/pdf/asgard-consolidated-paper.pdf` from the checkout root. This record supersedes the earlier 11-page artifact check.

## Evidence

- Passed: PDF generation with bundled Python/ReportLab; 13 Letter-sized pages and approximately 5,068 source words. Editable Markdown is the source of the PDF.
- Passed: all 13 pages rendered with bundled Poppler and visually inspected. No clipping, overlapping text, broken references, missing visible glyphs, or isolated headings found. Poppler emitted Symbol/ArialUnicode display-font notices; visible Times text and reference URLs rendered correctly.
- Passed: exact source/PDF text parity after removing Markdown headings, page numbers, and whitespace; all nine reference URLs present as PDF link annotations.
- Passed: local research-document paths/anchors, ten-feature coverage, methodology-section presence, and whitespace checks. Checks inspect new files directly because ordinary Git diff does not include untracked contents.
- Passed: explicit coverage review of the newly supplied original's objectives, pipeline, exclusions and claims. Retained intent, altered promises, deferred extraction/market work and unresolved methodological details are documented separately.
- Reused evidence: accessible primary-source checks from the initial consolidation and subsequent consultation, including Watson's DSS framework discussion. Nine references are retained for restricted claims; no new full-text literature review is claimed. Unverified original citations are not carried forward as claim support.

## Not run and remaining gates

Application, provider, database, ownership/security, and browser acceptance were not run because this task changes research artifacts only. No new runtime or data/mapping acceptance is claimed. Participant studies, ethics review, mapping/content review, final study instrument selection, sample-size justification, and adviser approval remain pending. The PDF is a research proposal, not a completed-results paper.

Existing modified files were preserved. No existing feature/backlog status, contracts, dependencies, services, Git history, or publication state was changed. A feature implementation guide is unnecessary for this document-only task.

## Separate general-audience edition

On 2026-11-03 the user requested another copy reflecting the broader audience. The [general-audience paper](asgard-general-audience-paper.md) and `output/pdf/asgard-general-audience-paper.pdf` are separate outputs. SHA-256 checks confirm the CS-student Markdown and PDF were preserved byte-for-byte during this copy operation.

Audience review: [Product](../product.md#product-scope) already describes adults across experience levels rather than CS-only users. The [post-MVP audience direction](../post-mvp-first-implementation.md#latest-proposed-direction) records all ages/levels but leaves younger-user policies unresolved. The new edition therefore includes all educational/current-career backgrounds, broadens proposed adult recruitment, retains current 18+ eligibility, and separates intended audience from initial technology-career coverage. It does not claim that every profession is supported or that a technology/student pilot validates every population. Student populations in cited research and all nine references remain unchanged.

Passed: 14-page general-audience PDF generated; all pages visually inspected; exact normalized Markdown/PDF text parity; nine clickable reference URLs; audience, age and coverage checks; local links and whitespace. Poppler's display-font notices were unchanged and produced no visible defect. No application changes, new study results, or general-population effectiveness acceptance are claimed. Final source/rule/selection and participant-protocol reviews remain pending.
