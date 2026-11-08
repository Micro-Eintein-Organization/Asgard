ALTER TABLE asgard_private.analysis_attempts
    DROP CONSTRAINT analysis_attempts_operation_check,
    ADD CONSTRAINT analysis_attempts_operation_check
        CHECK (operation IN ('recommendation', 'pdf_analysis', 'comparison_insight', 'counselor_turn'));
