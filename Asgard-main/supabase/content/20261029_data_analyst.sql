BEGIN;
SELECT pg_advisory_xact_lock(72611029);
DO $release$ BEGIN IF NOT EXISTS (SELECT 1 FROM asgard_catalog.releases WHERE version=2) THEN
UPDATE asgard_catalog.topics SET position=position+1000 WHERE roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d';
DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.milestones WHERE id='26de75d7-4441-56da-99f5-eb5796ffd73b' AND title IS NOT DISTINCT FROM 'Understand your data' AND description IS NOT DISTINCT FROM 'Choose a clear question and inspect the records that can answer it.' AND position IS NOT DISTINCT FROM 0) THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog.milestones SET roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', title='Frame a useful question', description='Frame a useful question using the Asgard synthetic visit dataset.', position=0 WHERE id='26de75d7-4441-56da-99f5-eb5796ffd73b'; END $update$;
DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.milestones WHERE id='3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' AND title IS NOT DISTINCT FROM 'Analyze and explain' AND description IS NOT DISTINCT FROM 'Choose one tool path, summarize the table and communicate what it supports.' AND position IS NOT DISTINCT FROM 1) THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog.milestones SET roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', title='Choose an analysis tool', description='Choose an analysis tool using the Asgard synthetic visit dataset.', position=2 WHERE id='3cb6da6b-3f4a-5a63-aeba-8e2c693d5453'; END $update$;
DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.topics WHERE id='b80c682c-a38f-5799-8d6f-2382e463273e' AND milestone_id IS NOT DISTINCT FROM '26de75d7-4441-56da-99f5-eb5796ffd73b' AND title IS NOT DISTINCT FROM 'Questions and data types' AND explanation IS NOT DISTINCT FROM 'Choose a specific question for a small practice table. Identify what each row and column means, and distinguish categories, numbers and dates.' AND position IS NOT DISTINCT FROM 1000) THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog.topics SET roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', milestone_id='26de75d7-4441-56da-99f5-eb5796ffd73b', branch_id=NULL, title='Define a useful question', explanation='Objective: Define a useful question.

Explanation: Ask whether completion differs by channel.

Worked example: Ask whether completion differs by channel.

Exercise: Write a question specifying completion, channel and the eight fictional visits.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', position=0 WHERE id='b80c682c-a38f-5799-8d6f-2382e463273e'; END $update$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('7857e25c-fce0-58a1-bd7f-6c1d5c65399b', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '26de75d7-4441-56da-99f5-eb5796ffd73b', NULL, 'Inspect records', 'Objective: Inspect records.

Explanation: Each row is one visit, not one person.

Worked example: Each row is one visit, not one person.

