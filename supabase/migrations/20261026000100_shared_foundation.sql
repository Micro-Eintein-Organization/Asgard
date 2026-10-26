-- Stage 4 additive foundation. No catalog/questionnaire content or feature workflows.
CREATE SCHEMA asgard_catalog;
REVOKE ALL ON SCHEMA asgard_catalog FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA asgard_catalog TO asgard_app;

CREATE TABLE asgard_catalog.releases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version integer NOT NULL UNIQUE CHECK (version > 0),
  published_at timestamptz NOT NULL DEFAULT statement_timestamp()
);
CREATE TABLE asgard_catalog.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text NOT NULL CHECK (btrim(title) <> ''),
  description text NOT NULL,
  position integer NOT NULL UNIQUE CHECK (position >= 0)
);
CREATE TABLE asgard_catalog.careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES asgard_catalog.categories ON DELETE RESTRICT,
  slug text NOT NULL UNIQUE,
  title text NOT NULL CHECK (btrim(title) <> ''),
  description text NOT NULL,
  responsibilities text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  relevance_attributes jsonb NOT NULL DEFAULT '{}' CHECK (jsonb_typeof(relevance_attributes) = 'object'),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'retired')),
  editor text,
  source_license text,
  source_urls text[] NOT NULL DEFAULT '{}',
  reviewed_by text,
  reviewed_at timestamptz,
  revision_note text NOT NULL DEFAULT '',
  CHECK (status <> 'published' OR (editor IS NOT NULL AND source_license IS NOT NULL
    AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL))
);
CREATE INDEX careers_category ON asgard_catalog.careers(category_id);
CREATE TABLE asgard_catalog.roadmaps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id uuid NOT NULL REFERENCES asgard_catalog.careers ON DELETE RESTRICT,
  title text NOT NULL CHECK (btrim(title) <> ''),
  description text NOT NULL,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'retired')),
  revision_note text NOT NULL DEFAULT '',
  UNIQUE (career_id, id)
);
CREATE TABLE asgard_catalog.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL REFERENCES asgard_catalog.roadmaps ON DELETE RESTRICT,
  title text NOT NULL CHECK (btrim(title) <> ''),
  description text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  retired_at timestamptz,
  UNIQUE (roadmap_id, id), UNIQUE (roadmap_id, position)
);
CREATE TABLE asgard_catalog.branch_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL,
  milestone_id uuid NOT NULL,
  title text NOT NULL,
  explanation text NOT NULL CHECK (btrim(explanation) <> ''),
  position integer NOT NULL CHECK (position >= 0),
  FOREIGN KEY (roadmap_id, milestone_id) REFERENCES asgard_catalog.milestones(roadmap_id, id),
  UNIQUE (roadmap_id, milestone_id, id), UNIQUE (roadmap_id, id),
  UNIQUE (milestone_id, position)
);
CREATE TABLE asgard_catalog.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL,
  milestone_id uuid NOT NULL,
  group_id uuid NOT NULL,
  title text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  FOREIGN KEY (roadmap_id, milestone_id, group_id)
    REFERENCES asgard_catalog.branch_groups(roadmap_id, milestone_id, id),
  UNIQUE (roadmap_id, milestone_id, id), UNIQUE (roadmap_id, group_id, id),
  UNIQUE (group_id, position)
);
CREATE TABLE asgard_catalog.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id uuid NOT NULL,
  milestone_id uuid NOT NULL,
  branch_id uuid,
  title text NOT NULL CHECK (btrim(title) <> ''),
  explanation text NOT NULL CHECK (btrim(explanation) <> ''),
  position integer NOT NULL CHECK (position >= 0),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  retired_at timestamptz,
  revision_note text NOT NULL DEFAULT '',
  FOREIGN KEY (roadmap_id, milestone_id) REFERENCES asgard_catalog.milestones(roadmap_id, id),
  FOREIGN KEY (roadmap_id, milestone_id, branch_id)
    REFERENCES asgard_catalog.branches(roadmap_id, milestone_id, id),
  UNIQUE (roadmap_id, id),
  UNIQUE NULLS NOT DISTINCT (milestone_id, branch_id, position)
);
CREATE INDEX topics_branch ON asgard_catalog.topics(branch_id);
CREATE TABLE asgard_catalog.topic_prerequisites (
  roadmap_id uuid NOT NULL,
  topic_id uuid NOT NULL,
  prerequisite_id uuid NOT NULL,
  PRIMARY KEY (topic_id, prerequisite_id),
  CHECK (topic_id <> prerequisite_id),
  FOREIGN KEY (roadmap_id, topic_id) REFERENCES asgard_catalog.topics(roadmap_id, id),
  FOREIGN KEY (roadmap_id, prerequisite_id) REFERENCES asgard_catalog.topics(roadmap_id, id)
);
CREATE INDEX prerequisites_target ON asgard_catalog.topic_prerequisites(prerequisite_id);
CREATE TABLE asgard_catalog.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES asgard_catalog.topics ON DELETE RESTRICT,
  title text NOT NULL,
  url text NOT NULL CHECK (url ~ '^https://'),
  kind text NOT NULL CHECK (kind IN ('article', 'course', 'video', 'documentation', 'tool')),
  is_free boolean NOT NULL,
  license text NOT NULL,
  reviewed_at timestamptz NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  UNIQUE (topic_id, position)
);

