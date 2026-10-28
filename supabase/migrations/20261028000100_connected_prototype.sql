-- Owner-approved connected prototype: distinguish catalog gaps from provider failures.
ALTER TABLE asgard_private.recommendation_runs
  DROP CONSTRAINT recommendation_runs_failure_code_check;
ALTER TABLE asgard_private.recommendation_runs
  ADD CONSTRAINT recommendation_runs_failure_code_check CHECK (failure_code IN (
    'timeout', 'quota_exceeded', 'provider_unavailable', 'invalid_output',
    'context_outdated', 'no_eligible_context', 'no_supported_careers'
  ));
