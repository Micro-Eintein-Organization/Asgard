from contextvars import ContextVar
from time import perf_counter

from sqlalchemy import event

current_metrics = ContextVar("database_metrics", default=None)


def instrument(engine):
    @event.listens_for(engine.sync_engine, "before_cursor_execute")
    def before(_conn, _cursor, _statement, _parameters, context, _many):
        context.asgard_started = perf_counter()

    @event.listens_for(engine.sync_engine, "after_cursor_execute")
    def after(_conn, _cursor, _statement, _parameters, context, _many):
        metrics = current_metrics.get()
        if metrics is not None:
            metrics["database_query_count"] += 1
            metrics["database_execution_ms"] += (perf_counter() - context.asgard_started) * 1000
