import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { useRecommendationFlow } from "./use-recommendation-flow";

export function RecommendationCards({
  flow,
}: {
  flow: ReturnType<typeof useRecommendationFlow>;
}) {
  const [selection, setSelection] = useState<{
    run: string;
    career: string;
  } | null>(null);
  const catalog = useCoreQuery(["recommendation-careers"], () =>
    coreApi.catalog({ limit: 100 }),
  );
  const state = flow.query.data;
  const current = state?.current;
  const displayed =
    current?.status === "completed"
      ? current
      : state?.previous_eligible_success;
  const error = flow.query.error ?? catalog.error;
  if (error)
    return (
      <StatePanel
        kind="error"
        title="Suggestions unavailable"
        action={
          <button
            onClick={() => {
              void flow.query.refetch();
              void catalog.refetch();
            }}
          >
            Try again
          </button>
        }
      >
        {error.message}
      </StatePanel>
    );
  if (!state || !catalog.data)
    return (
      <StatePanel kind="loading" title="Loading saved suggestions">
        Reading your account's saved results.
      </StatePanel>
    );
  const careers = catalog.data.items;
  const gap =
    current?.failure_code === "no_supported_careers" && !current.outdated;
  const messages = {
    timeout: "Preparing suggestions took too long. Your answers are saved.",
    quota_exceeded:
      "The AI allowance was reached. Your answers and learning saves remain available.",
    provider_unavailable:
      "Groq is unavailable. Your answers are saved; try again later or browse careers.",
    invalid_output:
      "The returned suggestions could not be validated. Your answers are saved.",
    context_outdated:
      "Your saved context changed while suggestions were being prepared. Update suggestions when ready.",
    no_eligible_context:
      "Complete Discovery or choose a learning roadmap to provide context.",
    no_supported_careers:
      "Your answers are saved, but this small catalog does not contain a supported suggestion for them.",
  };
  return (
    <div className="space-y-6">
      {!state.available && (
        <p
          role="status"
          className="border rounded-2xl p-4 text-sm text-gray-600"
        >
          {state.unavailable_reason}
        </p>
      )}
      {flow.pending && (
        <p role="status" className="text-center py-8 text-sm">
          Preparing career suggestions. Your Discovery answers are already
          saved.
        </p>
      )}
      {current?.status === "failed" && !flow.error && !flow.pending && (
        <div role="status" className="border rounded-2xl p-5 space-y-3 text-sm">
          <p>{messages[current.failure_code!]}</p>
          {gap && (
            <p>
              Browse the available careers or return later as the catalog grows.
              No career has been assigned to you.
            </p>
          )}
        </div>
      )}
      {flow.error && (
        <p role="alert" className="field-error">
          {flow.error.message}{" "}
          <button disabled={flow.pending} onClick={() => void flow.reload()}>
            Reload saved state
          </button>
        </p>
      )}
      {displayed && (
        <>
          <p className="text-center text-xs text-gray-500">
            {displayed !== current
              ? "Previous saved suggestions"
              : displayed.outdated
                ? "Saved suggestions — your context or catalog has changed"
                : "Saved suggestions"}{" "}
            ·{" "}
            {new Date(
              displayed.finished_at ?? displayed.created_at,
            ).toLocaleString()}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayed.items.map((item) => {
              const career = careers.find(
                (entry) => entry.id === item.career_id,
              );
              if (!career)
                return (
                  <div
                    key={item.career_id}
                    className="border rounded-2xl p-6 text-sm"
                  >
                    This suggested career is unavailable.{" "}
                    <Link to={appRoutes.careers}>Browse careers</Link>
                  </div>
                );
              return (
                <article
                  key={item.career_id}
                  className={
                    "rounded-2xl p-6 space-y-4 bg-white border-2 " +
                    (selection?.run === displayed.id &&
                    selection.career === career.id
                      ? "border-emerald-500"
                      : "border-gray-200")
                  }
                >
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="suggested-career"
                      checked={
                        selection?.run === displayed.id &&
                        selection.career === career.id
                      }
                      onChange={() =>
                        setSelection({ run: displayed.id, career: career.id })
                      }
                      className="accent-emerald-600"
                    />
                    <span className="font-bold text-lg">{career.title}</span>
                  </label>
                  <p className="text-xs text-gray-500">{career.description}</p>
                  <details className="group space-y-2 text-sm">
                    <summary className="cursor-pointer font-semibold">
                      <span className="group-open:hidden">Read more</span>
                      <span className="hidden group-open:inline">Read less</span>
                    </summary>
                    <h4 className="text-xs font-bold">
                      Why this was suggested
                    </h4>
                    <p className="text-sm">{item.reason}</p>
                    {!!displayed?.evidence?.length && (
                      <details className="text-xs">
                        <summary>Evidence used</summary>
                        <ul className="mt-2 space-y-1">
                          {displayed.evidence
                            .filter((fact) =>
                              item.evidence_fact_ids.includes(fact.id),
                            )
                            .map((fact) => (
                              <li key={fact.id}>{fact.description}</li>
                            ))}
                        </ul>
                      </details>
                    )}
                    {item.uncertainty_note && (
                      <p className="text-xs text-gray-500">
                        {item.uncertainty_note}
                      </p>
                    )}
                  </details>
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <h4 className="text-xs font-bold">
                      Skills used in this career
                    </h4>
                    <ul className="flex flex-wrap gap-1">
                      {career.skills.map((skill) => (
                        <li
                          key={skill}
                          className="text-xs border border-gray-200 px-2 py-0.5 rounded-full text-gray-600"
                        >
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
          {(() => {
            const item = displayed.items.find(
              (entry) =>
                selection?.run === displayed.id &&
                entry.career_id === selection.career,
            );
            return (
              <div className="text-center">
                <Button asChild={!!item} disabled={!item}>
                  {item ? (
                    <Link
                      to={
                        appRoutes.roadmap(item.career_id) +
                        (item.roadmap_id ? "?roadmap=" + item.roadmap_id : "")
                      }
                    >
                      View selected roadmap
                    </Link>
                  ) : (
                    "View selected roadmap"
                  )}
                </Button>
              </div>
            );
          })()}
        </>
      )}
      {!displayed && !flow.pending && !current && (
        <p className="text-center text-sm text-gray-500">
          No suggestions have been generated yet. You can explore every career
          in the catalog.
        </p>
      )}
      <div className="action-row justify-center">
        {state.available &&
          !gap &&
          (!displayed ||
            !!current?.outdated ||
            current?.status === "failed") && (
            <Button
              disabled={flow.pending || !!flow.cooldown}
              onClick={() => {
                if (current?.status === "failed" && !current.outdated)
                  void flow.retryFailed();
                else void flow.request();
              }}
            >
              {flow.pending
                ? "Preparing…"
                : flow.cooldown
                  ? "Try again in " + flow.cooldown + "s"
                  : current?.outdated
                    ? "Update suggestions"
                    : current?.status === "failed"
                      ? "Try again"
                      : "Prepare suggestions"}
            </Button>
          )}
      </div>
      <p className="text-center text-xs text-gray-500">
        Only three starter careers are published. Suggestions do not assess
        proficiency, guarantee suitability, or change your learning focus.
      </p>
      <p className="text-center text-xs text-gray-500">
        Preparing suggestions sends your active Discovery choices and relevant
        saved learning context and validated document background to Groq. Names,
        contact details and inactive answers are excluded.
      </p>
    </div>
  );
}