CREATE TABLE asgard_catalog.questionnaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version integer NOT NULL UNIQUE CHECK (version > 0),
  published_at timestamptz
);
CREATE TABLE asgard_catalog.questions (
  questionnaire_id uuid NOT NULL REFERENCES asgard_catalog.questionnaires ON DELETE RESTRICT,
  id text NOT NULL CHECK (char_length(id) BETWEEN 1 AND 100),
  position integer NOT NULL CHECK (position >= 0),
  PRIMARY KEY (questionnaire_id, id), UNIQUE (questionnaire_id, position)
);

CREATE TABLE asgard_private.learning_state (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  current_roadmap_id uuid REFERENCES asgard_catalog.roadmaps ON DELETE RESTRICT,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  context_revision bigint NOT NULL DEFAULT 1 CHECK (context_revision > 0),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp()
);
CREATE TABLE asgard_private.preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  preferred_category_id uuid REFERENCES asgard_catalog.categories ON DELETE RESTRICT,
  timezone text NOT NULL DEFAULT 'UTC' CHECK (char_length(timezone) BETWEEN 1 AND 100),
  dismissed_guidance text[] NOT NULL DEFAULT '{}',
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0)
);
CREATE TABLE asgard_private.discovery_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES asgard_private.learning_state ON DELETE CASCADE,
  questionnaire_id uuid NOT NULL REFERENCES asgard_catalog.questionnaires ON DELETE RESTRICT,
  source_session_id uuid,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  revision bigint NOT NULL DEFAULT 1 CHECK (revision > 0),
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  completed_at timestamptz,
  UNIQUE (user_id, id), UNIQUE (id, questionnaire_id), UNIQUE (user_id, id, revision),
  FOREIGN KEY (user_id, source_session_id) REFERENCES asgard_private.discovery_sessions(user_id, id),
  CHECK (source_session_id IS DISTINCT FROM id),
  CHECK ((status = 'completed') = (completed_at IS NOT NULL))
);
CREATE UNIQUE INDEX one_discovery_draft ON asgard_private.discovery_sessions(user_id)
  WHERE status = 'draft';
