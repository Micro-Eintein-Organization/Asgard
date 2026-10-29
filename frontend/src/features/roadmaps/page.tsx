import { useEffect, useRef, useState } from "react";
import practiceData from "@/assets/data/visits.csv?url";
import practiceReference from "@/assets/data/reference.md?url";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BackLink, Notice, StatePanel } from "@/components/shared";
import { appRoutes } from "@/lib/routes";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";

export function RoadmapPage() {
  const { careerId = "" } = useParams();
  const location = useLocation();
  const catalogSearch =
    typeof location.state?.catalogSearch === "string"
      ? location.state.catalogSearch
      : "";
  const [params, setParams] = useSearchParams();
  const [hideDone, setHideDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const career = useCoreQuery(
    ["career", careerId],
    () => coreApi.resolveCareer(careerId),
    !!careerId,
  );
  const roadmapId = params.get("roadmap") ?? career.data?.roadmap_ids[0] ?? "";
  const roadmap = useCoreQuery(
    ["roadmap", roadmapId],
    () => coreApi.roadmap(roadmapId),
    !!roadmapId,
  );
  const learning = useCoreQuery(["learning"], coreApi.learning);
  const progress = useCoreQuery(
    ["progress", roadmapId],
    () => coreApi.progress(roadmapId),
    !!roadmapId,
  );
  const summary = useCoreQuery(
    ["summary", roadmapId],
    () => coreApi.summary(roadmapId),
    !!roadmapId,
  );
  const branches = useCoreQuery(
    ["branches", roadmapId],
    () => coreApi.branches(roadmapId),
    !!roadmapId,
  );
  const focus = useCoreMutation(coreApi.selectRoadmap);
  const change = useCoreMutation(coreApi.saveProgress);
  const branch = useCoreMutation(coreApi.saveBranch);
  const topicId = params.get("topic");
  const topic = roadmap.data?.milestones
    .flatMap((milestone) => milestone.topics)
    .find((item) => item.id === topicId);
  useEffect(() => {
    if (topic) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.scrollIntoView({ block: "nearest" });
    }
  }, [topic]);
  function closeTopic() {
    const next = new URLSearchParams(params);
    next.delete("topic");
    setParams(next, { state: location.state });
    requestAnimationFrame(() => opener.current?.focus());
  }
  const error =
    career.error ??
    learning.error ??
    roadmap.error ??
    progress.error ??
    summary.error ??
    branches.error;
  if (error)
    return (
      <StatePanel
        kind="error"
        title="Roadmap unavailable"
        action={
          <Button
            onClick={() => {
              void career.refetch();
              void learning.refetch();
              if (roadmapId) {
                void roadmap.refetch();
                void progress.refetch();
                void summary.refetch();
                void branches.refetch();
              }
            }}
          >
            Try again
          </Button>
        }
      >
        {error.message}
      </StatePanel>
    );
  if (!career.data || !learning.data)
    return (
      <StatePanel kind="loading" title="Loading your roadmap">
        Reading published content and saved progress.
      </StatePanel>
    );
  if (!roadmapId)
    return (
      <StatePanel
        kind="empty"
        title="No published roadmap"
        action={<Link to={appRoutes.careers}>Back to careers</Link>}
      >
        This career has no published learning path yet.
      </StatePanel>
    );
  if (!roadmap.data || !progress.data || !summary.data || !branches.data)
    return (
      <StatePanel kind="loading" title="Loading your roadmap">
        Reading published content and saved progress.
      </StatePanel>
    );
  const content = roadmap.data;
  const overview = summary.data;
  const branchChoices = branches.data;
  const focusState = learning.data;
  const careerContent = career.data;
  const saved = progress.data;
  if (content.career_id !== careerContent.id)
    return (
      <StatePanel kind="error" title="Roadmap unavailable">
        This roadmap does not belong to the selected career.
      </StatePanel>
    );
  const pending = focus.isPending || change.isPending || branch.isPending;
  const mutationError = focus.error ?? change.error ?? branch.error;
  return (
    <>
      <BackLink to={appRoutes.careers + catalogSearch}>
        Back to catalog
      </BackLink>
      {mutationError && (
        <Notice tone="error">
          {mutationError.message}{" "}
          <button
            onClick={() => {
              void learning.refetch();
              void progress.refetch();
              void branches.refetch();
            }}
          >
            Reload saved state
          </button>{" "}
          <Link to={appRoutes.dashboard}>Resolve Learning on Dashboard</Link>
        </Notice>
      )}
      <div className="roadmap-layout">
        <div className="roadmap-main">
          <Notice>Browsing does not change your focus or progress.</Notice>
          <section className="roadmap-hero">
            <h1>{careerContent.title}</h1>
            <p>{content.description}</p>
            {careerContent.slug === "data-analyst" && <p className="flex flex-wrap gap-4">
              <a className="underline" href={practiceData} download>Download practice CSV</a>
              <a className="underline" href={practiceReference} download>Download data dictionary and reference results</a>
            </p>}
            <p>
              {overview.requires_branch_choice
                ? `${overview.done} of ${overview.applicable} current topics done · choose a path to see total progress`
                : overview.percentage == null
                  ? "No active topics yet"
                  : `${overview.done} of ${overview.applicable} topics done · ${overview.percentage}%`}
            </p>
            <div className="action-row">
              <Button
                disabled={
                  pending ||
                  content.status !== "published" ||
                  focusState.current_roadmap_id === roadmapId
                }
                onClick={() =>
                  focus.mutate({
                    roadmap_id: roadmapId,
                    expected_version: focusState.version,
                  })
                }
              >
                {focus.isPending
                  ? "Saving…"
                  : focusState.current_roadmap_id === roadmapId
                    ? "Current roadmap"
                    : "Set as current roadmap"}
              </Button>
            </div>
            {content.status === "retired" && (
              <p>
                This roadmap has been retired. Existing history is retained.
              </p>
            )}
          </section>
          <section className="roadmap-about">
            <h2>About this career</h2>
            <p>{careerContent.description}</p>
            <details>
              <summary>Read more about the work</summary>
              <ul>
                {careerContent.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ul className="skill-list">
                {careerContent.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </details>
          </section>
          {overview.fully_done ? (
            <Notice>
              All applicable topics are Done.{" "}
              <Link to={appRoutes.careers}>Explore other careers</Link>
            </Notice>
          ) : overview.no_remaining_suggestions ? (
            <Notice>
              No remaining suggested topics. Revisit Skipped topics below.
            </Notice>
          ) : null}
          <div className="section-heading">
            <h2>Milestones</h2>
            <label className="filter-check">
              <input
                type="checkbox"
                checked={hideDone}
                onChange={(event) => setHideDone(event.target.checked)}
              />
              Hide completed
            </label>
          </div>
          <Accordion
            type="multiple"
            defaultValue={content.milestones.map((milestone) => milestone.id)}
          >
            {content.milestones
              .filter((milestone) => !milestone.retired_at)
              .map((milestone) => {
                const count = overview.milestones.find(
                  (item) => item.milestone_id === milestone.id,
                );
                return (
                  <div className="milestone-card" key={milestone.id}>
                    <AccordionItem value={milestone.id}>
                      <AccordionTrigger>
                        {milestone.title} ·{" "}
                        {count?.requires_branch_choice
                          ? "Choose a path"
                          : count?.percentage == null
                            ? "No active topics"
                            : count.percentage + "%"}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="milestone-description">
                          {milestone.description}
                        </p>
                        {milestone.branch_groups.map((group) => (
                          <fieldset key={group.id}>
                            <legend>{group.title}</legend>
                            <p>{group.explanation}</p>
                            <div className="action-row">
                              {group.branches.map((option) => {
                                const chosen = branchChoices.find(
                                  (item) => item.group_id === group.id,
                                );
                                return (
                                  <Button
                                    key={option.id}
                                    variant="outline"
                                    aria-pressed={
                                      chosen?.branch_id === option.id
                                    }
                                    disabled={pending}
                                    onClick={() =>
                                      branch.mutate({
                                        roadmapId,
                                        groupId: group.id,
                                        body: {
                                          branch_id: option.id,
                                          expected_version:
                                            chosen?.version ?? 0,
                                        },
                                      })
                                    }
                                  >
                                    {option.title}
                                  </Button>
                                );
                              })}
                            </div>
                          </fieldset>
                        ))}
                        {milestone.topics
                          .filter(
                            (item) =>
                              !item.retired_at &&
                              (!item.branch_id || branchChoices.some(choice => choice.branch_id === item.branch_id)) &&
                              (!hideDone ||
                                saved.find(
                                  (entry) => entry.topic_id === item.id,
                                )?.status !== "done"),
                          )
                          .map((item) => {
                            const state = saved.find(
                              (entry) => entry.topic_id === item.id,
                            );
                            return (
                              <button
                                key={item.id}
                                className="topic-selector"
                                aria-pressed={topicId === item.id}
                                onClick={(event) => {
                                  opener.current = event.currentTarget;
                                  const next = new URLSearchParams(params);
                                  next.set("topic", item.id);
                                  setParams(next, { state: location.state });
                                }}
                              >
                                <strong>{item.title}</strong>
                                <span>
                                  {state?.status.replace("_", " ") ??
                                    "not started"}
                                </span>
                              </button>
                            );
                          })}

                        {milestone.topics.some(item => item.branch_id &&
                          !branchChoices.some(choice => choice.branch_id === item.branch_id) &&
                          saved.some(entry => entry.topic_id === item.id)) && <details>
                          <summary>Saved history from other tool paths</summary>
                          {milestone.topics.filter(item => item.branch_id &&
                            !branchChoices.some(choice => choice.branch_id === item.branch_id) &&
                            saved.some(entry => entry.topic_id === item.id)).map(item => (
                              <Link key={item.id} className="block underline"
                                to={{ search: "?" + new URLSearchParams({ ...Object.fromEntries(params), topic: item.id }) }}>
                                {item.title} · {saved.find(entry => entry.topic_id === item.id)?.status}
                              </Link>
                            ))}
                        </details>}
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                );
              })}
          </Accordion>
        </div>
        <aside className="topic-panel" aria-label="Topic details">
          {topic ? (
            <>
              <header>
                <div>
                  <p>Topic</p>
                  <h2 ref={heading} tabIndex={-1}>
                    {topic.title}
                  </h2>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Close topic"
                  onClick={closeTopic}
                >
                  <X />
                </Button>
              </header>
              <section>
                <p className="whitespace-pre-line">{topic.explanation}</p>
                {topic.prerequisite_ids.length > 0 && (
                  <p className="field-help">
                    Prerequisites are guidance. You may study topics in any
                    order.
                  </p>
                )}
              </section>
              <section>
                <h3>Resources</h3>
                {topic.resources.map((resource) => (
                  <a
                    className="resource-link"
                    key={resource.id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      {resource.title}
                      <small>
                        {resource.is_free
                          ? "Free access"
                          : "Access details in resource"}{" "}
                        · {resource.kind}
                      </small>
                    </span>
                    <ExternalLink aria-hidden="true" />
                  </a>
                ))}
              </section>
              <div className="progress-actions">
                {(["learning", "done", "skipped", "not_started"] as const).map(
                  (status) => {
                    const current = saved.find(
                      (item) => item.topic_id === topic.id,
                    );
                    const retired =
                      !!topic.retired_at || content.status === "retired";
                    const inactive = topic.branch_id && !branchChoices.some(
                      choice => choice.branch_id === topic.branch_id,
                    );
                    return (
                      <Button
                        key={status}
                        variant={
                          current?.status === status ? "default" : "outline"
                        }
                        disabled={
                          pending ||
                          (!!inactive && (current?.status !== "learning" || status === "learning")) ||
                          (retired &&
                            (current?.status !== "learning" ||
                              status === "learning"))
                        }
                        onClick={() =>
                          change.mutate({
                            roadmapId,
                            topicId: topic.id,
                            body: {
                              status,
                              expected_version: current?.version ?? 0,
                            },
                          })
                        }
                      >
                        {status === "not_started"
                          ? "Clear"
                          : status === "skipped"
                            ? "Skip"
                            : status === "learning"
                              ? "Learning"
                              : "Done"}
                      </Button>
                    );
                  },
                )}
              </div>
              {topic.branch_id && !branchChoices.some(choice => choice.branch_id === topic.branch_id) &&
                <p className="field-help">This topic belongs to another tool path and is excluded from current totals. Select that path to continue it. An existing Learning status can still be resolved.</p>}
            </>
          ) : (
            <div className="empty-topic-panel">
              <h2>{topicId ? "Topic unavailable" : "Choose a topic"}</h2>
              <p>Open a topic to read its explanation and resources.</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
