-- Disposable PostgreSQL fixture only: exercise the real existing mutation and
-- new wrapper. Session admission is a fixture; provider lifecycle is not tested.
CREATE ROLE anon;
CREATE ROLE authenticated;
CREATE ROLE asgard_app;
CREATE SCHEMA asgard_private;
CREATE SCHEMA asgard_catalog;
GRANT USAGE ON SCHEMA asgard_private,asgard_catalog TO asgard_app;
CREATE TABLE asgard_private.user_competencies (
 user_id uuid,competency_id uuid,label text,level integer,updated_at timestamptz DEFAULT now(),
 PRIMARY KEY(user_id,competency_id));
CREATE TABLE asgard_private.competency_state(user_id uuid PRIMARY KEY,version integer);
CREATE TABLE asgard_private.learning_state(user_id uuid PRIMARY KEY,context_revision integer DEFAULT 0);
CREATE TABLE asgard_catalog.competencies(id uuid PRIMARY KEY,label text,published boolean);
CREATE TABLE asgard_private.analysis_attempts(operation text CONSTRAINT analysis_attempts_operation_check
 CHECK(operation IN ('recommendation','pdf_analysis','comparison_insight','counselor_turn')));
CREATE TABLE asgard_private.recommendation_runs(id uuid,user_id uuid,payload_erased_at timestamptz);
CREATE TABLE asgard_private.recommendation_skill_inputs(user_id uuid,run_id uuid,competency_id uuid);
CREATE FUNCTION asgard_private.session_allowed(subject uuid,session_id uuid,assurance text)
 RETURNS boolean LANGUAGE sql AS $$ SELECT session_id=subject AND assurance='aal1' $$;
INSERT INTO asgard_catalog.competencies VALUES
 ('00000000-0000-0000-0000-000000000011','SQL',true),
 ('00000000-0000-0000-0000-000000000012','Python',true);
REVOKE ALL ON asgard_private.user_competencies,asgard_private.competency_state FROM asgard_app;
