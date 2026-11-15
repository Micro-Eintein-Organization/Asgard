import logging
import re
from contextvars import ContextVar
from hashlib import sha256
from time import perf_counter

from sqlalchemy import event

current_metrics = ContextVar("database_metrics", default=None)


def instrument(engine):
    @event.listens_for(engine.sync_engine, "do_connect")
    def connecting(_dialect, record, _args, _kwargs):
        record.info["asgard_connect_started"] = perf_counter()

    @event.listens_for(engine.sync_engine, "connect")
    def connected(_connection, record):
        started = record.info.pop("asgard_connect_started", None)
        metrics = current_metrics.get()
        if started is not None and metrics is not None:
            metrics["database_connect_ms"] = metrics.get("database_connect_ms", 0) + (perf_counter()-started)*1000

    def finish(context, failed=False):
        metrics = current_metrics.get()
        if metrics is None or not hasattr(context, "asgard_started"):
            return
        elapsed = (perf_counter() - context.asgard_started) * 1000
        phase, fingerprint = context.asgard_query
        metrics["database_query_count"] += 1
        metrics["database_execution_ms"] += elapsed
        key = f"database_{phase}_ms"
        metrics[key] = metrics.get(key, 0) + elapsed
        if failed:
            metrics["database_failed_count"] = metrics.get("database_failed_count", 0) + 1
        counts = context.root_connection.info.setdefault("asgard_statement_counts", {})
        counts[fingerprint] = counts.get(fingerprint, 0) + 1
        logging.getLogger("asgard.database").info("database_statement", extra={"fields": {
            "phase": phase, "fingerprint": fingerprint, "occurrence": counts[fingerprint],
            "duration_ms": round(elapsed, 2), "failed": failed,
        }})

    @event.listens_for(engine.sync_engine, "before_cursor_execute")
    def before(conn, _cursor, statement, _parameters, context, _many):
        context.asgard_started = perf_counter()
        normalized = re.sub(r"\s+", " ", statement).strip()
        context.asgard_query = (conn.info.get("asgard_query_phase", "feature"),
                                sha256(normalized.encode()).hexdigest()[:16])

    @event.listens_for(engine.sync_engine, "after_cursor_execute")
    def after(_conn, _cursor, _statement, _parameters, context, _many):
        finish(context)

    @event.listens_for(engine.sync_engine, "handle_error")
    def failed(context):
        if context.execution_context is not None:
            finish(context.execution_context, True)