CREATE TABLE asgard_private.discovery_answers (
  user_id uuid NOT NULL,
  session_id uuid NOT NULL,
  questionnaire_id uuid NOT NULL,
  question_id text NOT NULL,
  option_ids text[] NOT NULL CHECK (cardinality(option_ids) BETWEEN 1 AND 5),
  PRIMARY KEY (session_id, question_id),
  FOREIGN KEY (user_id, session_id) REFERENCES asgard_private.discovery_sessions(user_id, id)
    ON DELETE CASCADE,
  FOREIGN KEY (session_id, questionnaire_id)
    REFERENCES asgard_private.discovery_sessions(id, questionnaire_id),
  FOREIGN KEY (questionnaire_id, question_id) REFERENCES asgard_catalog.questions(questionnaire_id, id)
);
CREATE INDEX discovery_answers_owner ON asgard_private.discovery_answers(user_id);
CREATE TABLE asgard_private.branch_choices (
  user_id uuid NOT NULL REFERENCES asgard_private.learning_state ON DELETE CASCADE,
  roadmap_id uuid NOT NULL,
  group_id uuid NOT NULL,
  branch_id uuid NOT NULL,
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (roadmap_id, group_id, branch_id)
    REFERENCES asgard_catalog.branches(roadmap_id, group_id, id)
);
CREATE TABLE asgard_private.topic_progress (
  user_id uuid NOT NULL REFERENCES asgard_private.learning_state ON DELETE CASCADE,
  roadmap_id uuid NOT NULL,
  topic_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('not_started', 'learning', 'done', 'skipped')),
  version bigint NOT NULL DEFAULT 1 CHECK (version > 0),
  updated_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  PRIMARY KEY (user_id, roadmap_id, topic_id),
  FOREIGN KEY (roadmap_id, topic_id) REFERENCES asgard_catalog.topics(roadmap_id, id)
);
CREATE UNIQUE INDEX one_learning_topic ON asgard_private.topic_progress(user_id)
  WHERE status = 'learning';
CREATE INDEX progress_topic ON asgard_private.topic_progress(roadmap_id, topic_id);
CREATE TABLE asgard_private.progress_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  roadmap_id uuid NOT NULL,
  topic_id uuid NOT NULL,
  from_status text NOT NULL CHECK (from_status IN ('not_started', 'learning', 'done', 'skipped')),
  to_status text NOT NULL CHECK (to_status IN ('not_started', 'learning', 'done', 'skipped')),
  occurred_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  FOREIGN KEY (user_id, roadmap_id, topic_id)
    REFERENCES asgard_private.topic_progress(user_id, roadmap_id, topic_id) ON DELETE CASCADE
);
CREATE INDEX events_owner_time ON asgard_private.progress_events(user_id, occurred_at DESC);
CREATE TABLE asgard_private.completion_activity (
  user_id uuid NOT NULL,
  roadmap_id uuid NOT NULL,
  topic_id uuid NOT NULL,
  local_date date NOT NULL,
  timezone text NOT NULL CHECK (char_length(timezone) BETWEEN 1 AND 100),
  completed_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  PRIMARY KEY (user_id, roadmap_id, topic_id, local_date),
  FOREIGN KEY (user_id, roadmap_id, topic_id)
    REFERENCES asgard_private.topic_progress(user_id, roadmap_id, topic_id) ON DELETE CASCADE
);
CREATE INDEX activity_owner_date ON asgard_private.completion_activity(user_id, local_date DESC);

CREATE TABLE asgard_private.recommendation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES asgard_private.learning_state ON DELETE CASCADE,
  discovery_session_id uuid,
  discovery_revision bigint,
  context_revision bigint NOT NULL CHECK (context_revision > 0),
  catalog_release_id uuid NOT NULL REFERENCES asgard_catalog.releases ON DELETE RESTRICT,
  prompt_version text NOT NULL CHECK (char_length(prompt_version) BETWEEN 1 AND 100),
  schema_version text NOT NULL CHECK (char_length(schema_version) BETWEEN 1 AND 100),
  idempotency_key uuid NOT NULL,
  -- Immutable versioned facts and eligible catalog IDs; never raw prompts/provider output.
  context_snapshot jsonb NOT NULL CHECK (jsonb_typeof(context_snapshot) = 'object'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  failure_code text CHECK (failure_code IN ('timeout', 'quota_exceeded', 'provider_unavailable',
    'invalid_output', 'context_outdated', 'no_eligible_context')),
  model_id text,
  created_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  deadline_at timestamptz NOT NULL,
  finished_at timestamptz,
  UNIQUE (user_id, id), UNIQUE (user_id, idempotency_key),
  FOREIGN KEY (user_id, discovery_session_id, discovery_revision)
    REFERENCES asgard_private.discovery_sessions(user_id, id, revision),
  CHECK ((discovery_session_id IS NULL) = (discovery_revision IS NULL)),
  CHECK ((status = 'pending') = (finished_at IS NULL)),
  CHECK ((status = 'failed') = (failure_code IS NOT NULL)),
  CHECK (deadline_at > created_at)
);
CREATE UNIQUE INDEX one_pending_recommendation ON asgard_private.recommendation_runs(user_id)
  WHERE status = 'pending';
