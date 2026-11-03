# O*NET pilot extraction

Created: 2026-11-03. Status: reproducible source selection for review; no Asgard role mapping accepted.

Includes information from the [O*NET 31.0 Database](https://www.onetcenter.org/database.html) by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). O*NET® is a trademark of USDOL/ETA. Asgard has selected and reserialized records; USDOL/ETA has not approved, endorsed or tested these changes. See [database license](https://www.onetcenter.org/license_db.html); instrument licenses are separate.

## Selection and reproduction

Verify the SHA-256 of db_31_0_csv.zip against [source-manifest.json](../source-manifest.json). Read the 31.0 UTF-8 CSV archive members; filter the nine occupation-scoped tables listed in [inspection-results.json](../inspection-results.json) on O*NET-SOC Code in {15-1254.00, 15-1255.00, 15-2051.00, 15-2051.01}. Preserve every source column and row order. Serialize UTF-8 CSV with original headers. Retain complete content_model_reference, scales_reference and level_scale_anchors as interpretation dependencies. No values, flags, source IDs or dates were converted.

Web Developers and Web and Digital Interface Designers are candidates for reviewing Frontend coverage. Business Intelligence Analysts and Data Scientists are candidates for reviewing Data Analyst coverage. They are alternatives or complementary evidence, not four accepted Asgard occupations. Do not combine them into a single mandatory role profile.

These files are research fixtures, not database publication artifacts or API authority. Inspect Recommend Suppress, Not Relevant, dates, Domain Source and uncertainty fields before deriving comparisons. Software examples/hot/in-demand indicators are not proficiency scores. The pilot retains source data for inspection; it does not approve a numeric gap algorithm.
