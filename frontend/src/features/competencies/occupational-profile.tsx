import { useId, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

const classifications: Record<string, string> = {
  core_function: "Core occupational function",
  supporting_competency: "Supporting competency",
  technology_example: "Technology example",
  source_context: "Source context",
};
const reviews: Record<string, string> = {
  agent_supported: "Agent review only",
  retained_context: "Reference context",
  disputed: "Disputed observation",
  excluded: "Excluded from suggestion inputs",
};

export function OccupationalProfile({ careerId }: { careerId: string }) {
  const roleId = useId();
  const [page, setPage] = useState<{
    offset: number;
    role?: string;
    release?: string;
  }>({ offset: 0 });
  const query = useCoreQuery(["career-evidence", careerId, page], (signal) =>
    coreApi.careerEvidence(
      careerId,
      {
        offset: page.offset,
        limit: 20,
        source_role: page.role,
        expected_release_id: page.release,
      },
      signal,
    ),
  );
  const data = query.data;
  if (query.isPending)
    return <p role="status">Loading occupational references…</p>;
  if (query.error)
    return (
      <div role="alert">
        <p>{query.error.message}</p>
        <Button
          variant="outline"
          onClick={() => {
            if (page.offset || page.release || page.role)
              setPage({ offset: 0 });
            else void query.refetch();
          }}
        >
          Reload references
        </Button>
      </div>
    );
  if (!data?.release_id)
    return (
      <p>
        Occupational references are not active. Your personal skill comparison
        remains available.
      </p>
    );
  const move = (offset: number) =>
    setPage({ ...page, offset, release: data.release_id! });
  return (
    <section className="space-y-4" aria-label="Occupational references">
      <p>
        These are source occupational observations, separate from your personal
        ratings. They are not assessed ability or mandatory career requirements.
      </p>
      <p className="text-sm">{data.review_status}</p>
      <label className="block" htmlFor={roleId}>
        Source role
      </label>
      <select
        id={roleId}
        className="block w-full rounded-md border p-2"
        value={page.role ?? ""}
        onChange={(event) =>
          setPage({
            offset: 0,
            role: event.target.value || undefined,
            release: data.release_id!,
          })
        }
      >
        <option value="">All source roles</option>
        {data.roles.map((role) => (
          <option key={role.occupation_id} value={role.occupation_id}>
            {role.title} · {role.career_level}
          </option>
        ))}
      </select>
      <p role="status">
        {data.total
          ? `${page.offset + 1}–${Math.min(page.offset + data.items.length, data.total)} of ${data.total} source records`
          : "No source records in this view."}
      </p>
      {data.roles.map((role) => {
        const records = data.items.filter(
          (item) => item.occupation_id === role.occupation_id,
        );
        if (!records.length) return null;
        return (
          <section key={role.occupation_id} className="space-y-3 break-words">
            <h3 className="font-semibold">{role.title}</h3>
            <p>
              {role.source_title} · {role.source_version} · {role.native_code}
            </p>
            <p>
              Relationship: {role.relationship}. Source level:{" "}
              {role.career_level}.
            </p>
            {!role.source_level_verified && (
              <p className="text-sm">
                Source-level interpretation has not been independently verified.
              </p>
            )}
            {role.description && <p>{role.description}</p>}
            <ul className="space-y-4">
              {records.map((item) => (
                <li key={item.record_id}>
                  <h4 className="font-semibold">{item.label}</h4>
                  <p>{item.definition}</p>
                  {item.native_level !== null && item.native_level !== "" && (
                    <p>
                      Occupational observation: {item.native_level} ·{" "}
                      {item.scale_meaning ??
                        item.native_scale ??
                        "Scale not recorded"}
                    </p>
                  )}
                  {item.observation_date && (
                    <p className="text-sm">
                      Observation date: {item.observation_date}
                    </p>
                  )}
                  <p className="text-sm">
                    {classifications[item.classification] ?? "Source record"} ·{" "}
                    {reviews[item.decision] ?? "Review pending"}.{" "}
                    {item.rationale}
                  </p>
                  <p className="text-sm">Source locator: {item.locator}</p>
                  {item.scale_locator && (
                    <p className="text-sm">
                      Scale locator: {item.scale_locator}
                    </p>
                  )}
                  {item.topics?.length ? (
                    <ul>
                      {item.topics.map((topic) => (
                        <li key={topic.topic_id}>
                          <Link
                            className="underline"
                            to={
                              appRoutes.roadmap(careerId) +
                              `?${new URLSearchParams({ roadmap: topic.roadmap_id, topic: topic.topic_id })}`
                            }
                          >
                            {topic.title}
                          </Link>
                          <span> · Partial learning coverage</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">
                      No learning association is recorded here. This does not
                      establish a required learning gap.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          disabled={!page.offset}
          onClick={() => move(Math.max(0, page.offset - 20))}
        >
          Previous references
        </Button>
        <Button
          variant="outline"
          disabled={page.offset + data.items.length >= data.total}
          onClick={() => move(page.offset + 20)}
        >
          Next references
        </Button>
      </div>
      <details>
        <summary>Coverage and review limitations</summary>
        <ul>
          {data.limitations.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <p className="text-sm break-all">
          Reference release: {data.release_id}
        </p>
      </details>
    </section>
  );
}
