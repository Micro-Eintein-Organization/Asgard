import { useQuery } from "@tanstack/react-query";
import { getHealth, getReadiness } from "../api/client";

export function FoundationStatus() {
  const health = useQuery({
    queryKey: ["operations", "health"],
    queryFn: getHealth,
  });
  const readiness = useQuery({
    queryKey: ["operations", "ready"],
    queryFn: getReadiness,
  });

  return (
    <section>
      <h1>Asgard foundation</h1>
      <p>
        Technical connectivity check. Account access and product services are
        not connected.
      </p>
      <section aria-label="Service connectivity" aria-live="polite">
        <p>
          Backend:{" "}
          {health.isPending
            ? "Checking…"
            : health.isError
              ? "Unavailable"
              : "Connected"}
        </p>
        <p>
          Supabase API:{" "}
          {readiness.isPending
            ? "Checking…"
            : readiness.isError
              ? "Unavailable"
              : "Ready"}
        </p>
      </section>
      <button
        type="button"
        disabled={health.isFetching || readiness.isFetching}
        onClick={() => {
          void health.refetch();
          void readiness.refetch();
        }}
      >
        Check connectivity
      </button>
    </section>
  );
}
