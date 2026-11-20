# Philippine starting-pay guidance

Recorded by Codex, 2026-11-20. Independent content review pending.

The owner requested general approximate starting salaries and explicitly accepted
broader estimates on 2026-11-20. Asgard authors the ranges in
[ph-salary-data.ts](../frontend/src/features/careers/ph-salary-data.ts) for career
exploration. They are not a publisher dataset, measured national averages,
confidence intervals or guaranteed offers. They cover the 23 published careers,
including the [11-role expansion](../supabase/content/20261104_guide_expansion_11_careers.sql).

## References and estimate construction

All figures are PHP/month before deductions. Sources checked 2026-11-20. The
underlying references retain their original ownership; no publisher endorsement
or open license over their articles is claimed. Asgard links to the references
and publishes its own concise guidance, not their articles, charts or job ads.

- [DOLE Website Developer, 2020 series](https://cip.philjobnet.gov.ph/wp-content/uploads/2021/07/Website-Developer.pdf):
  broader monthly web-development range of 31,000–56,000, not specifically a
  graduate range. Asgard uses a rough lower-end planning band of 30,000–40,000
  for frontend work and labels the broader scope.
- [DOLE Software Developer](https://cip.philjobnet.gov.ph/?careers=software-developer&highlight=In-demand):
  overall monthly range of 30,000–54,000, including experienced roles. The
  30,000–40,000 planning band for backend, full stack, mobile and games is an
  editorial lower-end estimate, not a source-specific starting-pay statistic.
- [DOLE Data Analyst, 2022 series](https://cip.philjobnet.gov.ph/wp-content/uploads/2023/03/Data-Analyst.pdf):
  entry reference of 45,000. Asgard uses 35,000–45,000 for analyst work and as an
  explicitly broader estimate for BI and initial data-science work.
- [DOLE Data Engineer, 2022 series](https://cip.philjobnet.gov.ph/wp-content/uploads/2023/03/Data-Engineer.pdf):
  entry reference of 50,000. Asgard uses 40,000–50,000 for data engineering and
  as a clearly labeled broader estimate for initial ML/AI work.
- [DOLE UI/UX Designer, 2022 series](https://cip.philjobnet.gov.ph/wp-content/uploads/2023/03/User-Interface-DesignerUX-Designer-2.pdf):
  combined entry reference of 35,000. UI and UX share an authored 30,000–40,000
  planning band; no distinct UI/UX salary difference is inferred.
- [DOLE Microelectronics Engineer, 2022 series](https://cip.philjobnet.gov.ph/wp-content/uploads/2023/03/Micro-Electronics-Engineer.pdf):
  entry reference of 32,000. Asgard uses a rounded 25,000–40,000 electronics-family
  band for hardware and embedded work, explicitly identifying the broader basis.
- [Indeed junior networking salaries](https://ph.indeed.com/career/junior-network-engineer/salaries):
  the retrieved August 2026 reference was approximately 27,000/month. The authored
  20,000–35,000 networking band is also used, with explicit broader coverage,
  for initial cloud support, systems administration and Linux administration.
- [Permhunt cybersecurity guide, 2026 Metro Manila](https://permhunt.com/blog/2026-salary-guide-cybersecurity-professionals-philippines):
  graduate 20,000–30,000 and junior roles starting around 35,000 inform an authored
  20,000–35,000 security-entry band. Penetration testing and cloud security use
  that broader family estimate, not a measured specialist salary average.
- [Permhunt DevOps guide, 2026 Metro Manila](https://permhunt.com/blog/2026-salary-guide-devops-engineers-philippines):
  the 50,000–85,000 junior band applies to 1–3 years of experience. The UI retains
  that experience requirement and does not promise a fresh-graduate starting rate.

Bounds are rounded editorial choices for a quick comparison, not calculated
percentiles or inflation-adjusted projections. Some are based on older guides;
reference vintage is visible. Real offers can lie outside the bands. Broader
families deliberately share figures rather than invent unsupported premiums.
Unknown future career IDs retain unavailable coverage until their basis is added.

The original six-career Sweldex advertised-pay snapshot was removed from the
implementation when the owner clarified that the feature should show starting
pay. Its mixed-experience medians are not used to derive these estimates. No live
feed, scraped article corpus, runtime third-party request or new dependency.