CREATE INDEX recommendation_reuse ON asgard_private.recommendation_runs
  (user_id, context_revision, catalog_release_id, prompt_version, schema_version);
CREATE TABLE asgard_private.recommendation_items (
  user_id uuid NOT NULL,
  run_id uuid NOT NULL,
  position integer NOT NULL CHECK (position BETWEEN 0 AND 2),
  career_id uuid NOT NULL REFERENCES asgard_catalog.careers ON DELETE RESTRICT,
  roadmap_id uuid,
  starting_topic_id uuid,
  reason text NOT NULL CHECK (char_length(btrim(reason)) BETWEEN 1 AND 1200),
  uncertainty_note text CHECK (char_length(uncertainty_note) BETWEEN 1 AND 600),
  evidence_fact_ids text[] NOT NULL CHECK (cardinality(evidence_fact_ids) > 0),
  PRIMARY KEY (run_id, position), UNIQUE (run_id, career_id),
  FOREIGN KEY (user_id, run_id) REFERENCES asgard_private.recommendation_runs(user_id, id)
    ON DELETE CASCADE,
  FOREIGN KEY (career_id, roadmap_id) REFERENCES asgard_catalog.roadmaps(career_id, id),
  FOREIGN KEY (roadmap_id, starting_topic_id) REFERENCES asgard_catalog.topics(roadmap_id, id),
  CHECK (starting_topic_id IS NULL OR roadmap_id IS NOT NULL)
);
CREATE INDEX recommendation_items_owner ON asgard_private.recommendation_items(user_id);
CREATE INDEX recommendation_items_career ON asgard_private.recommendation_items(career_id);
-- Reservation rows count actual provider attempts, including the single permitted retry.
-- The future quota service must serialize reservations and enforce policy before any call.
CREATE TABLE asgard_private.analysis_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES asgard_private.learning_state ON DELETE CASCADE,
  recommendation_run_id uuid,
  operation text NOT NULL CHECK (operation IN ('recommendation', 'pdf_analysis')),
  attempt integer NOT NULL CHECK (attempt BETWEEN 1 AND 2),
  reservation_key uuid NOT NULL UNIQUE,
  reserved_at timestamptz NOT NULL DEFAULT statement_timestamp(),
  FOREIGN KEY (user_id, recommendation_run_id)
    REFERENCES asgard_private.recommendation_runs(user_id, id) ON DELETE CASCADE,
  CHECK ((operation = 'recommendation') = (recommendation_run_id IS NOT NULL)),
  UNIQUE (recommendation_run_id, attempt)
);
CREATE INDEX attempts_owner_time ON asgard_private.analysis_attempts(user_id, reserved_at);
CREATE INDEX attempts_global_time ON asgard_private.analysis_attempts(reserved_at);
-- Anonymous aggregate only: permits a future atomic global-budget reservation without
-- granting one user's transaction access to another user's attempt records.
CREATE TABLE asgard_private.analysis_daily_budget (
  utc_date date PRIMARY KEY,
  reserved_attempts integer NOT NULL DEFAULT 0 CHECK (reserved_attempts >= 0)
);
REVOKE ALL ON asgard_private.analysis_daily_budget FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON asgard_private.analysis_daily_budget TO asgard_app;
ALTER TABLE asgard_private.analysis_daily_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE asgard_private.analysis_daily_budget FORCE ROW LEVEL SECURITY;
CREATE POLICY backend_budget ON asgard_private.analysis_daily_budget FOR ALL TO asgard_app
  USING (true) WITH CHECK (true);

