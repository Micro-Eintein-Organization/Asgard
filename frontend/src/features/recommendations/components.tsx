import { useScreenContext } from "@/features/counselor-context";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared";
import { LoadingIndicator } from "@/components/loading-indicator";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { careerSummary } from "@/lib/career-summary";
import { useRecommendationFlow } from "./use-recommendation-flow";
import { ExplainRecommendation } from "./explanation";

export function RecommendationCards({
  flow,
  allowInitialRequest = true,
  rulesMode = false,
}: {
  flow: ReturnType<typeof useRecommendationFlow>;
  allowInitialRequest?: boolean;
  rulesMode?: boolean;
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
  const [shownPrevious, setShownPrevious] = useState<string>();
  const fresh = current?.status === "completed" && !current.outdated ? current : null;
  const previous = current?.status === "completed" && current.outdated
    ? current : state?.previous_eligible_success;
  const showingPrevious = !!previous && previous.id === shownPrevious;
  const displayed = fresh ?? (showingPrevious ? previous : null);
  useScreenContext(displayed ? { label: "Saved career suggestions", recommendation_run_id: displayed.id } : null);
  const discoveryId = displayed?.discovery?.session_id;
  const resultDiscovery = useCoreQuery(
    ["discovery-session", discoveryId],
    () => coreApi.discoverySession(discoveryId!),
    !!discoveryId,
  );
  const goal = resultDiscovery.data?.answers.find(
    (answer) => answer.question_id === "goals",
  )?.option_ids[0];
  const goalIntros: Record<string, string> = {
    start: "Ready to learn? Open a roadmap to see its first topics.",
    explore: "Look at what each career involves and open a roadmap when you find one you want to explore.",
    change: "Considering a career change? Open a role to explore its roadmap.",
  };
  const goalIntro = goal ? goalIntros[goal] : undefined;
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
      {flow.pending ? (
        <p role="status" className="text-center py-8 text-sm">
          <LoadingIndicator />{" "}
          Preparing your career suggestions…
        </p>
      ) : flow.willRetry && (
        <p role="status" className="text-sm">
          Your answers are saved. We’ll retry automatically.
          {flow.cooldown > 0 && <span aria-hidden="true"> {flow.cooldown}s</span>}
        </p>
      )}
      {current?.status === "failed" && !flow.pending && !flow.willRetry && !flow.error && (
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
      {flow.error && !flow.willRetry && (
        <p role="alert" className="field-error">
          {flow.error.message}{" "}
          {!rulesMode && (
            <button disabled={flow.pending} onClick={() => void flow.reload()}>
              Reload saved state
            </button>
          )}
        </p>
      )}

      {displayed && (
        <>
          {goalIntro && <p className="text-center text-sm">{goalIntro}</p>}
          {showingPrevious && !fresh && (
            <p className="text-sm text-gray-500">Previous suggestions from earlier answers or context.</p>
          )}
          <div className="career-grid results-grid mt-6">
            {displayed.items.map((item) => {
              const career = careers.find(
                (entry) => entry.id === item.career_id,
              );
              const roadmapId = item.roadmap_id;
              if (!career || !roadmapId || !career.roadmap_ids.includes(roadmapId))
                return (
                  <div
                    key={item.career_id}
                    className="border rounded-2xl p-6 text-sm"
                  >
                    This suggested career is unavailable.{" "}
                    <Link to={appRoutes.careers}>Browse careers</Link>
                  </div>
                );
              const roadmapAction = (
                <Button key="roadmap" asChild className="h-auto min-h-9 whitespace-normal py-2 text-center">
                  <Link to={appRoutes.roadmap(career.id) + "?" + new URLSearchParams({ roadmap: roadmapId })}>
                    See where to start
                  </Link>
                </Button>
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
                  </div>
                  {item.explanation && <details className="text-sm space-y-3">
                    <summary>Answers, experience and roadmap reasoning</summary>
                    <h3>Your answers</h3>
                    <ul>{item.explanation.answer_reasons?.map(reason => <li key={reason}>{reason}</li>)}</ul>
                    <h3>Experience connections</h3>
                    {item.explanation.experience_connections?.length ? <ul>{item.explanation.experience_connections.map(reason => <li key={reason}>{reason}</li>)}</ul> : <p>No specific saved skill connection was established for this career.</p>}
                    <h3>Why this roadmap</h3><p>{item.explanation.roadmap_reason}</p>
                    <h3>First topics in the authored path</h3><ol>{item.explanation.first_topics?.map(topic => <li key={topic}>{topic}</li>)}</ol>
                    <p>{item.explanation.considerations}</p>
                    {!showingPrevious && !displayed.outdated && <ExplainRecommendation key={`${displayed.id + item.career_id}`} run={displayed.id} career={item.career_id} roadmap={roadmapId} />}
                  </details>}
                  {!!career.skills.length && (
                    <ul className="skill-list" aria-label="Skills in this roadmap">
                      {career.skills.slice(0, 3).map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  )}
                  <div className="action-row mt-auto !gap-2">
                    {roadmapAction}
                  </div>
                </article>
              );
            })}
          </div>
          <details key={displayed.id} className="text-sm">
            <summary>Suggestion details</summary>
            {displayed.items.map(item => (
              <section className="mt-3 space-y-1" key={item.career_id}>
                <h3 className="font-semibold">{careers.find(career => career.id === item.career_id)?.title ?? "Career suggestion"}</h3>
                <p>{item.reason}</p>
                {item.uncertainty_note && <p>{item.uncertainty_note}</p>}
                <ul>
                  {displayed.evidence?.filter(fact => item.evidence_fact_ids.includes(fact.id))
                    .map(fact => <li key={fact.id}>{fact.description}</li>)}
                  {displayed.source_references?.filter(reference => item.source_reference_ids?.includes(reference.id))
                    .map(reference => <li key={reference.id}>
                      {reference.label} · {reference.definition} · {reference.source_title} · {reference.source_version} · {reference.locator}
                      {reference.limitation && <p>{reference.limitation}</p>}
                    </li>)}
                </ul>
              </section>
            ))}
            {displayed.coverage_limitations?.map(note => <p className="mt-2" key={note}>{note}</p>)}
            <Link className="underline" to={appRoutes.profile + "#saved-discovery"}>Review Discovery answers</Link>
          </details>
        </>
      )}
      {!displayed && !flow.pending && !flow.willRetry && !flow.error && !current && (
        <p className="text-center text-sm text-gray-500">
          {rulesMode && state.available
            ? "Preparing your career suggestions…"
            : "No suggestions have been generated yet. You can explore every career in the catalog."}
        </p>
      )}
      <div className="action-row">
        {!rulesMode && state.available && !flow.willRetry &&
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
        {!fresh && previous && (
          <Button variant="ghost" aria-expanded={showingPrevious}
            onClick={() => setShownPrevious(showingPrevious ? undefined : previous.id)}>
            {showingPrevious ? "Hide previous suggestions" : "View previous suggestions"}
          </Button>
        )}
      </div>
      <p className="text-center text-xs text-gray-500">
        Suggestions use the published career catalog. They do not assess
        proficiency, guarantee suitability, or change your learning focus.
      </p>
      <p className="text-center text-xs text-gray-500">
        {rulesMode
          ? "Suggestions use your active Discovery answers and the published career catalog."
          : "Preparing suggestions sends active Discovery choices, self-reported skills, relevant learning context, occupational references and validated document background to Groq. Names, contact details and inactive answers are excluded."}
      </p>
    </div>
  );
}
