import { CounselorLauncher } from "@/features/ai-guidance";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { careerSummary } from "@/lib/career-summary";
import { useRecommendationFlow } from "./use-recommendation-flow";

export function RecommendationCards({
  flow,
  allowInitialRequest = true,
}: {
  flow: ReturnType<typeof useRecommendationFlow>;
  allowInitialRequest?: boolean;
}) {
  const catalog = useCoreQuery(["recommendation-careers"], () =>
    coreApi.catalog({ limit: 100 }),
  );
  const categories = useCoreQuery(
    ["recommendation-categories"],
    coreApi.categories,
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
      "Suggestions are temporarily unavailable. Your answers are saved.",
    invalid_output:
      "We couldn’t prepare suggestions. Your answers are saved.",
    context_outdated:
      "Your saved context changed while suggestions were being prepared. Update suggestions when ready.",
    no_eligible_context:
      "Record skills, complete Discovery or choose a learning roadmap to provide context.",
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
          Preparing your career suggestions…
        </p>
      )}
      {current?.status === "failed" && !flow.pending && (
        <div role="status" className="border rounded-2xl p-5 space-y-3 text-sm">
          <p>
            {current.payload_erased_at
              ? "Affected suggestions were erased after a skill correction or removal. Update suggestions to use your current saved context."
              : messages[current.failure_code!]}
          </p>
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
      {displayed && <CounselorLauncher />}
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
          <div className="career-grid results-grid mt-6">
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
                  className="career-card recommendation-card"
                >
                  <p className="card-category">
                    {categories.data?.find(
                      (category) => category.id === career.category_id,
                    )?.title ?? "Career suggestion"}
                  </p>
                  <h2>{career.title}</h2>
                  <p>{careerSummary(career.description)}</p>
                  <div className="suggestion-reason">
                    <h3>Why this was suggested</h3>
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
                          {displayed.source_references
                            ?.filter((reference) =>
                              item.source_reference_ids?.includes(reference.id),
                            )
                            .map((reference) => (
                              <li key={reference.id}>
                                <p>
                                  {reference.label}
                                  {reference.evidence_type !== "esco_occupation_skill" && (
                                    <>
                                      {" · "}
                                      {reference.relationship === "partial"
                                        ? "Partial experience relationship"
                                        : "Occupational reference"}
                                    </>
                                  )}
                                </p>
                                <p>{reference.definition}</p>
                                {reference.evidence_type !== "esco_occupation_skill" && (
                                  <>
                                    <p>
                                      {reference.source_title} ·{" "}
                                      {reference.source_version} ·{" "}
                                      {reference.locator}
                                    </p>
                                    <p>{reference.limitation}</p>
                                  </>
                                )}
                              </li>
                            ))}
                        </ul>
                        {!!displayed.coverage_limitations?.length && (
                          <ul className="mt-2 space-y-1">
                            {displayed.coverage_limitations.map((note) => (
                              <li key={note}>{note}</li>
                            ))}
                          </ul>
                        )}
                      </details>
                    )}
                    {item.uncertainty_note && (
                      <p className="text-xs text-gray-500">
                        {item.uncertainty_note}
                      </p>
                    )}
                  </div>
                  <div className="career-skills">
                    <h3>{career.exploration ? "What you could do" : "Roadmap topics"}</h3>
                    <ul>
                      {(career.exploration?.activities.map(activity => activity.action) ?? career.skills).slice(0, 3).map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                    {!career.exploration && career.skills.length > 3 && (
                      <p className="catalog-more-skills">
                        {career.skills.length - 3} more skills in this roadmap
                      </p>
                    )}
                  </div>
                  <div className="action-row">
                    <Button asChild variant="outline">
                      <Link
                        to={
                          appRoutes.roadmap(career.id) +
                          (item.roadmap_id ? "?roadmap=" + item.roadmap_id : "")
                        }
                      >
                        Explore career
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
          <Link
            className="underline"
            to={appRoutes.profile + "#saved-discovery"}
          >
            Review Discovery answers
          </Link>
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
          ((allowInitialRequest && !displayed) ||
            !!flow.error ||
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
                      : flow.error
                        ? "Try again"
                        : "Prepare suggestions"}
            </Button>
          )}
      </div>
      <p className="text-center text-xs text-gray-500">
        Suggestions use the published career catalog. They do not assess
        proficiency, guarantee suitability, or change your learning focus.
      </p>
      <p className="text-center text-xs text-gray-500">
        Preparing suggestions sends your active Discovery choices, self-reported
        skills, relevant saved learning context, occupational references and
        validated document background to Groq. Names, contact details and
        inactive answers are excluded.
      </p>
    </div>
  );
}