-- Serialize focus, branch and topic mutations on the same per-account row.
-- The function is invoker-rights; it neither bypasses RLS nor accepts a browser identity.
CREATE FUNCTION asgard_private.guard_learning_change() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE target_user uuid; target_topic asgard_catalog.topics; active_topic asgard_catalog.topics;
BEGIN
  target_user := CASE WHEN TG_OP = 'DELETE' THEN OLD.user_id ELSE NEW.user_id END;
  PERFORM 1 FROM asgard_private.learning_state WHERE user_id = target_user FOR UPDATE;
  IF TG_TABLE_NAME = 'learning_state' THEN
    IF NEW.current_roadmap_id IS DISTINCT FROM OLD.current_roadmap_id THEN
      IF EXISTS (SELECT 1 FROM asgard_private.topic_progress
          WHERE user_id = target_user AND status = 'learning') THEN
        RAISE EXCEPTION 'Resolve the Learning topic before changing focus' USING ERRCODE = '23514';
      END IF;
      IF NEW.current_roadmap_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM asgard_catalog.roadmaps
        WHERE id = NEW.current_roadmap_id AND status = 'published'
      ) THEN RAISE EXCEPTION 'Focus requires a published roadmap' USING ERRCODE = '23514'; END IF;
      NEW.context_revision := OLD.context_revision + 1;
    END IF;
    RETURN NEW;
  ELSIF TG_TABLE_NAME = 'topic_progress' THEN
    SELECT * INTO target_topic FROM asgard_catalog.topics
      WHERE roadmap_id = NEW.roadmap_id AND id = NEW.topic_id;
    IF TG_OP = 'UPDATE' AND (NEW.user_id, NEW.roadmap_id, NEW.topic_id)
      IS DISTINCT FROM (OLD.user_id, OLD.roadmap_id, OLD.topic_id) THEN
      RAISE EXCEPTION 'Progress identities are immutable' USING ERRCODE = '23514';
    END IF;
    IF target_topic.retired_at IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.status <> 'learning') THEN
      RAISE EXCEPTION 'Retired topic history is read only' USING ERRCODE = '23514';
    END IF;
    IF NEW.status = 'learning' THEN
      IF target_topic.retired_at IS NOT NULL OR NOT EXISTS (
        SELECT 1 FROM asgard_catalog.roadmaps WHERE id = NEW.roadmap_id AND status = 'published'
      ) THEN RAISE EXCEPTION 'Cannot start an unavailable topic' USING ERRCODE = '23514'; END IF;
      IF target_topic.branch_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM asgard_private.branch_choices
        WHERE user_id = target_user AND branch_id = target_topic.branch_id
      ) THEN RAISE EXCEPTION 'Choose the topic branch explicitly' USING ERRCODE = '23514'; END IF;
    END IF;
  ELSE
    IF TG_OP = 'UPDATE' AND (NEW.user_id, NEW.roadmap_id, NEW.group_id)
      IS DISTINCT FROM (OLD.user_id, OLD.roadmap_id, OLD.group_id) THEN
      RAISE EXCEPTION 'Branch choice identities are immutable' USING ERRCODE = '23514';
    END IF;
    SELECT t.* INTO active_topic FROM asgard_private.topic_progress p
      JOIN asgard_catalog.topics t ON t.id = p.topic_id
      JOIN asgard_catalog.branches b ON b.id = t.branch_id
      WHERE p.user_id = target_user AND p.status = 'learning'
        AND b.group_id = CASE WHEN TG_OP = 'DELETE' THEN OLD.group_id ELSE NEW.group_id END;
    IF active_topic.id IS NOT NULL AND
      (TG_OP = 'DELETE' OR active_topic.branch_id IS DISTINCT FROM NEW.branch_id) THEN
      RAISE EXCEPTION 'Resolve the Learning topic before changing branch' USING ERRCODE = '23514';
    END IF;
  END IF;
  UPDATE asgard_private.learning_state SET context_revision = context_revision + 1,
    version = version + 1, updated_at = statement_timestamp() WHERE user_id = target_user;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER focus_guard BEFORE UPDATE ON asgard_private.learning_state
  FOR EACH ROW EXECUTE FUNCTION asgard_private.guard_learning_change();
CREATE TRIGGER progress_guard BEFORE INSERT OR UPDATE ON asgard_private.topic_progress
  FOR EACH ROW EXECUTE FUNCTION asgard_private.guard_learning_change();
CREATE TRIGGER branch_guard BEFORE INSERT OR UPDATE OR DELETE ON asgard_private.branch_choices
  FOR EACH ROW EXECUTE FUNCTION asgard_private.guard_learning_change();

