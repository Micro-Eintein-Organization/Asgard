# Occupational v1 research packet

Prepared by Codex on 2026-11-04 at the project owner's request. **Inactive research
material, not reviewed publication or runtime recommendation input.** No independent
content reviewer is assigned. Source-specific reuse review remains pending.

The CSVs preserve the existing curation's records and source-native meanings.
`manifest.json` freezes file hashes and groups every linked occupation, competency,
rating and task under the twelve current application careers without a ten-item cap.
The owner supplied the original files on 2026-11-04. All 20 files matched the
recorded SHA-256 and byte sizes; the manifest records that verification without
storing a machine-specific input path. Hash matching establishes correspondence
with the inventory, not official provenance or semantic approval.
Original documents and cached whole-page text were not copied into this packet.

The source registry records attribution, source URLs and reuse notes. In particular,
SRC-10 identifies O*NET 31.0 and its CC BY 4.0 license with exceptions. Do not infer
that its terms apply to the Philippine source records. This packet must not be
published or represented as approved until source verification, reuse review,
semantic decisions and the required approvals are recorded.

From the checkout root, the verified structural check is:

```text
python backend/scripts/prepare_occupational_release.py
```

This authoring check uses the standard library and existing guide converter. It
does not change the supported Docker-based application setup or require host Python
for contributors. It does not access ignored caches, publish data, or change SQL.
`--verify-originals DIRECTORY` verifies an explicitly supplied originals folder
without copying documents or persisting that local path.

Preparation from an explicit research directory is a separate operation; it never
sets publication readiness. Generation alone is not semantic review.

See [implementation status](../../../../../docs/features/career-evidence-recommendations.md)
and [contract proposal](../../../../../docs/specs/career-evidence-integration.md).

## Agent review packet

See [review-summary.md](review-summary.md), `review-policy.json` and
`agent-review.json`. The scope policy and partial topic pairings are explicit;
record classifications are policy-assisted and conservative. This is not individual
expert validation. The packet includes all career-linked records without a ten-skill
cap and keeps all inference/publication flags false. The manifest freezes review
artifact hashes. Independent content reviewer assignment remains pending.
