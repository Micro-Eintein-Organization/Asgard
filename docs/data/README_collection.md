# Hand-collected posting records

Use this template for a small, reviewed sample of Philippines-based, junior or entry-level job postings.

- Record only the job title, company, page URL, date viewed, and skill labels in your own short words. Do not paste job description text.
- Copy `source_url` from the browser address bar. It must be the real posting page URL and must open when re-checked.
- Set `retrieved_on` to the exact date you viewed the page, in `YYYY-MM-DD` format.
- Separate short skill labels with `|`, for example `Python|PostgreSQL|Git`. Do not use sentences.
- Aim for 2–3 postings per Asgard career, junior or entry level, in the Philippines. Do not collect 20 postings for the same role.
- Use only sites whose terms you have read and that allow normal manual viewing. Collect by hand; do not use automated tools to collect postings.
- Propose an Asgard career in `asgard_career_proposed`; leave uncertain mappings for human review.
- A reviewer must re-open at least 5 source URLs, then fill `reviewed_by` and set `review_status` to `verified` or `rejected`. Use `pending` before review.
- `verified` records are reviewed entries, not proof that a posting represents all employers or the whole career.

Validate a file from the repository root with:

```text
python docs/data/validate_postings.py docs/data/ph_postings_collected.csv
```