CREATE FUNCTION asgard_private.guard_discovery_change() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE state text;
BEGIN
  IF TG_TABLE_NAME = 'discovery_sessions' THEN
    IF OLD.status = 'completed' THEN
      RAISE EXCEPTION 'Completed Discovery is immutable; create a retake draft' USING ERRCODE = '23514';
    END IF;
    IF NEW.status = 'completed' THEN
      UPDATE asgard_private.learning_state SET context_revision = context_revision + 1,
        version = version + 1, updated_at = statement_timestamp() WHERE user_id = NEW.user_id;
    END IF;
  ELSE
    SELECT status INTO state FROM asgard_private.discovery_sessions
      WHERE id = NEW.session_id AND user_id = NEW.user_id FOR UPDATE;
    IF state IS DISTINCT FROM 'draft' THEN
      RAISE EXCEPTION 'Only draft answers may change' USING ERRCODE = '23514';
    END IF;
    IF TG_OP = 'UPDATE' AND (NEW.user_id, NEW.session_id, NEW.questionnaire_id, NEW.question_id)
      IS DISTINCT FROM (OLD.user_id, OLD.session_id, OLD.questionnaire_id, OLD.question_id) THEN
      RAISE EXCEPTION 'Answer identities are immutable' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER discovery_session_guard BEFORE UPDATE ON asgard_private.discovery_sessions
  FOR EACH ROW EXECUTE FUNCTION asgard_private.guard_discovery_change();
CREATE TRIGGER discovery_answer_guard BEFORE INSERT OR UPDATE ON asgard_private.discovery_answers
  FOR EACH ROW EXECUTE FUNCTION asgard_private.guard_discovery_change();

CREATE FUNCTION asgard_private.guard_recommendation_change() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE run asgard_private.recommendation_runs;
BEGIN
  IF TG_TABLE_NAME = 'recommendation_runs' THEN
    IF TG_OP = 'UPDATE' THEN
      IF OLD.status <> 'pending' OR
        (NEW.user_id, NEW.id, NEW.context_revision, NEW.catalog_release_id, NEW.prompt_version,
         NEW.schema_version, NEW.idempotency_key, NEW.context_snapshot,
         NEW.discovery_session_id, NEW.discovery_revision, NEW.created_at, NEW.deadline_at)
        IS DISTINCT FROM
        (OLD.user_id, OLD.id, OLD.context_revision, OLD.catalog_release_id, OLD.prompt_version,
         OLD.schema_version, OLD.idempotency_key, OLD.context_snapshot,
         OLD.discovery_session_id, OLD.discovery_revision, OLD.created_at, OLD.deadline_at) THEN
        RAISE EXCEPTION 'Recommendation provenance is immutable' USING ERRCODE = '23514';
      END IF;
    ELSIF NEW.status <> 'pending' THEN
      RAISE EXCEPTION 'A run starts pending' USING ERRCODE = '23514';
    END IF;
    IF NEW.discovery_session_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM asgard_private.discovery_sessions WHERE id = NEW.discovery_session_id
        AND user_id = NEW.user_id AND status = 'completed' AND revision = NEW.discovery_revision
    ) THEN RAISE EXCEPTION 'Recommendations require completed Discovery' USING ERRCODE = '23514'; END IF;
    IF NEW.status = 'completed' THEN
      PERFORM 1 FROM asgard_private.learning_state WHERE user_id = NEW.user_id
        AND context_revision = NEW.context_revision FOR UPDATE;
      IF NOT FOUND OR statement_timestamp() > NEW.deadline_at OR
        NOT EXISTS (SELECT 1 FROM asgard_private.recommendation_items WHERE run_id = NEW.id) THEN
        RAISE EXCEPTION 'Cannot complete stale, expired or empty recommendations' USING ERRCODE = '23514';
      END IF;
    END IF;
  ELSE
    SELECT * INTO run FROM asgard_private.recommendation_runs
      WHERE id = NEW.run_id AND user_id = NEW.user_id FOR UPDATE;
    IF run.status IS DISTINCT FROM 'pending' THEN
      RAISE EXCEPTION 'Only pending runs accept results' USING ERRCODE = '23514';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM asgard_catalog.careers WHERE id = NEW.career_id AND status = 'published')
      OR (NEW.roadmap_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM asgard_catalog.roadmaps WHERE id = NEW.roadmap_id AND status = 'published'))
      OR (NEW.starting_topic_id IS NOT NULL AND NOT EXISTS (
        SELECT 1 FROM asgard_catalog.topics WHERE id = NEW.starting_topic_id AND retired_at IS NULL)) THEN
      RAISE EXCEPTION 'Results require published catalog references' USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER recommendation_guard BEFORE INSERT OR UPDATE ON asgard_private.recommendation_runs
  FOR EACH ROW EXECUTE FUNCTION asgard_private.guard_recommendation_change();
