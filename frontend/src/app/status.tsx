import { useQuery } from "@tanstack/react-query";
import { Check, RefreshCw, TriangleAlert } from "lucide-react";
import { getHealth, getReadiness } from "../api/client";
import { BackLink, PageHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function FoundationStatus() {
  const health = useQuery({
    queryKey: ["operations", "health"],
    queryFn: getHealth,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const readiness = useQuery({
    queryKey: ["operations", "ready"],
    queryFn: getReadiness,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const checking = health.isFetching || readiness.isFetching;
  const backendUp = !health.isError && health.data?.status === "ok";
  const dataUp =
    !readiness.isError &&
    readiness.data?.status === "ready" &&
    readiness.data.supabase_api === "available";
  const up = backendUp && dataUp;
  const title = checking
    ? "Checking services"
    : up
      ? "Service is up"
      : backendUp || dataUp
        ? "Some services are unavailable"
        : "Unable to reach services";
  const checkedAt = Math.max(
    health.dataUpdatedAt,
    health.errorUpdatedAt,
    readiness.dataUpdatedAt,
    readiness.errorUpdatedAt,
  );
  const rows = [
    {
      name: "Application API",
      description: "Responds to application requests.",
      ready: backendUp,
      fetching: health.isFetching,
    },
    {
      name: "Data service",
      description: "Checks connectivity to the Supabase API.",
      ready: dataUp,
      fetching: readiness.isFetching,
    },
  ];

  return (
    <section className="information-page service-status-page">
      <BackLink to={routes.home}>Back to Asgard</BackLink>
      <PageHeading
        title="Service status"
        description="A quick look at Asgard’s availability."
      />
      <div
        className={`service-summary ${checking ? "is-checking" : up ? "is-up" : "is-unavailable"}`}
        role="status"
      >
        <span className="service-summary-icon" aria-hidden="true">
          {checking ? (
            <RefreshCw size={24} />
          ) : up ? (
            <Check size={24} />
          ) : (
            <TriangleAlert size={24} />
          )}
        </span>
        <div>
          <h2>{title}</h2>
          <p>
            {checking
              ? "Checking the application and data services…"
              : up
                ? "Both connectivity checks passed. You can continue exploring."
                : "Some features may not load or save. Wait a moment, then check again."}
          </p>
        </div>
      </div>
      <dl
        className="service-components"
        aria-label="Service checks"
        aria-live="polite"
      >
        {rows.map((row) => (
          <div className="service-component" key={row.name}>
            <dt>
              {row.name}
              <span>{row.description}</span>
            </dt>
            <dd
              className={
                row.fetching ? "" : row.ready ? "service-up" : "service-down"
              }
            >
              <span className="service-dot" aria-hidden="true" />
              {row.fetching
                ? "Checking…"
                : row.ready
                  ? "Operational"
                  : "Unavailable"}
            </dd>
          </div>
        ))}
      </dl>
      <div className="service-refresh">
        <p>
          {checking ? (
            "Check in progress"
          ) : checkedAt ? (
            <>
              Last checked{" "}
              <time dateTime={new Date(checkedAt).toISOString()}>
                {new Date(checkedAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </time>{" "}
              · your local time
            </>
          ) : (
            "No completed check yet"
          )}
        </p>
        <Button
          variant="outline"
          disabled={checking}
          onClick={() => {
            void health.refetch();
            void readiness.refetch();
          }}
        >
          <RefreshCw size={16} aria-hidden="true" />
          {checking ? "Checking…" : "Check again"}
        </Button>
      </div>
      <section className="service-context">
        <h2>Taking a little longer?</h2>
        <p>
          The demo service may need about a minute to start after inactivity. If
          a check fails, wait a moment and try again. Avoid retrying a save
          until you know whether it completed.
        </p>
        <p className="information-note">
          These are live connectivity checks, not historical uptime
          measurements. They do not verify sign-in, email delivery, AI responses
          or every feature.
        </p>
      </section>
    </section>
  );
}
