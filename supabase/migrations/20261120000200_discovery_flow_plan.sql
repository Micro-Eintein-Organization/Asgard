-- Discovery v4: route/progress metadata only; no resume text, skill claims or quotes.
BEGIN;
ALTER TABLE asgard_private.discovery_sessions
  ADD COLUMN flow_plan jsonb NOT NULL DEFAULT '{}'::jsonb
  CHECK (jsonb_typeof(flow_plan) = 'object');
COMMIT;