CREATE TRIGGER recommendation_item_guard BEFORE INSERT ON asgard_private.recommendation_items
  FOR EACH ROW EXECUTE FUNCTION asgard_private.guard_recommendation_change();

-- Private schemas stay outside PostgREST. Only the restricted backend role gets access.
DO $$
DECLARE name text; predicate text;
BEGIN
  FOREACH name IN ARRAY ARRAY['learning_state', 'preferences', 'discovery_sessions',
    'discovery_answers', 'branch_choices', 'topic_progress', 'progress_events',
    'completion_activity', 'recommendation_runs', 'recommendation_items', 'analysis_attempts']
  LOOP
    EXECUTE format('REVOKE ALL ON asgard_private.%I FROM PUBLIC, anon, authenticated', name);
    EXECUTE format('ALTER TABLE asgard_private.%I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('ALTER TABLE asgard_private.%I FORCE ROW LEVEL SECURITY', name);
    EXECUTE format('GRANT SELECT, INSERT ON asgard_private.%I TO asgard_app', name);
    predicate := 'user_id = nullif(current_setting(''asgard.user_id'', true), '''')::uuid';
    EXECUTE format('CREATE POLICY owner_access ON asgard_private.%I FOR ALL TO asgard_app '
      'USING (%s) WITH CHECK (%s)', name, predicate, predicate);
  END LOOP;
  FOREACH name IN ARRAY ARRAY['learning_state', 'preferences', 'discovery_sessions',
    'discovery_answers', 'branch_choices', 'topic_progress', 'recommendation_runs']
  LOOP
    EXECUTE format('GRANT UPDATE ON asgard_private.%I TO asgard_app', name);
  END LOOP;
  GRANT DELETE ON asgard_private.branch_choices, asgard_private.completion_activity TO asgard_app;
  FOREACH name IN ARRAY ARRAY['releases', 'categories', 'careers', 'roadmaps', 'milestones',
    'branch_groups', 'branches', 'topics', 'topic_prerequisites', 'resources',
    'questionnaires', 'questions']
  LOOP
    EXECUTE format('REVOKE ALL ON asgard_catalog.%I FROM PUBLIC, anon, authenticated', name);
    EXECUTE format('GRANT SELECT ON asgard_catalog.%I TO asgard_app', name);
    EXECUTE format('ALTER TABLE asgard_catalog.%I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('ALTER TABLE asgard_catalog.%I FORCE ROW LEVEL SECURITY', name);
    predicate := CASE
      WHEN name IN ('careers', 'roadmaps') THEN 'status IN (''published'', ''retired'')'
      WHEN name IN ('milestones', 'branch_groups', 'branches', 'topics', 'topic_prerequisites')
        THEN format('EXISTS (SELECT 1 FROM asgard_catalog.roadmaps r WHERE r.id = %I.roadmap_id)', name)
      WHEN name = 'resources' THEN 'EXISTS (SELECT 1 FROM asgard_catalog.topics t WHERE t.id = resources.topic_id)'
      WHEN name = 'questionnaires' THEN 'published_at IS NOT NULL'
      WHEN name = 'questions' THEN 'EXISTS (SELECT 1 FROM asgard_catalog.questionnaires q WHERE q.id = questions.questionnaire_id)'
      ELSE 'true' END;
    EXECUTE format('CREATE POLICY catalog_read ON asgard_catalog.%I FOR SELECT TO asgard_app USING (%s)', name, predicate);
  END LOOP;
END $$;
REVOKE ALL ON FUNCTION asgard_private.guard_learning_change(),
  asgard_private.guard_discovery_change(), asgard_private.guard_recommendation_change()
  FROM PUBLIC, anon, authenticated;