Exercise: Count eight rows and explain why repeated visits would not measure unique people.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '7857e25c-fce0-58a1-bd7f-6c1d5c65399b' AND (id IS DISTINCT FROM '7857e25c-fce0-58a1-bd7f-6c1d5c65399b' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '26de75d7-4441-56da-99f5-eb5796ffd73b' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Inspect records' OR explanation IS DISTINCT FROM 'Objective: Inspect records.

Explanation: Each row is one visit, not one person.

Worked example: Each row is one visit, not one person.

Exercise: Count eight rows and explain why repeated visits would not measure unique people.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('be3b621c-fd72-59eb-a894-8935645d92ac', '7857e25c-fce0-58a1-bd7f-6c1d5c65399b', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = 'be3b621c-fd72-59eb-a894-8935645d92ac' AND (id IS DISTINCT FROM 'be3b621c-fd72-59eb-a894-8935645d92ac' OR topic_id IS DISTINCT FROM '7857e25c-fce0-58a1-bd7f-6c1d5c65399b' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('503184a4-b90b-5d75-9130-61c7e8ecef6d', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '26de75d7-4441-56da-99f5-eb5796ffd73b', NULL, 'Identify fields and types', 'Objective: Identify fields and types.

Explanation: Channel is categorical; minutes is numeric; week is an ordered label.

Worked example: Channel is categorical; minutes is numeric; week is an ordered label.

Exercise: Classify every field and distinguish an identifier from a measurement.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '503184a4-b90b-5d75-9130-61c7e8ecef6d' AND (id IS DISTINCT FROM '503184a4-b90b-5d75-9130-61c7e8ecef6d' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '26de75d7-4441-56da-99f5-eb5796ffd73b' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Identify fields and types' OR explanation IS DISTINCT FROM 'Objective: Identify fields and types.

Explanation: Channel is categorical; minutes is numeric; week is an ordered label.

Worked example: Channel is categorical; minutes is numeric; week is an ordered label.

Exercise: Classify every field and distinguish an identifier from a measurement.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('0dfd55da-d4ff-511b-91bd-8f6c7fd5a09e', '503184a4-b90b-5d75-9130-61c7e8ecef6d', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '0dfd55da-d4ff-511b-91bd-8f6c7fd5a09e' AND (id IS DISTINCT FROM '0dfd55da-d4ff-511b-91bd-8f6c7fd5a09e' OR topic_id IS DISTINCT FROM '503184a4-b90b-5d75-9130-61c7e8ecef6d' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('82f6efa3-daa6-5223-ac8a-60d01ef49e62', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'Prepare trustworthy data', 'Prepare trustworthy data using the Asgard synthetic visit dataset.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = '82f6efa3-daa6-5223-ac8a-60d01ef49e62' AND (id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR title IS DISTINCT FROM 'Prepare trustworthy data' OR description IS DISTINCT FROM 'Prepare trustworthy data using the Asgard synthetic visit dataset.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.topics WHERE id='3c08dc34-22cc-5582-befc-e90439cb759b' AND milestone_id IS NOT DISTINCT FROM '26de75d7-4441-56da-99f5-eb5796ffd73b' AND title IS NOT DISTINCT FROM 'Check and clean a table' AND explanation IS NOT DISTINCT FROM 'Look for missing values, duplicate rows and inconsistent formats. Keep the original table and explain each cleaning choice instead of silently changing records.' AND position IS NOT DISTINCT FROM 1001) THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog.topics SET roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', milestone_id='82f6efa3-daa6-5223-ac8a-60d01ef49e62', branch_id=NULL, title='Keep a cleaning record', explanation='Objective: Keep a cleaning record.

Explanation: Keep the original CSV unchanged and work on a copy.

Worked example: Keep the original CSV unchanged and work on a copy.

Exercise: Record the input row count, each change and the reason.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', position=0 WHERE id='3c08dc34-22cc-5582-befc-e90439cb759b'; END $update$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('b5fa2e03-88bb-5c00-a0ff-47a5392c2082', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '82f6efa3-daa6-5223-ac8a-60d01ef49e62', NULL, 'Handle missing values', 'Objective: Handle missing values.

Explanation: A missing duration is unknown, not zero.

Worked example: A missing duration is unknown, not zero.

Exercise: Blank one duration in a copy; describe exclusion versus imputation without silently choosing.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'b5fa2e03-88bb-5c00-a0ff-47a5392c2082' AND (id IS DISTINCT FROM 'b5fa2e03-88bb-5c00-a0ff-47a5392c2082' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Handle missing values' OR explanation IS DISTINCT FROM 'Objective: Handle missing values.

Explanation: A missing duration is unknown, not zero.

Worked example: A missing duration is unknown, not zero.

Exercise: Blank one duration in a copy; describe exclusion versus imputation without silently choosing.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('4ff211d2-b84d-53f1-bcd2-7d4d05998b0d', 'b5fa2e03-88bb-5c00-a0ff-47a5392c2082', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '4ff211d2-b84d-53f1-bcd2-7d4d05998b0d' AND (id IS DISTINCT FROM '4ff211d2-b84d-53f1-bcd2-7d4d05998b0d' OR topic_id IS DISTINCT FROM 'b5fa2e03-88bb-5c00-a0ff-47a5392c2082' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('e67a4cc2-3fc0-5954-bf9b-1fb932a8091b', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '82f6efa3-daa6-5223-ac8a-60d01ef49e62', NULL, 'Check duplicate records', 'Objective: Check duplicate records.

Explanation: Visit identifiers should be unique.

Worked example: Visit identifiers should be unique.

Exercise: Duplicate visit 1 in a copy, detect it and restore eight distinct visits.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'e67a4cc2-3fc0-5954-bf9b-1fb932a8091b' AND (id IS DISTINCT FROM 'e67a4cc2-3fc0-5954-bf9b-1fb932a8091b' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Check duplicate records' OR explanation IS DISTINCT FROM 'Objective: Check duplicate records.

Explanation: Visit identifiers should be unique.

Worked example: Visit identifiers should be unique.

Exercise: Duplicate visit 1 in a copy, detect it and restore eight distinct visits.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('44dec8b3-0a24-525b-a861-159b4cadbebb', 'e67a4cc2-3fc0-5954-bf9b-1fb932a8091b', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '44dec8b3-0a24-525b-a861-159b4cadbebb' AND (id IS DISTINCT FROM '44dec8b3-0a24-525b-a861-159b4cadbebb' OR topic_id IS DISTINCT FROM 'e67a4cc2-3fc0-5954-bf9b-1fb932a8091b' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('d0868da7-dbd1-5848-89c8-edd13f75488e', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '82f6efa3-daa6-5223-ac8a-60d01ef49e62', NULL, 'Check consistency', 'Objective: Check consistency.

Explanation: Web and web would split one category.

Worked example: Web and web would split one category.

Exercise: Introduce Web in a copy, normalize it and verify the before/after counts.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'd0868da7-dbd1-5848-89c8-edd13f75488e' AND (id IS DISTINCT FROM 'd0868da7-dbd1-5848-89c8-edd13f75488e' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Check consistency' OR explanation IS DISTINCT FROM 'Objective: Check consistency.

Explanation: Web and web would split one category.

Worked example: Web and web would split one category.

Exercise: Introduce Web in a copy, normalize it and verify the before/after counts.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('e6c0c0bb-d4ea-55cd-9e1e-59382947b4cc', 'd0868da7-dbd1-5848-89c8-edd13f75488e', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = 'e6c0c0bb-d4ea-55cd-9e1e-59382947b4cc' AND (id IS DISTINCT FROM 'e6c0c0bb-d4ea-55cd-9e1e-59382947b4cc' OR topic_id IS DISTINCT FROM 'd0868da7-dbd1-5848-89c8-edd13f75488e' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.topics WHERE id='cd8d7609-a486-58fa-9784-4610494e3fa9' AND milestone_id IS NOT DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' AND title IS NOT DISTINCT FROM 'Spreadsheet basics' AND explanation IS NOT DISTINCT FROM 'Filter and sort a practice table. Use simple aggregate formulas to summarize values and explain how the summary answers your question.' AND position IS NOT DISTINCT FROM 1000) THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog.topics SET roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', milestone_id='3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', branch_id='44c52bb2-7d78-5c5a-b668-b40852d0a811', title='Import and filter in Calc', explanation='Objective: Import and filter in Calc.

Explanation: Import the CSV with the first row as headings.

Worked example: Import the CSV with the first row as headings.

Exercise: Filter channel=web and verify four records.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', position=0 WHERE id='cd8d7609-a486-58fa-9784-4610494e3fa9'; END $update$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('e8caaf2c-6713-5a42-adb9-23383c1ccf29', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '44c52bb2-7d78-5c5a-b668-b40852d0a811', 'Calculate with formulas', 'Objective: Calculate with formulas.

Explanation: There are five yes values across eight records.

Worked example: There are five yes values across eight records.

Exercise: Use COUNTIF on completed and calculate 5/8.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'e8caaf2c-6713-5a42-adb9-23383c1ccf29' AND (id IS DISTINCT FROM 'e8caaf2c-6713-5a42-adb9-23383c1ccf29' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '44c52bb2-7d78-5c5a-b668-b40852d0a811' OR title IS DISTINCT FROM 'Calculate with formulas' OR explanation IS DISTINCT FROM 'Objective: Calculate with formulas.

Explanation: There are five yes values across eight records.

Worked example: There are five yes values across eight records.

Exercise: Use COUNTIF on completed and calculate 5/8.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('08d0c652-4074-5be3-9e9c-0e913f063708', 'e8caaf2c-6713-5a42-adb9-23383c1ccf29', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '08d0c652-4074-5be3-9e9c-0e913f063708' AND (id IS DISTINCT FROM '08d0c652-4074-5be3-9e9c-0e913f063708' OR topic_id IS DISTINCT FROM 'e8caaf2c-6713-5a42-adb9-23383c1ccf29' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('04227e14-d914-5c93-a78e-030a980eb404', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '44c52bb2-7d78-5c5a-b668-b40852d0a811', 'Group with a pivot table', 'Objective: Group with a pivot table.

Explanation: Web has three completions and referral has two.

Worked example: Web has three completions and referral has two.

Exercise: Create channel totals and compare them with the reference output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '04227e14-d914-5c93-a78e-030a980eb404' AND (id IS DISTINCT FROM '04227e14-d914-5c93-a78e-030a980eb404' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '44c52bb2-7d78-5c5a-b668-b40852d0a811' OR title IS DISTINCT FROM 'Group with a pivot table' OR explanation IS DISTINCT FROM 'Objective: Group with a pivot table.

Explanation: Web has three completions and referral has two.

Worked example: Web has three completions and referral has two.

Exercise: Create channel totals and compare them with the reference output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('93c6d477-2061-5006-b16f-3b14d97b1a2a', '04227e14-d914-5c93-a78e-030a980eb404', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '93c6d477-2061-5006-b16f-3b14d97b1a2a' AND (id IS DISTINCT FROM '93c6d477-2061-5006-b16f-3b14d97b1a2a' OR topic_id IS DISTINCT FROM '04227e14-d914-5c93-a78e-030a980eb404' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('31f9807f-c7e8-5102-b425-168bc2330bca', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '44c52bb2-7d78-5c5a-b668-b40852d0a811', 'Check spreadsheet results', 'Objective: Check spreadsheet results.

Explanation: Both channels average 15 minutes.

Worked example: Both channels average 15 minutes.

Exercise: Calculate each mean independently and retain formulas.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '31f9807f-c7e8-5102-b425-168bc2330bca' AND (id IS DISTINCT FROM '31f9807f-c7e8-5102-b425-168bc2330bca' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '44c52bb2-7d78-5c5a-b668-b40852d0a811' OR title IS DISTINCT FROM 'Check spreadsheet results' OR explanation IS DISTINCT FROM 'Objective: Check spreadsheet results.

Explanation: Both channels average 15 minutes.

Worked example: Both channels average 15 minutes.

Exercise: Calculate each mean independently and retain formulas.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('99e36ab1-6b9a-5de2-904c-d9a00b7be2e8', '31f9807f-c7e8-5102-b425-168bc2330bca', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '99e36ab1-6b9a-5de2-904c-d9a00b7be2e8' AND (id IS DISTINCT FROM '99e36ab1-6b9a-5de2-904c-d9a00b7be2e8' OR topic_id IS DISTINCT FROM '31f9807f-c7e8-5102-b425-168bc2330bca' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.topics WHERE id='b940a238-c0dc-50be-a414-d19790d208de' AND milestone_id IS NOT DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' AND title IS NOT DISTINCT FROM 'SQL basics' AND explanation IS NOT DISTINCT FROM 'Use SELECT, WHERE and GROUP BY on a small practice table. Explain which rows and groups contribute to the result.' AND position IS NOT DISTINCT FROM 1001) THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog.topics SET roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', milestone_id='3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', branch_id='2e66403c-32a9-534d-b8ba-677e0669b754', title='Import and select with SQLite', explanation='Objective: Import and select with SQLite.

Explanation: The practice table is named visits.

Worked example: The practice table is named visits.

Exercise: Import the CSV and SELECT COUNT(*) to verify eight rows.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', position=4 WHERE id='b940a238-c0dc-50be-a414-d19790d208de'; END $update$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('8aae0a0b-b50a-5dac-9dfd-b1e908035d69', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '2e66403c-32a9-534d-b8ba-677e0669b754', 'Filter records with SQL', 'Objective: Filter records with SQL.

Explanation: WHERE completed=''yes'' retains five records.

Worked example: WHERE completed=''yes'' retains five records.

Exercise: Select completed visits and list their identifiers.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 5) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '8aae0a0b-b50a-5dac-9dfd-b1e908035d69' AND (id IS DISTINCT FROM '8aae0a0b-b50a-5dac-9dfd-b1e908035d69' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '2e66403c-32a9-534d-b8ba-677e0669b754' OR title IS DISTINCT FROM 'Filter records with SQL' OR explanation IS DISTINCT FROM 'Objective: Filter records with SQL.

Explanation: WHERE completed=''yes'' retains five records.

Worked example: WHERE completed=''yes'' retains five records.

Exercise: Select completed visits and list their identifiers.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 5)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('3c8f80c8-a7a6-5308-a058-aff35e663013', '8aae0a0b-b50a-5dac-9dfd-b1e908035d69', 'SQLite SELECT documentation', 'https://www.sqlite.org/lang_select.html', 'documentation', TRUE, 'SQLite public-domain documentation; link only', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '3c8f80c8-a7a6-5308-a058-aff35e663013' AND (id IS DISTINCT FROM '3c8f80c8-a7a6-5308-a058-aff35e663013' OR topic_id IS DISTINCT FROM '8aae0a0b-b50a-5dac-9dfd-b1e908035d69' OR title IS DISTINCT FROM 'SQLite SELECT documentation' OR url IS DISTINCT FROM 'https://www.sqlite.org/lang_select.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'SQLite public-domain documentation; link only' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('7e102d83-b59b-51a8-b1ff-9fc0e5a0ce67', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '2e66403c-32a9-534d-b8ba-677e0669b754', 'Group and aggregate with SQL', 'Objective: Group and aggregate with SQL.

Explanation: GROUP BY channel gives two groups.

Worked example: GROUP BY channel gives two groups.

Exercise: Use COUNT and AVG(minutes) and compare with the reference output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 6) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '7e102d83-b59b-51a8-b1ff-9fc0e5a0ce67' AND (id IS DISTINCT FROM '7e102d83-b59b-51a8-b1ff-9fc0e5a0ce67' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '2e66403c-32a9-534d-b8ba-677e0669b754' OR title IS DISTINCT FROM 'Group and aggregate with SQL' OR explanation IS DISTINCT FROM 'Objective: Group and aggregate with SQL.

Explanation: GROUP BY channel gives two groups.

Worked example: GROUP BY channel gives two groups.

Exercise: Use COUNT and AVG(minutes) and compare with the reference output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 6)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('5e08bd89-b1fa-52b0-a2ee-0db6ef98b1bb', '7e102d83-b59b-51a8-b1ff-9fc0e5a0ce67', 'SQLite SELECT documentation', 'https://www.sqlite.org/lang_select.html', 'documentation', TRUE, 'SQLite public-domain documentation; link only', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '5e08bd89-b1fa-52b0-a2ee-0db6ef98b1bb' AND (id IS DISTINCT FROM '5e08bd89-b1fa-52b0-a2ee-0db6ef98b1bb' OR topic_id IS DISTINCT FROM '7e102d83-b59b-51a8-b1ff-9fc0e5a0ce67' OR title IS DISTINCT FROM 'SQLite SELECT documentation' OR url IS DISTINCT FROM 'https://www.sqlite.org/lang_select.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'SQLite public-domain documentation; link only' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('cad9d714-ea50-5fbf-817b-ba13b7bdf026', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '2e66403c-32a9-534d-b8ba-677e0669b754', 'Validate SQL totals', 'Objective: Validate SQL totals.

Explanation: Group counts must sum to eight.

Worked example: Group counts must sum to eight.

Exercise: Compare grouped counts and completion totals with a separate whole-table query.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 7) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'cad9d714-ea50-5fbf-817b-ba13b7bdf026' AND (id IS DISTINCT FROM 'cad9d714-ea50-5fbf-817b-ba13b7bdf026' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '2e66403c-32a9-534d-b8ba-677e0669b754' OR title IS DISTINCT FROM 'Validate SQL totals' OR explanation IS DISTINCT FROM 'Objective: Validate SQL totals.

Explanation: Group counts must sum to eight.

Worked example: Group counts must sum to eight.

Exercise: Compare grouped counts and completion totals with a separate whole-table query.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 7)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('df5e29e6-2052-52aa-b7e5-d43eced90286', 'cad9d714-ea50-5fbf-817b-ba13b7bdf026', 'SQLite SELECT documentation', 'https://www.sqlite.org/lang_select.html', 'documentation', TRUE, 'SQLite public-domain documentation; link only', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = 'df5e29e6-2052-52aa-b7e5-d43eced90286' AND (id IS DISTINCT FROM 'df5e29e6-2052-52aa-b7e5-d43eced90286' OR topic_id IS DISTINCT FROM 'cad9d714-ea50-5fbf-817b-ba13b7bdf026' OR title IS DISTINCT FROM 'SQLite SELECT documentation' OR url IS DISTINCT FROM 'https://www.sqlite.org/lang_select.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'SQLite public-domain documentation; link only' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('cef3b796-ed99-56ad-a974-f4f7afb0f1ef', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'Analyze and communicate', 'Analyze and communicate using the Asgard synthetic visit dataset.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' AND (id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR title IS DISTINCT FROM 'Analyze and communicate' OR description IS DISTINCT FROM 'Analyze and communicate using the Asgard synthetic visit dataset.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('e722e201-8f77-5ac7-a515-f8d2924b66a5', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef', NULL, 'Choose a summary', 'Objective: Choose a summary.

Explanation: A mean duration describes these eight records only.

Worked example: A mean duration describes these eight records only.

Exercise: Report counts and mean duration with units.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'e722e201-8f77-5ac7-a515-f8d2924b66a5' AND (id IS DISTINCT FROM 'e722e201-8f77-5ac7-a515-f8d2924b66a5' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Choose a summary' OR explanation IS DISTINCT FROM 'Objective: Choose a summary.

Explanation: A mean duration describes these eight records only.

Worked example: A mean duration describes these eight records only.

Exercise: Report counts and mean duration with units.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('e8aca994-1949-568d-bc6e-34b4d7101c2d', 'e722e201-8f77-5ac7-a515-f8d2924b66a5', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = 'e8aca994-1949-568d-bc6e-34b4d7101c2d' AND (id IS DISTINCT FROM 'e8aca994-1949-568d-bc6e-34b4d7101c2d' OR topic_id IS DISTINCT FROM 'e722e201-8f77-5ac7-a515-f8d2924b66a5' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('38747a8d-1b91-50a8-833e-bde09c20c586', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef', NULL, 'Compare like denominators', 'Objective: Compare like denominators.

Explanation: Web is 3/4; referral is 2/4.

Worked example: Web is 3/4; referral is 2/4.

Exercise: Report both counts and percentages; explain the tiny sample.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '38747a8d-1b91-50a8-833e-bde09c20c586' AND (id IS DISTINCT FROM '38747a8d-1b91-50a8-833e-bde09c20c586' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Compare like denominators' OR explanation IS DISTINCT FROM 'Objective: Compare like denominators.

Explanation: Web is 3/4; referral is 2/4.

Worked example: Web is 3/4; referral is 2/4.

Exercise: Report both counts and percentages; explain the tiny sample.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('816f3eaa-ff16-5bb9-9997-35b8c00105a9', '38747a8d-1b91-50a8-833e-bde09c20c586', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '816f3eaa-ff16-5bb9-9997-35b8c00105a9' AND (id IS DISTINCT FROM '816f3eaa-ff16-5bb9-9997-35b8c00105a9' OR topic_id IS DISTINCT FROM '38747a8d-1b91-50a8-833e-bde09c20c586' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.topics WHERE id='fdd389dc-a4d2-5db9-8880-48e76f47f572' AND milestone_id IS NOT DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' AND title IS NOT DISTINCT FROM 'Choose and explain a chart' AND explanation IS NOT DISTINCT FROM 'Choose a chart that matches your question, label its units and avoid misleading scales. Describe both the main finding and one limitation.' AND position IS NOT DISTINCT FROM 1002) THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog.topics SET roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', milestone_id='cef3b796-ed99-56ad-a974-f4f7afb0f1ef', branch_id=NULL, title='Choose and explain a chart', explanation='Objective: Choose and explain a chart.

Explanation: A two-bar chart can compare completion counts.

Worked example: A two-bar chart can compare completion counts.

Exercise: Label channels and units, start the count axis at zero and show the source.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', position=2 WHERE id='fdd389dc-a4d2-5db9-8880-48e76f47f572'; END $update$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('f1e899cc-d3ad-5d00-ba65-7093e5378d9b', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef', NULL, 'Separate observation and cause', 'Objective: Separate observation and cause.

Explanation: The table records a difference, not its cause.

Worked example: The table records a difference, not its cause.

Exercise: Write one supported observation and one explanation requiring more evidence.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'f1e899cc-d3ad-5d00-ba65-7093e5378d9b' AND (id IS DISTINCT FROM 'f1e899cc-d3ad-5d00-ba65-7093e5378d9b' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Separate observation and cause' OR explanation IS DISTINCT FROM 'Objective: Separate observation and cause.

Explanation: The table records a difference, not its cause.

Worked example: The table records a difference, not its cause.

Exercise: Write one supported observation and one explanation requiring more evidence.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('fa041656-e66b-5dbb-9c80-a475173e6f2f', 'f1e899cc-d3ad-5d00-ba65-7093e5378d9b', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = 'fa041656-e66b-5dbb-9c80-a475173e6f2f' AND (id IS DISTINCT FROM 'fa041656-e66b-5dbb-9c80-a475173e6f2f' OR topic_id IS DISTINCT FROM 'f1e899cc-d3ad-5d00-ba65-7093e5378d9b' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('f7802ec0-9f56-5426-8b4b-273eb6b25837', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'Complete a small project', 'Complete a small project using the Asgard synthetic visit dataset.', 4) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = 'f7802ec0-9f56-5426-8b4b-273eb6b25837' AND (id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR title IS DISTINCT FROM 'Complete a small project' OR description IS DISTINCT FROM 'Complete a small project using the Asgard synthetic visit dataset.' OR position IS DISTINCT FROM 4)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('2bef7701-dfa6-5b8c-8eb9-5220d1c2e6cc', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Plan the analysis', 'Objective: Plan the analysis.

Explanation: A useful report answers one bounded question.

Worked example: A useful report answers one bounded question.

Exercise: Record question, population, fields and intended output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '2bef7701-dfa6-5b8c-8eb9-5220d1c2e6cc' AND (id IS DISTINCT FROM '2bef7701-dfa6-5b8c-8eb9-5220d1c2e6cc' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Plan the analysis' OR explanation IS DISTINCT FROM 'Objective: Plan the analysis.

Explanation: A useful report answers one bounded question.

Worked example: A useful report answers one bounded question.

Exercise: Record question, population, fields and intended output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('38a1037a-a999-5591-830b-778035f07851', '2bef7701-dfa6-5b8c-8eb9-5220d1c2e6cc', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '38a1037a-a999-5591-830b-778035f07851' AND (id IS DISTINCT FROM '38a1037a-a999-5591-830b-778035f07851' OR topic_id IS DISTINCT FROM '2bef7701-dfa6-5b8c-8eb9-5220d1c2e6cc' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('a61ba808-1420-5d99-9fb0-d57c5006f300', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Prepare a reproducible table', 'Objective: Prepare a reproducible table.

Explanation: Cleaning choices affect the result.

Worked example: Cleaning choices affect the result.

Exercise: Deliver the original, working copy and cleaning record.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'a61ba808-1420-5d99-9fb0-d57c5006f300' AND (id IS DISTINCT FROM 'a61ba808-1420-5d99-9fb0-d57c5006f300' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Prepare a reproducible table' OR explanation IS DISTINCT FROM 'Objective: Prepare a reproducible table.

Explanation: Cleaning choices affect the result.

Worked example: Cleaning choices affect the result.

Exercise: Deliver the original, working copy and cleaning record.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('9e9e381a-0a60-535d-9608-4d49cbe2513f', 'a61ba808-1420-5d99-9fb0-d57c5006f300', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '9e9e381a-0a60-535d-9608-4d49cbe2513f' AND (id IS DISTINCT FROM '9e9e381a-0a60-535d-9608-4d49cbe2513f' OR topic_id IS DISTINCT FROM 'a61ba808-1420-5d99-9fb0-d57c5006f300' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('821f8207-61ce-5f3f-9894-d9c7ffe00a93', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Run a reproducible analysis', 'Objective: Run a reproducible analysis.

Explanation: Either tool should produce the same reference counts.

Worked example: Either tool should produce the same reference counts.

Exercise: Save formulas or SQL and reconcile totals.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '821f8207-61ce-5f3f-9894-d9c7ffe00a93' AND (id IS DISTINCT FROM '821f8207-61ce-5f3f-9894-d9c7ffe00a93' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Run a reproducible analysis' OR explanation IS DISTINCT FROM 'Objective: Run a reproducible analysis.

Explanation: Either tool should produce the same reference counts.

Worked example: Either tool should produce the same reference counts.

Exercise: Save formulas or SQL and reconcile totals.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('117ca5ac-e751-5d13-a1bd-23b3ba2f4b74', '821f8207-61ce-5f3f-9894-d9c7ffe00a93', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '117ca5ac-e751-5d13-a1bd-23b3ba2f4b74' AND (id IS DISTINCT FROM '117ca5ac-e751-5d13-a1bd-23b3ba2f4b74' OR topic_id IS DISTINCT FROM '821f8207-61ce-5f3f-9894-d9c7ffe00a93' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
DO $update$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.topics WHERE id='77298d0f-9b48-5db5-9604-9446fdc9f166' AND milestone_id IS NOT DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' AND title IS NOT DISTINCT FROM 'Write a short analysis report' AND explanation IS NOT DISTINCT FROM 'Present the question, data checks, summary and chart in a short report. Separate observed patterns from explanations that would require additional evidence.' AND position IS NOT DISTINCT FROM 1003) THEN RAISE EXCEPTION 'Unexpected content revision'; END IF; UPDATE asgard_catalog.topics SET roadmap_id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', milestone_id='f7802ec0-9f56-5426-8b4b-273eb6b25837', branch_id=NULL, title='Write a short analysis report', explanation='Objective: Write a short analysis report.

Explanation: Web: four visits, three completions; referral: four visits, two completions.

Worked example: Web: four visits, three completions; referral: four visits, two completions.

Exercise: Present question, checks, chart and findings in one page.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', position=3 WHERE id='77298d0f-9b48-5db5-9604-9446fdc9f166'; END $update$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('18c13336-36f2-59ad-a61d-f2ab2aa4c228', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Document limitations', 'Objective: Document limitations.

Explanation: Synthetic visits cannot establish real user behavior.

Worked example: Synthetic visits cannot establish real user behavior.

Exercise: State the synthetic source, small sample and absence of causal evidence.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 4) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '18c13336-36f2-59ad-a61d-f2ab2aa4c228' AND (id IS DISTINCT FROM '18c13336-36f2-59ad-a61d-f2ab2aa4c228' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Document limitations' OR explanation IS DISTINCT FROM 'Objective: Document limitations.

Explanation: Synthetic visits cannot establish real user behavior.

Worked example: Synthetic visits cannot establish real user behavior.

Exercise: State the synthetic source, small sample and absence of causal evidence.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 4)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('0e1d5260-f1dd-515f-b3c4-493201f35d9d', '18c13336-36f2-59ad-a61d-f2ab2aa4c228', 'LibreOffice Calc documentation', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '0e1d5260-f1dd-515f-b3c4-493201f35d9d' AND (id IS DISTINCT FROM '0e1d5260-f1dd-515f-b3c4-493201f35d9d' OR topic_id IS DISTINCT FROM '18c13336-36f2-59ad-a61d-f2ab2aa4c228' OR title IS DISTINCT FROM 'LibreOffice Calc documentation' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
UPDATE asgard_catalog.roadmaps SET revision=2, revision_note='Detailed Data Analyst path; existing progress retained' WHERE id='a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' AND revision=1;
INSERT INTO asgard_catalog.releases(id,version) VALUES('36ae9af8-62dd-54c4-b8c8-9dab1f17d9cb',2); END IF; END $release$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('26de75d7-4441-56da-99f5-eb5796ffd73b', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'Frame a useful question', 'Frame a useful question using the Asgard synthetic visit dataset.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = '26de75d7-4441-56da-99f5-eb5796ffd73b' AND (id IS DISTINCT FROM '26de75d7-4441-56da-99f5-eb5796ffd73b' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR title IS DISTINCT FROM 'Frame a useful question' OR description IS DISTINCT FROM 'Frame a useful question using the Asgard synthetic visit dataset.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('b80c682c-a38f-5799-8d6f-2382e463273e', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '26de75d7-4441-56da-99f5-eb5796ffd73b', NULL, 'Define a useful question', 'Objective: Define a useful question.

Explanation: Ask whether completion differs by channel.

Worked example: Ask whether completion differs by channel.

Exercise: Write a question specifying completion, channel and the eight fictional visits.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'b80c682c-a38f-5799-8d6f-2382e463273e' AND (id IS DISTINCT FROM 'b80c682c-a38f-5799-8d6f-2382e463273e' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '26de75d7-4441-56da-99f5-eb5796ffd73b' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Define a useful question' OR explanation IS DISTINCT FROM 'Objective: Define a useful question.

Explanation: Ask whether completion differs by channel.

Worked example: Ask whether completion differs by channel.

Exercise: Write a question specifying completion, channel and the eight fictional visits.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('7857e25c-fce0-58a1-bd7f-6c1d5c65399b', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '26de75d7-4441-56da-99f5-eb5796ffd73b', NULL, 'Inspect records', 'Objective: Inspect records.

Explanation: Each row is one visit, not one person.

Worked example: Each row is one visit, not one person.

Exercise: Count eight rows and explain why repeated visits would not measure unique people.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '7857e25c-fce0-58a1-bd7f-6c1d5c65399b' AND (id IS DISTINCT FROM '7857e25c-fce0-58a1-bd7f-6c1d5c65399b' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '26de75d7-4441-56da-99f5-eb5796ffd73b' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Inspect records' OR explanation IS DISTINCT FROM 'Objective: Inspect records.

Explanation: Each row is one visit, not one person.

Worked example: Each row is one visit, not one person.

Exercise: Count eight rows and explain why repeated visits would not measure unique people.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('503184a4-b90b-5d75-9130-61c7e8ecef6d', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '26de75d7-4441-56da-99f5-eb5796ffd73b', NULL, 'Identify fields and types', 'Objective: Identify fields and types.

Explanation: Channel is categorical; minutes is numeric; week is an ordered label.

Worked example: Channel is categorical; minutes is numeric; week is an ordered label.

Exercise: Classify every field and distinguish an identifier from a measurement.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '503184a4-b90b-5d75-9130-61c7e8ecef6d' AND (id IS DISTINCT FROM '503184a4-b90b-5d75-9130-61c7e8ecef6d' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '26de75d7-4441-56da-99f5-eb5796ffd73b' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Identify fields and types' OR explanation IS DISTINCT FROM 'Objective: Identify fields and types.

Explanation: Channel is categorical; minutes is numeric; week is an ordered label.

Worked example: Channel is categorical; minutes is numeric; week is an ordered label.

Exercise: Classify every field and distinguish an identifier from a measurement.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('82f6efa3-daa6-5223-ac8a-60d01ef49e62', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'Prepare trustworthy data', 'Prepare trustworthy data using the Asgard synthetic visit dataset.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = '82f6efa3-daa6-5223-ac8a-60d01ef49e62' AND (id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR title IS DISTINCT FROM 'Prepare trustworthy data' OR description IS DISTINCT FROM 'Prepare trustworthy data using the Asgard synthetic visit dataset.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('3c08dc34-22cc-5582-befc-e90439cb759b', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '82f6efa3-daa6-5223-ac8a-60d01ef49e62', NULL, 'Keep a cleaning record', 'Objective: Keep a cleaning record.

Explanation: Keep the original CSV unchanged and work on a copy.

Worked example: Keep the original CSV unchanged and work on a copy.

Exercise: Record the input row count, each change and the reason.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '3c08dc34-22cc-5582-befc-e90439cb759b' AND (id IS DISTINCT FROM '3c08dc34-22cc-5582-befc-e90439cb759b' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Keep a cleaning record' OR explanation IS DISTINCT FROM 'Objective: Keep a cleaning record.

Explanation: Keep the original CSV unchanged and work on a copy.

Worked example: Keep the original CSV unchanged and work on a copy.

Exercise: Record the input row count, each change and the reason.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('b5fa2e03-88bb-5c00-a0ff-47a5392c2082', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '82f6efa3-daa6-5223-ac8a-60d01ef49e62', NULL, 'Handle missing values', 'Objective: Handle missing values.

Explanation: A missing duration is unknown, not zero.

Worked example: A missing duration is unknown, not zero.

Exercise: Blank one duration in a copy; describe exclusion versus imputation without silently choosing.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'b5fa2e03-88bb-5c00-a0ff-47a5392c2082' AND (id IS DISTINCT FROM 'b5fa2e03-88bb-5c00-a0ff-47a5392c2082' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Handle missing values' OR explanation IS DISTINCT FROM 'Objective: Handle missing values.

Explanation: A missing duration is unknown, not zero.

Worked example: A missing duration is unknown, not zero.

Exercise: Blank one duration in a copy; describe exclusion versus imputation without silently choosing.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('e67a4cc2-3fc0-5954-bf9b-1fb932a8091b', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '82f6efa3-daa6-5223-ac8a-60d01ef49e62', NULL, 'Check duplicate records', 'Objective: Check duplicate records.

Explanation: Visit identifiers should be unique.

Worked example: Visit identifiers should be unique.

Exercise: Duplicate visit 1 in a copy, detect it and restore eight distinct visits.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'e67a4cc2-3fc0-5954-bf9b-1fb932a8091b' AND (id IS DISTINCT FROM 'e67a4cc2-3fc0-5954-bf9b-1fb932a8091b' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Check duplicate records' OR explanation IS DISTINCT FROM 'Objective: Check duplicate records.

Explanation: Visit identifiers should be unique.

Worked example: Visit identifiers should be unique.

Exercise: Duplicate visit 1 in a copy, detect it and restore eight distinct visits.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('d0868da7-dbd1-5848-89c8-edd13f75488e', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '82f6efa3-daa6-5223-ac8a-60d01ef49e62', NULL, 'Check consistency', 'Objective: Check consistency.

Explanation: Web and web would split one category.

Worked example: Web and web would split one category.

Exercise: Introduce Web in a copy, normalize it and verify the before/after counts.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'd0868da7-dbd1-5848-89c8-edd13f75488e' AND (id IS DISTINCT FROM 'd0868da7-dbd1-5848-89c8-edd13f75488e' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '82f6efa3-daa6-5223-ac8a-60d01ef49e62' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Check consistency' OR explanation IS DISTINCT FROM 'Objective: Check consistency.

Explanation: Web and web would split one category.

Worked example: Web and web would split one category.

Exercise: Introduce Web in a copy, normalize it and verify the before/after counts.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'Choose an analysis tool', 'Choose an analysis tool using the Asgard synthetic visit dataset.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' AND (id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR title IS DISTINCT FROM 'Choose an analysis tool' OR description IS DISTINCT FROM 'Choose an analysis tool using the Asgard synthetic visit dataset.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('cd8d7609-a486-58fa-9784-4610494e3fa9', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '44c52bb2-7d78-5c5a-b668-b40852d0a811', 'Import and filter in Calc', 'Objective: Import and filter in Calc.

Explanation: Import the CSV with the first row as headings.

Worked example: Import the CSV with the first row as headings.

Exercise: Filter channel=web and verify four records.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'cd8d7609-a486-58fa-9784-4610494e3fa9' AND (id IS DISTINCT FROM 'cd8d7609-a486-58fa-9784-4610494e3fa9' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '44c52bb2-7d78-5c5a-b668-b40852d0a811' OR title IS DISTINCT FROM 'Import and filter in Calc' OR explanation IS DISTINCT FROM 'Objective: Import and filter in Calc.

Explanation: Import the CSV with the first row as headings.

Worked example: Import the CSV with the first row as headings.

Exercise: Filter channel=web and verify four records.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('e8caaf2c-6713-5a42-adb9-23383c1ccf29', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '44c52bb2-7d78-5c5a-b668-b40852d0a811', 'Calculate with formulas', 'Objective: Calculate with formulas.

Explanation: There are five yes values across eight records.

Worked example: There are five yes values across eight records.

Exercise: Use COUNTIF on completed and calculate 5/8.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'e8caaf2c-6713-5a42-adb9-23383c1ccf29' AND (id IS DISTINCT FROM 'e8caaf2c-6713-5a42-adb9-23383c1ccf29' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '44c52bb2-7d78-5c5a-b668-b40852d0a811' OR title IS DISTINCT FROM 'Calculate with formulas' OR explanation IS DISTINCT FROM 'Objective: Calculate with formulas.

Explanation: There are five yes values across eight records.

Worked example: There are five yes values across eight records.

Exercise: Use COUNTIF on completed and calculate 5/8.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('04227e14-d914-5c93-a78e-030a980eb404', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '44c52bb2-7d78-5c5a-b668-b40852d0a811', 'Group with a pivot table', 'Objective: Group with a pivot table.

Explanation: Web has three completions and referral has two.

Worked example: Web has three completions and referral has two.

Exercise: Create channel totals and compare them with the reference output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '04227e14-d914-5c93-a78e-030a980eb404' AND (id IS DISTINCT FROM '04227e14-d914-5c93-a78e-030a980eb404' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '44c52bb2-7d78-5c5a-b668-b40852d0a811' OR title IS DISTINCT FROM 'Group with a pivot table' OR explanation IS DISTINCT FROM 'Objective: Group with a pivot table.

Explanation: Web has three completions and referral has two.

Worked example: Web has three completions and referral has two.

Exercise: Create channel totals and compare them with the reference output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('31f9807f-c7e8-5102-b425-168bc2330bca', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '44c52bb2-7d78-5c5a-b668-b40852d0a811', 'Check spreadsheet results', 'Objective: Check spreadsheet results.

Explanation: Both channels average 15 minutes.

Worked example: Both channels average 15 minutes.

Exercise: Calculate each mean independently and retain formulas.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '31f9807f-c7e8-5102-b425-168bc2330bca' AND (id IS DISTINCT FROM '31f9807f-c7e8-5102-b425-168bc2330bca' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '44c52bb2-7d78-5c5a-b668-b40852d0a811' OR title IS DISTINCT FROM 'Check spreadsheet results' OR explanation IS DISTINCT FROM 'Objective: Check spreadsheet results.

Explanation: Both channels average 15 minutes.

Worked example: Both channels average 15 minutes.

Exercise: Calculate each mean independently and retain formulas.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('b940a238-c0dc-50be-a414-d19790d208de', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '2e66403c-32a9-534d-b8ba-677e0669b754', 'Import and select with SQLite', 'Objective: Import and select with SQLite.

Explanation: The practice table is named visits.

Worked example: The practice table is named visits.

Exercise: Import the CSV and SELECT COUNT(*) to verify eight rows.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 4) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'b940a238-c0dc-50be-a414-d19790d208de' AND (id IS DISTINCT FROM 'b940a238-c0dc-50be-a414-d19790d208de' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '2e66403c-32a9-534d-b8ba-677e0669b754' OR title IS DISTINCT FROM 'Import and select with SQLite' OR explanation IS DISTINCT FROM 'Objective: Import and select with SQLite.

Explanation: The practice table is named visits.

Worked example: The practice table is named visits.

Exercise: Import the CSV and SELECT COUNT(*) to verify eight rows.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 4)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('8aae0a0b-b50a-5dac-9dfd-b1e908035d69', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '2e66403c-32a9-534d-b8ba-677e0669b754', 'Filter records with SQL', 'Objective: Filter records with SQL.

Explanation: WHERE completed=''yes'' retains five records.

Worked example: WHERE completed=''yes'' retains five records.

Exercise: Select completed visits and list their identifiers.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 5) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '8aae0a0b-b50a-5dac-9dfd-b1e908035d69' AND (id IS DISTINCT FROM '8aae0a0b-b50a-5dac-9dfd-b1e908035d69' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '2e66403c-32a9-534d-b8ba-677e0669b754' OR title IS DISTINCT FROM 'Filter records with SQL' OR explanation IS DISTINCT FROM 'Objective: Filter records with SQL.

Explanation: WHERE completed=''yes'' retains five records.

Worked example: WHERE completed=''yes'' retains five records.

Exercise: Select completed visits and list their identifiers.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 5)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('7e102d83-b59b-51a8-b1ff-9fc0e5a0ce67', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '2e66403c-32a9-534d-b8ba-677e0669b754', 'Group and aggregate with SQL', 'Objective: Group and aggregate with SQL.

Explanation: GROUP BY channel gives two groups.

Worked example: GROUP BY channel gives two groups.

Exercise: Use COUNT and AVG(minutes) and compare with the reference output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 6) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '7e102d83-b59b-51a8-b1ff-9fc0e5a0ce67' AND (id IS DISTINCT FROM '7e102d83-b59b-51a8-b1ff-9fc0e5a0ce67' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '2e66403c-32a9-534d-b8ba-677e0669b754' OR title IS DISTINCT FROM 'Group and aggregate with SQL' OR explanation IS DISTINCT FROM 'Objective: Group and aggregate with SQL.

Explanation: GROUP BY channel gives two groups.

Worked example: GROUP BY channel gives two groups.

Exercise: Use COUNT and AVG(minutes) and compare with the reference output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 6)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('cad9d714-ea50-5fbf-817b-ba13b7bdf026', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '2e66403c-32a9-534d-b8ba-677e0669b754', 'Validate SQL totals', 'Objective: Validate SQL totals.

Explanation: Group counts must sum to eight.

Worked example: Group counts must sum to eight.

Exercise: Compare grouped counts and completion totals with a separate whole-table query.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 7) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'cad9d714-ea50-5fbf-817b-ba13b7bdf026' AND (id IS DISTINCT FROM 'cad9d714-ea50-5fbf-817b-ba13b7bdf026' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR branch_id IS DISTINCT FROM '2e66403c-32a9-534d-b8ba-677e0669b754' OR title IS DISTINCT FROM 'Validate SQL totals' OR explanation IS DISTINCT FROM 'Objective: Validate SQL totals.

Explanation: Group counts must sum to eight.

Worked example: Group counts must sum to eight.

Exercise: Compare grouped counts and completion totals with a separate whole-table query.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 7)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('cef3b796-ed99-56ad-a974-f4f7afb0f1ef', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'Analyze and communicate', 'Analyze and communicate using the Asgard synthetic visit dataset.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' AND (id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR title IS DISTINCT FROM 'Analyze and communicate' OR description IS DISTINCT FROM 'Analyze and communicate using the Asgard synthetic visit dataset.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('e722e201-8f77-5ac7-a515-f8d2924b66a5', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef', NULL, 'Choose a summary', 'Objective: Choose a summary.

Explanation: A mean duration describes these eight records only.

Worked example: A mean duration describes these eight records only.

Exercise: Report counts and mean duration with units.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'e722e201-8f77-5ac7-a515-f8d2924b66a5' AND (id IS DISTINCT FROM 'e722e201-8f77-5ac7-a515-f8d2924b66a5' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Choose a summary' OR explanation IS DISTINCT FROM 'Objective: Choose a summary.

Explanation: A mean duration describes these eight records only.

Worked example: A mean duration describes these eight records only.

Exercise: Report counts and mean duration with units.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('38747a8d-1b91-50a8-833e-bde09c20c586', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef', NULL, 'Compare like denominators', 'Objective: Compare like denominators.

Explanation: Web is 3/4; referral is 2/4.

Worked example: Web is 3/4; referral is 2/4.

Exercise: Report both counts and percentages; explain the tiny sample.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '38747a8d-1b91-50a8-833e-bde09c20c586' AND (id IS DISTINCT FROM '38747a8d-1b91-50a8-833e-bde09c20c586' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Compare like denominators' OR explanation IS DISTINCT FROM 'Objective: Compare like denominators.

Explanation: Web is 3/4; referral is 2/4.

Worked example: Web is 3/4; referral is 2/4.

Exercise: Report both counts and percentages; explain the tiny sample.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('fdd389dc-a4d2-5db9-8880-48e76f47f572', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef', NULL, 'Choose and explain a chart', 'Objective: Choose and explain a chart.

Explanation: A two-bar chart can compare completion counts.

Worked example: A two-bar chart can compare completion counts.

Exercise: Label channels and units, start the count axis at zero and show the source.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'fdd389dc-a4d2-5db9-8880-48e76f47f572' AND (id IS DISTINCT FROM 'fdd389dc-a4d2-5db9-8880-48e76f47f572' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Choose and explain a chart' OR explanation IS DISTINCT FROM 'Objective: Choose and explain a chart.

Explanation: A two-bar chart can compare completion counts.

Worked example: A two-bar chart can compare completion counts.

Exercise: Label channels and units, start the count axis at zero and show the source.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('f1e899cc-d3ad-5d00-ba65-7093e5378d9b', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef', NULL, 'Separate observation and cause', 'Objective: Separate observation and cause.

Explanation: The table records a difference, not its cause.

Worked example: The table records a difference, not its cause.

Exercise: Write one supported observation and one explanation requiring more evidence.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'f1e899cc-d3ad-5d00-ba65-7093e5378d9b' AND (id IS DISTINCT FROM 'f1e899cc-d3ad-5d00-ba65-7093e5378d9b' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'cef3b796-ed99-56ad-a974-f4f7afb0f1ef' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Separate observation and cause' OR explanation IS DISTINCT FROM 'Objective: Separate observation and cause.

Explanation: The table records a difference, not its cause.

Worked example: The table records a difference, not its cause.

Exercise: Write one supported observation and one explanation requiring more evidence.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('f7802ec0-9f56-5426-8b4b-273eb6b25837', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'Complete a small project', 'Complete a small project using the Asgard synthetic visit dataset.', 4) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = 'f7802ec0-9f56-5426-8b4b-273eb6b25837' AND (id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR title IS DISTINCT FROM 'Complete a small project' OR description IS DISTINCT FROM 'Complete a small project using the Asgard synthetic visit dataset.' OR position IS DISTINCT FROM 4)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('2bef7701-dfa6-5b8c-8eb9-5220d1c2e6cc', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Plan the analysis', 'Objective: Plan the analysis.

Explanation: A useful report answers one bounded question.

Worked example: A useful report answers one bounded question.

Exercise: Record question, population, fields and intended output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '2bef7701-dfa6-5b8c-8eb9-5220d1c2e6cc' AND (id IS DISTINCT FROM '2bef7701-dfa6-5b8c-8eb9-5220d1c2e6cc' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Plan the analysis' OR explanation IS DISTINCT FROM 'Objective: Plan the analysis.

Explanation: A useful report answers one bounded question.

Worked example: A useful report answers one bounded question.

Exercise: Record question, population, fields and intended output.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('a61ba808-1420-5d99-9fb0-d57c5006f300', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Prepare a reproducible table', 'Objective: Prepare a reproducible table.

Explanation: Cleaning choices affect the result.

Worked example: Cleaning choices affect the result.

Exercise: Deliver the original, working copy and cleaning record.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'a61ba808-1420-5d99-9fb0-d57c5006f300' AND (id IS DISTINCT FROM 'a61ba808-1420-5d99-9fb0-d57c5006f300' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Prepare a reproducible table' OR explanation IS DISTINCT FROM 'Objective: Prepare a reproducible table.

Explanation: Cleaning choices affect the result.

Worked example: Cleaning choices affect the result.

Exercise: Deliver the original, working copy and cleaning record.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('821f8207-61ce-5f3f-9894-d9c7ffe00a93', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Run a reproducible analysis', 'Objective: Run a reproducible analysis.

Explanation: Either tool should produce the same reference counts.

Worked example: Either tool should produce the same reference counts.

Exercise: Save formulas or SQL and reconcile totals.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '821f8207-61ce-5f3f-9894-d9c7ffe00a93' AND (id IS DISTINCT FROM '821f8207-61ce-5f3f-9894-d9c7ffe00a93' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Run a reproducible analysis' OR explanation IS DISTINCT FROM 'Objective: Run a reproducible analysis.

Explanation: Either tool should produce the same reference counts.

Worked example: Either tool should produce the same reference counts.

Exercise: Save formulas or SQL and reconcile totals.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('77298d0f-9b48-5db5-9604-9446fdc9f166', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Write a short analysis report', 'Objective: Write a short analysis report.

Explanation: Web: four visits, three completions; referral: four visits, two completions.

Worked example: Web: four visits, three completions; referral: four visits, two completions.

Exercise: Present question, checks, chart and findings in one page.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '77298d0f-9b48-5db5-9604-9446fdc9f166' AND (id IS DISTINCT FROM '77298d0f-9b48-5db5-9604-9446fdc9f166' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Write a short analysis report' OR explanation IS DISTINCT FROM 'Objective: Write a short analysis report.

Explanation: Web: four visits, three completions; referral: four visits, two completions.

Worked example: Web: four visits, three completions; referral: four visits, two completions.

Exercise: Present question, checks, chart and findings in one page.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('18c13336-36f2-59ad-a61d-f2ab2aa4c228', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', 'f7802ec0-9f56-5426-8b4b-273eb6b25837', NULL, 'Document limitations', 'Objective: Document limitations.

Explanation: Synthetic visits cannot establish real user behavior.

Worked example: Synthetic visits cannot establish real user behavior.

Exercise: State the synthetic source, small sample and absence of causal evidence.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.', 4) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '18c13336-36f2-59ad-a61d-f2ab2aa4c228' AND (id IS DISTINCT FROM '18c13336-36f2-59ad-a61d-f2ab2aa4c228' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM 'f7802ec0-9f56-5426-8b4b-273eb6b25837' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Document limitations' OR explanation IS DISTINCT FROM 'Objective: Document limitations.

Explanation: Synthetic visits cannot establish real user behavior.

Worked example: Synthetic visits cannot establish real user behavior.

Exercise: State the synthetic source, small sample and absence of causal evidence.

Completion checklist: Save your working; explain the result in your own words; check it against the data dictionary and reference results; record uncertainties. Marking Done records learning activity, not assessed proficiency.' OR position IS DISTINCT FROM 4)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.categories (id, slug, title, description, position) VALUES ('ef1f3d98-5260-5d40-bd8e-8b330bbaf32f', 'software-ai', 'Software and AI', 'Build useful digital tools.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.categories WHERE id = 'ef1f3d98-5260-5d40-bd8e-8b330bbaf32f' AND (id IS DISTINCT FROM 'ef1f3d98-5260-5d40-bd8e-8b330bbaf32f' OR slug IS DISTINCT FROM 'software-ai' OR title IS DISTINCT FROM 'Software and AI' OR description IS DISTINCT FROM 'Build useful digital tools.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.careers (id, category_id, slug, title, description, responsibilities, skills, relevance_attributes, status, editor, source_license, source_urls, reviewed_by, reviewed_at, revision_note) VALUES ('79cfc498-d637-5dee-a28a-6544a3f9c5a0', 'ef1f3d98-5260-5d40-bd8e-8b330bbaf32f', 'frontend', 'Frontend Developer', 'Build the parts of a website people see and use, combining content, layout and browser interaction.', ARRAY['Build semantic page structure', 'Implement accessible responsive interfaces', 'Create and explain browser interactions']::text[], ARRAY['HTML', 'CSS', 'JavaScript', 'Accessibility']::text[], '{"activities": ["implement browser interfaces", "build useful interactive tools"], "boundaries": ["Frontend implementation differs from UX research", "Software interest alone does not imply AI interest"], "scope": "introductory browser development, not a complete professional curriculum"}'::jsonb, 'published', 'Codex', 'Original Asgard-authored summaries; third-party resources linked only and retain their stated licenses', ARRAY['https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting']::text[], 'Codex (source/resource review within owner-approved local prototype scope)', '2026-10-28T09:29:49Z', 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance') ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.careers WHERE id = '79cfc498-d637-5dee-a28a-6544a3f9c5a0' AND (id IS DISTINCT FROM '79cfc498-d637-5dee-a28a-6544a3f9c5a0' OR category_id IS DISTINCT FROM 'ef1f3d98-5260-5d40-bd8e-8b330bbaf32f' OR slug IS DISTINCT FROM 'frontend' OR title IS DISTINCT FROM 'Frontend Developer' OR description IS DISTINCT FROM 'Build the parts of a website people see and use, combining content, layout and browser interaction.' OR responsibilities IS DISTINCT FROM ARRAY['Build semantic page structure', 'Implement accessible responsive interfaces', 'Create and explain browser interactions']::text[] OR skills IS DISTINCT FROM ARRAY['HTML', 'CSS', 'JavaScript', 'Accessibility']::text[] OR relevance_attributes IS DISTINCT FROM '{"activities": ["implement browser interfaces", "build useful interactive tools"], "boundaries": ["Frontend implementation differs from UX research", "Software interest alone does not imply AI interest"], "scope": "introductory browser development, not a complete professional curriculum"}'::jsonb OR status IS DISTINCT FROM 'published' OR editor IS DISTINCT FROM 'Codex' OR source_license IS DISTINCT FROM 'Original Asgard-authored summaries; third-party resources linked only and retain their stated licenses' OR source_urls IS DISTINCT FROM ARRAY['https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting']::text[] OR reviewed_by IS DISTINCT FROM 'Codex (source/resource review within owner-approved local prototype scope)' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR revision_note IS DISTINCT FROM 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance')) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.roadmaps (id, career_id, title, description, status, revision_note) VALUES ('b532c214-87ae-57a6-a155-bc10d9e1eff8', '79cfc498-d637-5dee-a28a-6544a3f9c5a0', 'Frontend foundations', 'Build an accessible resource page with a working search interaction.', 'published', 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance') ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.roadmaps WHERE id = 'b532c214-87ae-57a6-a155-bc10d9e1eff8' AND (id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR career_id IS DISTINCT FROM '79cfc498-d637-5dee-a28a-6544a3f9c5a0' OR title IS DISTINCT FROM 'Frontend foundations' OR description IS DISTINCT FROM 'Build an accessible resource page with a working search interaction.' OR status IS DISTINCT FROM 'published' OR revision_note IS DISTINCT FROM 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance')) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5', 'b532c214-87ae-57a6-a155-bc10d9e1eff8', 'Web foundations', 'Understand browser delivery and build semantic, responsive pages.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5' AND (id IS DISTINCT FROM 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5' OR roadmap_id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR title IS DISTINCT FROM 'Web foundations' OR description IS DISTINCT FROM 'Understand browser delivery and build semantic, responsive pages.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('dbaeb86c-b869-540e-8018-797f183f78a3', 'b532c214-87ae-57a6-a155-bc10d9e1eff8', 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5', NULL, 'How the web works', 'Explain how a browser requests a URL and receives page content from a server. Sketch a request and response before building a page.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'dbaeb86c-b869-540e-8018-797f183f78a3' AND (id IS DISTINCT FROM 'dbaeb86c-b869-540e-8018-797f183f78a3' OR roadmap_id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR milestone_id IS DISTINCT FROM 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'How the web works' OR explanation IS DISTINCT FROM 'Explain how a browser requests a URL and receives page content from a server. Sketch a request and response before building a page.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('878a53f3-ddf7-5362-aba8-2de837d38f57', 'dbaeb86c-b869-540e-8018-797f183f78a3', 'How the web works', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works', 'documentation', TRUE, 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '878a53f3-ddf7-5362-aba8-2de837d38f57' AND (id IS DISTINCT FROM '878a53f3-ddf7-5362-aba8-2de837d38f57' OR topic_id IS DISTINCT FROM 'dbaeb86c-b869-540e-8018-797f183f78a3' OR title IS DISTINCT FROM 'How the web works' OR url IS DISTINCT FROM 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('2a164e5a-3871-5c32-9b9a-1a80bbd6b55d', 'b532c214-87ae-57a6-a155-bc10d9e1eff8', 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5', NULL, 'Semantic HTML', 'Structure a page with meaningful headings, navigation, main content, links and labeled controls. Make its reading order clear without styling.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '2a164e5a-3871-5c32-9b9a-1a80bbd6b55d' AND (id IS DISTINCT FROM '2a164e5a-3871-5c32-9b9a-1a80bbd6b55d' OR roadmap_id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR milestone_id IS DISTINCT FROM 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Semantic HTML' OR explanation IS DISTINCT FROM 'Structure a page with meaningful headings, navigation, main content, links and labeled controls. Make its reading order clear without styling.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('6e7bb628-c60d-5ad5-94e8-1b5ce854b099', '2a164e5a-3871-5c32-9b9a-1a80bbd6b55d', 'Structuring content with HTML', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content', 'documentation', TRUE, 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '6e7bb628-c60d-5ad5-94e8-1b5ce854b099' AND (id IS DISTINCT FROM '6e7bb628-c60d-5ad5-94e8-1b5ce854b099' OR topic_id IS DISTINCT FROM '2a164e5a-3871-5c32-9b9a-1a80bbd6b55d' OR title IS DISTINCT FROM 'Structuring content with HTML' OR url IS DISTINCT FROM 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('fb031a57-abc1-5879-bb03-c7a2502b141e', 'b532c214-87ae-57a6-a155-bc10d9e1eff8', 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5', NULL, 'CSS and layout', 'Use the box model, spacing, typography, Flexbox and Grid to create a readable layout that adapts to narrow screens.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'fb031a57-abc1-5879-bb03-c7a2502b141e' AND (id IS DISTINCT FROM 'fb031a57-abc1-5879-bb03-c7a2502b141e' OR roadmap_id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR milestone_id IS DISTINCT FROM 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'CSS and layout' OR explanation IS DISTINCT FROM 'Use the box model, spacing, typography, Flexbox and Grid to create a readable layout that adapts to narrow screens.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('9105cacd-8923-510e-b94e-5bc214b442cb', 'fb031a57-abc1-5879-bb03-c7a2502b141e', 'Your first website', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website', 'documentation', TRUE, 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '9105cacd-8923-510e-b94e-5bc214b442cb' AND (id IS DISTINCT FROM '9105cacd-8923-510e-b94e-5bc214b442cb' OR topic_id IS DISTINCT FROM 'fb031a57-abc1-5879-bb03-c7a2502b141e' OR title IS DISTINCT FROM 'Your first website' OR url IS DISTINCT FROM 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('6b8b642f-ff68-5306-9823-c7101a735176', 'b532c214-87ae-57a6-a155-bc10d9e1eff8', 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5', NULL, 'Accessible responsive pages', 'Use semantic controls, explicit labels and visible keyboard focus. Check that content reflows and interactions can be completed without a mouse.', 3) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '6b8b642f-ff68-5306-9823-c7101a735176' AND (id IS DISTINCT FROM '6b8b642f-ff68-5306-9823-c7101a735176' OR roadmap_id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR milestone_id IS DISTINCT FROM 'ceb9dcad-cbcf-56e1-845a-3dbcde68b1f5' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Accessible responsive pages' OR explanation IS DISTINCT FROM 'Use semantic controls, explicit labels and visible keyboard focus. Check that content reflows and interactions can be completed without a mouse.' OR position IS DISTINCT FROM 3)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('b8be5373-df31-5faf-9dcf-930750d6cbe3', '6b8b642f-ff68-5306-9823-c7101a735176', 'Accessibility on the web', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility', 'documentation', TRUE, 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = 'b8be5373-df31-5faf-9dcf-930750d6cbe3' AND (id IS DISTINCT FROM 'b8be5373-df31-5faf-9dcf-930750d6cbe3' OR topic_id IS DISTINCT FROM '6b8b642f-ff68-5306-9823-c7101a735176' OR title IS DISTINCT FROM 'Accessibility on the web' OR url IS DISTINCT FROM 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('a12dc579-82d3-5906-89c2-12fd42a20be7', 'b532c214-87ae-57a6-a155-bc10d9e1eff8', 'Your first interactive page', 'Combine structure, presentation and browser behavior in a small project.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = 'a12dc579-82d3-5906-89c2-12fd42a20be7' AND (id IS DISTINCT FROM 'a12dc579-82d3-5906-89c2-12fd42a20be7' OR roadmap_id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR title IS DISTINCT FROM 'Your first interactive page' OR description IS DISTINCT FROM 'Combine structure, presentation and browser behavior in a small project.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('e22d80e1-9354-54ce-8c64-eef58864c44c', 'b532c214-87ae-57a6-a155-bc10d9e1eff8', 'a12dc579-82d3-5906-89c2-12fd42a20be7', NULL, 'JavaScript fundamentals', 'Use values, conditions, functions and events to update page content. Explain how an event changes the visible result.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = 'e22d80e1-9354-54ce-8c64-eef58864c44c' AND (id IS DISTINCT FROM 'e22d80e1-9354-54ce-8c64-eef58864c44c' OR roadmap_id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR milestone_id IS DISTINCT FROM 'a12dc579-82d3-5906-89c2-12fd42a20be7' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'JavaScript fundamentals' OR explanation IS DISTINCT FROM 'Use values, conditions, functions and events to update page content. Explain how an event changes the visible result.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('dd8dfda5-0e40-5e41-8f66-9ae576a60812', 'e22d80e1-9354-54ce-8c64-eef58864c44c', 'Dynamic scripting with JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting', 'documentation', TRUE, 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = 'dd8dfda5-0e40-5e41-8f66-9ae576a60812' AND (id IS DISTINCT FROM 'dd8dfda5-0e40-5e41-8f66-9ae576a60812' OR topic_id IS DISTINCT FROM 'e22d80e1-9354-54ce-8c64-eef58864c44c' OR title IS DISTINCT FROM 'Dynamic scripting with JavaScript' OR url IS DISTINCT FROM 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('7ae3429a-62b2-5f0f-80c4-e0993f17b194', 'b532c214-87ae-57a6-a155-bc10d9e1eff8', 'a12dc579-82d3-5906-89c2-12fd42a20be7', NULL, 'Build a resource page', 'Build a responsive resource list with descriptive links and a labeled search filter. Include an empty-result message and check keyboard operation.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '7ae3429a-62b2-5f0f-80c4-e0993f17b194' AND (id IS DISTINCT FROM '7ae3429a-62b2-5f0f-80c4-e0993f17b194' OR roadmap_id IS DISTINCT FROM 'b532c214-87ae-57a6-a155-bc10d9e1eff8' OR milestone_id IS DISTINCT FROM 'a12dc579-82d3-5906-89c2-12fd42a20be7' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Build a resource page' OR explanation IS DISTINCT FROM 'Build a responsive resource list with descriptive links and a labeled search filter. Include an empty-result message and check keyboard operation.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('404eafbd-7c2a-55c4-a41a-88d42e0a7651', '7ae3429a-62b2-5f0f-80c4-e0993f17b194', 'Your first website', 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website', 'documentation', TRUE, 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '404eafbd-7c2a-55c4-a41a-88d42e0a7651' AND (id IS DISTINCT FROM '404eafbd-7c2a-55c4-a41a-88d42e0a7651' OR topic_id IS DISTINCT FROM '7ae3429a-62b2-5f0f-80c4-e0993f17b194' OR title IS DISTINCT FROM 'Your first website' OR url IS DISTINCT FROM 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'CC BY-SA 2.5 or later; MDN attribution/copyright guidance; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.categories (id, slug, title, description, position) VALUES ('fcb7e2db-50d6-598c-993a-5adea5d1ced9', 'data-analytics', 'Data and Analytics', 'Explore information and explain findings.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.categories WHERE id = 'fcb7e2db-50d6-598c-993a-5adea5d1ced9' AND (id IS DISTINCT FROM 'fcb7e2db-50d6-598c-993a-5adea5d1ced9' OR slug IS DISTINCT FROM 'data-analytics' OR title IS DISTINCT FROM 'Data and Analytics' OR description IS DISTINCT FROM 'Explore information and explain findings.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.careers (id, category_id, slug, title, description, responsibilities, skills, relevance_attributes, status, editor, source_license, source_urls, reviewed_by, reviewed_at, revision_note) VALUES ('0f8f854e-4b87-5c2c-9d99-5a557fe304de', 'fcb7e2db-50d6-598c-993a-5adea5d1ced9', 'data-analyst', 'Data Analyst', 'Turn a focused question into an understandable finding by organizing, checking and examining data.', ARRAY['Clarify a question and its data', 'Check and summarize records', 'Explain findings and their limits']::text[], ARRAY['Data cleaning', 'Spreadsheets', 'SQL', 'Charts']::text[], '{"activities": ["find patterns in data", "organize and summarize information", "explain findings"], "boundaries": ["This is analysis, not predictive modeling or data infrastructure", "Prior mathematical proficiency is not inferred"], "scope": "a small tabular analysis and report"}'::jsonb, 'published', 'Codex', 'Original Asgard-authored summaries; third-party resources linked only and retain their stated licenses', ARRAY['https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'https://www.sqlite.org/lang_select.html']::text[], 'Codex (source/resource review within owner-approved local prototype scope)', '2026-10-28T09:29:49Z', 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance') ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.careers WHERE id = '0f8f854e-4b87-5c2c-9d99-5a557fe304de' AND (id IS DISTINCT FROM '0f8f854e-4b87-5c2c-9d99-5a557fe304de' OR category_id IS DISTINCT FROM 'fcb7e2db-50d6-598c-993a-5adea5d1ced9' OR slug IS DISTINCT FROM 'data-analyst' OR title IS DISTINCT FROM 'Data Analyst' OR description IS DISTINCT FROM 'Turn a focused question into an understandable finding by organizing, checking and examining data.' OR responsibilities IS DISTINCT FROM ARRAY['Clarify a question and its data', 'Check and summarize records', 'Explain findings and their limits']::text[] OR skills IS DISTINCT FROM ARRAY['Data cleaning', 'Spreadsheets', 'SQL', 'Charts']::text[] OR relevance_attributes IS DISTINCT FROM '{"activities": ["find patterns in data", "organize and summarize information", "explain findings"], "boundaries": ["This is analysis, not predictive modeling or data infrastructure", "Prior mathematical proficiency is not inferred"], "scope": "a small tabular analysis and report"}'::jsonb OR status IS DISTINCT FROM 'published' OR editor IS DISTINCT FROM 'Codex' OR source_license IS DISTINCT FROM 'Original Asgard-authored summaries; third-party resources linked only and retain their stated licenses' OR source_urls IS DISTINCT FROM ARRAY['https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'https://www.sqlite.org/lang_select.html']::text[] OR reviewed_by IS DISTINCT FROM 'Codex (source/resource review within owner-approved local prototype scope)' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR revision_note IS DISTINCT FROM 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance')) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('7340a24e-3562-59bd-bce7-07e83c84b53c', 'b80c682c-a38f-5799-8d6f-2382e463273e', 'Calc tables and functions', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '7340a24e-3562-59bd-bce7-07e83c84b53c' AND (id IS DISTINCT FROM '7340a24e-3562-59bd-bce7-07e83c84b53c' OR topic_id IS DISTINCT FROM 'b80c682c-a38f-5799-8d6f-2382e463273e' OR title IS DISTINCT FROM 'Calc tables and functions' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('881efdac-12c8-5d8d-be3e-17f1f912a48b', '3c08dc34-22cc-5582-befc-e90439cb759b', 'Working with Calc data', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '881efdac-12c8-5d8d-be3e-17f1f912a48b' AND (id IS DISTINCT FROM '881efdac-12c8-5d8d-be3e-17f1f912a48b' OR topic_id IS DISTINCT FROM '3c08dc34-22cc-5582-befc-e90439cb759b' OR title IS DISTINCT FROM 'Working with Calc data' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.branch_groups (id, roadmap_id, milestone_id, title, explanation, position) VALUES ('95f8d8e8-42ad-540d-b868-3f2676ea5ca6', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', 'Choose an analysis tool', 'Choose spreadsheets or SQL for this exercise. Both paths lead to the same reporting topics; neither choice measures ability.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.branch_groups WHERE id = '95f8d8e8-42ad-540d-b868-3f2676ea5ca6' AND (id IS DISTINCT FROM '95f8d8e8-42ad-540d-b868-3f2676ea5ca6' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR title IS DISTINCT FROM 'Choose an analysis tool' OR explanation IS DISTINCT FROM 'Choose spreadsheets or SQL for this exercise. Both paths lead to the same reporting topics; neither choice measures ability.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.branches (id, roadmap_id, milestone_id, group_id, title, position) VALUES ('44c52bb2-7d78-5c5a-b668-b40852d0a811', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '95f8d8e8-42ad-540d-b868-3f2676ea5ca6', 'Spreadsheet', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.branches WHERE id = '44c52bb2-7d78-5c5a-b668-b40852d0a811' AND (id IS DISTINCT FROM '44c52bb2-7d78-5c5a-b668-b40852d0a811' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR group_id IS DISTINCT FROM '95f8d8e8-42ad-540d-b868-3f2676ea5ca6' OR title IS DISTINCT FROM 'Spreadsheet' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.branches (id, roadmap_id, milestone_id, group_id, title, position) VALUES ('2e66403c-32a9-534d-b8ba-677e0669b754', 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453', '95f8d8e8-42ad-540d-b868-3f2676ea5ca6', 'SQL', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.branches WHERE id = '2e66403c-32a9-534d-b8ba-677e0669b754' AND (id IS DISTINCT FROM '2e66403c-32a9-534d-b8ba-677e0669b754' OR roadmap_id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR milestone_id IS DISTINCT FROM '3cb6da6b-3f4a-5a63-aeba-8e2c693d5453' OR group_id IS DISTINCT FROM '95f8d8e8-42ad-540d-b868-3f2676ea5ca6' OR title IS DISTINCT FROM 'SQL' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('536779d8-59f0-5555-8f78-8316d1c34c47', 'cd8d7609-a486-58fa-9784-4610494e3fa9', 'LibreOffice Calc Help', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '536779d8-59f0-5555-8f78-8316d1c34c47' AND (id IS DISTINCT FROM '536779d8-59f0-5555-8f78-8316d1c34c47' OR topic_id IS DISTINCT FROM 'cd8d7609-a486-58fa-9784-4610494e3fa9' OR title IS DISTINCT FROM 'LibreOffice Calc Help' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('99b7b65d-5d2b-5e94-8198-8d7b7ca86a84', 'b940a238-c0dc-50be-a414-d19790d208de', 'SQLite SELECT documentation', 'https://www.sqlite.org/lang_select.html', 'documentation', TRUE, 'Public domain; SQLite code and documentation dedication; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '99b7b65d-5d2b-5e94-8198-8d7b7ca86a84' AND (id IS DISTINCT FROM '99b7b65d-5d2b-5e94-8198-8d7b7ca86a84' OR topic_id IS DISTINCT FROM 'b940a238-c0dc-50be-a414-d19790d208de' OR title IS DISTINCT FROM 'SQLite SELECT documentation' OR url IS DISTINCT FROM 'https://www.sqlite.org/lang_select.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Public domain; SQLite code and documentation dedication; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('1630efad-7210-5536-a80b-a41fe0b343cc', 'fdd389dc-a4d2-5db9-8880-48e76f47f572', 'Creating charts in Calc', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '1630efad-7210-5536-a80b-a41fe0b343cc' AND (id IS DISTINCT FROM '1630efad-7210-5536-a80b-a41fe0b343cc' OR topic_id IS DISTINCT FROM 'fdd389dc-a4d2-5db9-8880-48e76f47f572' OR title IS DISTINCT FROM 'Creating charts in Calc' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('2c2d049e-f3d4-5629-a749-67a996a51ef8', '77298d0f-9b48-5db5-9604-9446fdc9f166', 'Calc analysis and charts', 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html', 'documentation', TRUE, 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '2c2d049e-f3d4-5629-a749-67a996a51ef8' AND (id IS DISTINCT FROM '2c2d049e-f3d4-5629-a749-67a996a51ef8' OR topic_id IS DISTINCT FROM '77298d0f-9b48-5db5-9604-9446fdc9f166' OR title IS DISTINCT FROM 'Calc analysis and charts' OR url IS DISTINCT FROM 'https://help.libreoffice.org/latest/en-US/text/scalc/main0000.html' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Mozilla Public License 2.0; LibreOffice Help copyright notice; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.categories (id, slug, title, description, position) VALUES ('94623806-8d20-54ad-8db7-9bbd7ccb338c', 'design-ux', 'Design and UX', 'Understand people and improve product interactions.', 2) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.categories WHERE id = '94623806-8d20-54ad-8db7-9bbd7ccb338c' AND (id IS DISTINCT FROM '94623806-8d20-54ad-8db7-9bbd7ccb338c' OR slug IS DISTINCT FROM 'design-ux' OR title IS DISTINCT FROM 'Design and UX' OR description IS DISTINCT FROM 'Understand people and improve product interactions.' OR position IS DISTINCT FROM 2)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.careers (id, category_id, slug, title, description, responsibilities, skills, relevance_attributes, status, editor, source_license, source_urls, reviewed_by, reviewed_at, revision_note) VALUES ('38e46141-e303-5cd6-a589-7ee57147488d', '94623806-8d20-54ad-8db7-9bbd7ccb338c', 'ui-ux-designer', 'UI/UX Designer', 'Understand what people need and shape clear interfaces and interactions that help them complete a task.', ARRAY['Understand user goals', 'Sketch task flows and interfaces', 'Observe and improve usability']::text[], ARRAY['User needs', 'Information architecture', 'Wireframes', 'Usability']::text[], '{"activities": ["plan screens and navigation", "understand user needs", "improve usability"], "boundaries": ["Design research and interface planning differ from implementing frontend code", "Visual preference is not evidence of design proficiency"], "scope": "one small task flow and a low-fidelity interface exercise"}'::jsonb, 'published', 'Codex', 'Original Asgard-authored summaries; third-party resources linked only and retain their stated licenses', ARRAY['https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs', 'https://www.gov.uk/service-manual/design/making-prototypes', 'https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing']::text[], 'Codex (source/resource review within owner-approved local prototype scope)', '2026-10-28T09:29:49Z', 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance') ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.careers WHERE id = '38e46141-e303-5cd6-a589-7ee57147488d' AND (id IS DISTINCT FROM '38e46141-e303-5cd6-a589-7ee57147488d' OR category_id IS DISTINCT FROM '94623806-8d20-54ad-8db7-9bbd7ccb338c' OR slug IS DISTINCT FROM 'ui-ux-designer' OR title IS DISTINCT FROM 'UI/UX Designer' OR description IS DISTINCT FROM 'Understand what people need and shape clear interfaces and interactions that help them complete a task.' OR responsibilities IS DISTINCT FROM ARRAY['Understand user goals', 'Sketch task flows and interfaces', 'Observe and improve usability']::text[] OR skills IS DISTINCT FROM ARRAY['User needs', 'Information architecture', 'Wireframes', 'Usability']::text[] OR relevance_attributes IS DISTINCT FROM '{"activities": ["plan screens and navigation", "understand user needs", "improve usability"], "boundaries": ["Design research and interface planning differ from implementing frontend code", "Visual preference is not evidence of design proficiency"], "scope": "one small task flow and a low-fidelity interface exercise"}'::jsonb OR status IS DISTINCT FROM 'published' OR editor IS DISTINCT FROM 'Codex' OR source_license IS DISTINCT FROM 'Original Asgard-authored summaries; third-party resources linked only and retain their stated licenses' OR source_urls IS DISTINCT FROM ARRAY['https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs', 'https://www.gov.uk/service-manual/design/making-prototypes', 'https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing']::text[] OR reviewed_by IS DISTINCT FROM 'Codex (source/resource review within owner-approved local prototype scope)' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR revision_note IS DISTINCT FROM 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance')) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.roadmaps (id, career_id, title, description, status, revision_note) VALUES ('27a28a6f-33b0-5d93-92de-b243c11401b0', '38e46141-e303-5cd6-a589-7ee57147488d', 'UI/UX foundations', 'Design and revise a simple flow for finding and saving a useful resource.', 'published', 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance') ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.roadmaps WHERE id = '27a28a6f-33b0-5d93-92de-b243c11401b0' AND (id IS DISTINCT FROM '27a28a6f-33b0-5d93-92de-b243c11401b0' OR career_id IS DISTINCT FROM '38e46141-e303-5cd6-a589-7ee57147488d' OR title IS DISTINCT FROM 'UI/UX foundations' OR description IS DISTINCT FROM 'Design and revise a simple flow for finding and saving a useful resource.' OR status IS DISTINCT FROM 'published' OR revision_note IS DISTINCT FROM 'Owner-approved connected-prototype plan, this task, 2026-10-28; Codex source/resource review, not runtime or learner acceptance')) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('bcae65ae-d49f-5f08-8497-51b09c7da7f2', '27a28a6f-33b0-5d93-92de-b243c11401b0', 'Understand the task', 'Start with the person''s goal before drawing screens.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = 'bcae65ae-d49f-5f08-8497-51b09c7da7f2' AND (id IS DISTINCT FROM 'bcae65ae-d49f-5f08-8497-51b09c7da7f2' OR roadmap_id IS DISTINCT FROM '27a28a6f-33b0-5d93-92de-b243c11401b0' OR title IS DISTINCT FROM 'Understand the task' OR description IS DISTINCT FROM 'Start with the person''s goal before drawing screens.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('491d037c-6b99-579c-87a0-84f9c4345dc0', '27a28a6f-33b0-5d93-92de-b243c11401b0', 'bcae65ae-d49f-5f08-8497-51b09c7da7f2', NULL, 'Understand user goals', 'Describe who is trying to do what and why. Record assumptions separately from observations and avoid assuming that your own preferences represent everyone.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '491d037c-6b99-579c-87a0-84f9c4345dc0' AND (id IS DISTINCT FROM '491d037c-6b99-579c-87a0-84f9c4345dc0' OR roadmap_id IS DISTINCT FROM '27a28a6f-33b0-5d93-92de-b243c11401b0' OR milestone_id IS DISTINCT FROM 'bcae65ae-d49f-5f08-8497-51b09c7da7f2' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Understand user goals' OR explanation IS DISTINCT FROM 'Describe who is trying to do what and why. Record assumptions separately from observations and avoid assuming that your own preferences represent everyone.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('3e870b3b-2934-520e-a30e-1f78aa18c1c7', '491d037c-6b99-579c-87a0-84f9c4345dc0', 'Learning about users and their needs', 'https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs', 'documentation', TRUE, 'Open Government Licence 3.0 except where stated; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '3e870b3b-2934-520e-a30e-1f78aa18c1c7' AND (id IS DISTINCT FROM '3e870b3b-2934-520e-a30e-1f78aa18c1c7' OR topic_id IS DISTINCT FROM '491d037c-6b99-579c-87a0-84f9c4345dc0' OR title IS DISTINCT FROM 'Learning about users and their needs' OR url IS DISTINCT FROM 'https://www.gov.uk/service-manual/user-research/start-by-learning-user-needs' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Open Government Licence 3.0 except where stated; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('68c57cf2-af6d-5f7c-a3ef-9f941eddcbee', '27a28a6f-33b0-5d93-92de-b243c11401b0', 'bcae65ae-d49f-5f08-8497-51b09c7da7f2', NULL, 'Sketch a user flow', 'Sketch the steps needed to find and save a resource. Include the starting point, important decisions and a recovery path when something is missing.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '68c57cf2-af6d-5f7c-a3ef-9f941eddcbee' AND (id IS DISTINCT FROM '68c57cf2-af6d-5f7c-a3ef-9f941eddcbee' OR roadmap_id IS DISTINCT FROM '27a28a6f-33b0-5d93-92de-b243c11401b0' OR milestone_id IS DISTINCT FROM 'bcae65ae-d49f-5f08-8497-51b09c7da7f2' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Sketch a user flow' OR explanation IS DISTINCT FROM 'Sketch the steps needed to find and save a resource. Include the starting point, important decisions and a recovery path when something is missing.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('09e9a5ae-6977-56a4-8e1a-92504007ec8f', '68c57cf2-af6d-5f7c-a3ef-9f941eddcbee', 'Making prototypes', 'https://www.gov.uk/service-manual/design/making-prototypes', 'documentation', TRUE, 'Open Government Licence 3.0 except where stated; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '09e9a5ae-6977-56a4-8e1a-92504007ec8f' AND (id IS DISTINCT FROM '09e9a5ae-6977-56a4-8e1a-92504007ec8f' OR topic_id IS DISTINCT FROM '68c57cf2-af6d-5f7c-a3ef-9f941eddcbee' OR title IS DISTINCT FROM 'Making prototypes' OR url IS DISTINCT FROM 'https://www.gov.uk/service-manual/design/making-prototypes' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Open Government Licence 3.0 except where stated; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.milestones (id, roadmap_id, title, description, position) VALUES ('61b87975-01ff-52cd-81e8-bfa89422c213', '27a28a6f-33b0-5d93-92de-b243c11401b0', 'Design and observe', 'Make a low-fidelity interface and learn where a person struggles.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.milestones WHERE id = '61b87975-01ff-52cd-81e8-bfa89422c213' AND (id IS DISTINCT FROM '61b87975-01ff-52cd-81e8-bfa89422c213' OR roadmap_id IS DISTINCT FROM '27a28a6f-33b0-5d93-92de-b243c11401b0' OR title IS DISTINCT FROM 'Design and observe' OR description IS DISTINCT FROM 'Make a low-fidelity interface and learn where a person struggles.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('1a49a598-2346-54b9-8f19-d789e20a94a1', '27a28a6f-33b0-5d93-92de-b243c11401b0', '61b87975-01ff-52cd-81e8-bfa89422c213', NULL, 'Create a wireframe', 'Draw the content, controls and navigation for the flow. Keep labels clear and explain how the layout supports the task; polished artwork is unnecessary.', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '1a49a598-2346-54b9-8f19-d789e20a94a1' AND (id IS DISTINCT FROM '1a49a598-2346-54b9-8f19-d789e20a94a1' OR roadmap_id IS DISTINCT FROM '27a28a6f-33b0-5d93-92de-b243c11401b0' OR milestone_id IS DISTINCT FROM '61b87975-01ff-52cd-81e8-bfa89422c213' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Create a wireframe' OR explanation IS DISTINCT FROM 'Draw the content, controls and navigation for the flow. Keep labels clear and explain how the layout supports the task; polished artwork is unnecessary.' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('7a7139ac-67a7-5775-8df1-1f9e54cf4500', '1a49a598-2346-54b9-8f19-d789e20a94a1', 'Making prototypes', 'https://www.gov.uk/service-manual/design/making-prototypes', 'documentation', TRUE, 'Open Government Licence 3.0 except where stated; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = '7a7139ac-67a7-5775-8df1-1f9e54cf4500' AND (id IS DISTINCT FROM '7a7139ac-67a7-5775-8df1-1f9e54cf4500' OR topic_id IS DISTINCT FROM '1a49a598-2346-54b9-8f19-d789e20a94a1' OR title IS DISTINCT FROM 'Making prototypes' OR url IS DISTINCT FROM 'https://www.gov.uk/service-manual/design/making-prototypes' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Open Government Licence 3.0 except where stated; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.topics (id, roadmap_id, milestone_id, branch_id, title, explanation, position) VALUES ('2d39682f-295a-56b9-a00a-081090863b56', '27a28a6f-33b0-5d93-92de-b243c11401b0', '61b87975-01ff-52cd-81e8-bfa89422c213', NULL, 'Run a small usability exercise', 'Ask a willing participant to try the flow while you observe. Record task difficulties without coaching, revise one issue and explain what still needs research.', 1) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.topics WHERE id = '2d39682f-295a-56b9-a00a-081090863b56' AND (id IS DISTINCT FROM '2d39682f-295a-56b9-a00a-081090863b56' OR roadmap_id IS DISTINCT FROM '27a28a6f-33b0-5d93-92de-b243c11401b0' OR milestone_id IS DISTINCT FROM '61b87975-01ff-52cd-81e8-bfa89422c213' OR branch_id IS DISTINCT FROM NULL OR title IS DISTINCT FROM 'Run a small usability exercise' OR explanation IS DISTINCT FROM 'Ask a willing participant to try the flow while you observe. Record task difficulties without coaching, revise one issue and explain what still needs research.' OR position IS DISTINCT FROM 1)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.resources (id, topic_id, title, url, kind, is_free, license, reviewed_at, position) VALUES ('adf56521-9d26-570f-9c07-5236814c0387', '2d39682f-295a-56b9-a00a-081090863b56', 'Using moderated usability testing', 'https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing', 'documentation', TRUE, 'Open Government Licence 3.0 except where stated; external link only, no source text redistributed', '2026-10-28T09:29:49Z', 0) ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.resources WHERE id = 'adf56521-9d26-570f-9c07-5236814c0387' AND (id IS DISTINCT FROM 'adf56521-9d26-570f-9c07-5236814c0387' OR topic_id IS DISTINCT FROM '2d39682f-295a-56b9-a00a-081090863b56' OR title IS DISTINCT FROM 'Using moderated usability testing' OR url IS DISTINCT FROM 'https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing' OR kind IS DISTINCT FROM 'documentation' OR is_free IS DISTINCT FROM TRUE OR license IS DISTINCT FROM 'Open Government Licence 3.0 except where stated; external link only, no source text redistributed' OR reviewed_at IS DISTINCT FROM '2026-10-28T09:29:49Z' OR position IS DISTINCT FROM 0)) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.questionnaires (id, version, published_at) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 1, '2026-10-28T09:29:49Z') ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questionnaires WHERE id = 'c43761e3-b78b-5295-9737-e46b93365379' AND (id IS DISTINCT FROM 'c43761e3-b78b-5295-9737-e46b93365379' OR version IS DISTINCT FROM 1 OR published_at IS DISTINCT FROM '2026-10-28T09:29:49Z')) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'interests', 0) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'interests' AND position <> 0) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'activities_tools', 1) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'activities_tools' AND position <> 1) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'activities_design', 2) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'activities_design' AND position <> 2) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'activities_investigation', 3) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'activities_investigation' AND position <> 3) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'activities_systems', 4) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'activities_systems' AND position <> 4) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'activities_general', 5) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'activities_general' AND position <> 5) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'approach', 6) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'approach' AND position <> 6) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'background', 7) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'background' AND position <> 7) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ('c43761e3-b78b-5295-9737-e46b93365379', 'goals', 8) ON CONFLICT (questionnaire_id, id) DO NOTHING;
DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = 'c43761e3-b78b-5295-9737-e46b93365379' AND id = 'goals' AND position <> 8) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;
INSERT INTO asgard_catalog.roadmaps (id, career_id, title, description, status, revision, revision_note) VALUES ('a51f6aec-f3d9-5ba8-97e1-3c9e500b375d', '0f8f854e-4b87-5c2c-9d99-5a557fe304de', 'Data analysis foundations', 'Answer one question with a small table, a chart and a short explanation.', 'published', 2, 'Detailed Data Analyst path; existing progress retained') ON CONFLICT (id) DO NOTHING;
DO $asgard_content$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.roadmaps WHERE id = 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' AND (id IS DISTINCT FROM 'a51f6aec-f3d9-5ba8-97e1-3c9e500b375d' OR career_id IS DISTINCT FROM '0f8f854e-4b87-5c2c-9d99-5a557fe304de' OR title IS DISTINCT FROM 'Data analysis foundations' OR description IS DISTINCT FROM 'Answer one question with a small table, a chart and a short explanation.' OR status IS DISTINCT FROM 'published' OR revision IS DISTINCT FROM 2 OR revision_note IS DISTINCT FROM 'Detailed Data Analyst path; existing progress retained')) THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END $asgard_content$;
COMMIT;
