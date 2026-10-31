import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { Check, Circle, ExternalLink, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BackLink,
  Notice,
  StatePanel,
  StatusBadge,
} from "@/components/shared";
import { findCareer, categories, sampleMilestones } from "@/fixtures/catalog";
import { appRoutes as pageRoutes } from "@/lib/routes";
import {
  readTopicStatuses,
  setCurrentTopicId,
  setTopicStatus,
  useTopicStatuses,
} from "@/lib/learning-state";

export function RoadmapPage() {
  const { careerId } = useParams();
  const career = findCareer(careerId);
  const location = useLocation();
  const catalogSearch =
    typeof location.state?.catalogSearch === "string"
      ? location.state.catalogSearch
      : "";
  const [params, setParams] = useSearchParams();
  const [hideDone, setHideDone] = useState(false);
  const [hiddenTopicIds, setHiddenTopicIds] = useState<Set<string>>(
    () => new Set(),
  );
  const topicControlToFocus = useRef<string | null>(null);
  const [topicSaveError, setTopicSaveError] = useState(false);
  const [topicStatusSaveError, setTopicStatusSaveError] = useState(false);
  const topicStatuses = readTopicStatuses(useTopicStatuses());
  const topicId = params.get("topic");
  const topic = sampleMilestones
    .flatMap((milestone) => milestone.topics)
    .find((item) => item.id === topicId);
  const topicStatus = topic ? topicStatuses[topic.id] ?? topic.status : null;
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!topicControlToFocus.current) return;
    document.getElementById(topicControlToFocus.current)?.focus();
    topicControlToFocus.current = null;
  }, [hiddenTopicIds]);
  useEffect(() => {
    if (topicId && careerId === "frontend") {
      panelHeading.current?.focus({ preventScroll: true });
      if (window.innerWidth < 1024)
        panelHeading.current?.scrollIntoView({ block: "start" });
    }
  }, [topicId, careerId]);
  function closeTopic() {
    setParams({}, { state: location.state });
    requestAnimationFrame(() => opener.current?.focus());
  }
  function chooseTopic(
    topicId: string,
    openerButton: HTMLButtonElement,
  ) {
    opener.current = openerButton;
    setParams({ topic: topicId }, { state: location.state });
    try {
      setCurrentTopicId(topicId);
      setTopicSaveError(false);
    } catch {
      setTopicSaveError(true);
    }
  }
  function completeTopic() {
    if (!topic) return;
    try {
      setTopicStatus(topic.id, "Done");
      setTopicStatusSaveError(false);
    } catch {
      setTopicStatusSaveError(true);
    }
  }
  function hideTopic(topicId: string) {
    topicControlToFocus.current = `show-topic-${topicId}`;
    setHiddenTopicIds((current) => new Set(current).add(topicId));
  }
  function showTopic(topicId: string) {
    topicControlToFocus.current = `hide-topic-${topicId}`;
    setHiddenTopicIds((current) => {
      const next = new Set(current);
      next.delete(topicId);
      return next;
    });
  }
  if (!career)
    return (
      <StatePanel
        kind="error"
        title="This career is unavailable"
        action={
          <Button asChild variant="outline">
            <Link to={pageRoutes.careers}>Back to catalog</Link>
          </Button>
        }
      >
        Choose a role from the catalog to inspect its sample roadmap.
      </StatePanel>
    );
  if (topicId && (career.id !== "frontend" || !topic))
    return (
      <StatePanel
        kind="error"
        title="This topic is unavailable"
        action={
          <Button asChild variant="outline">
            <Link to={pageRoutes.roadmap(career.id)}>Return to roadmap</Link>
          </Button>
        }
      >
        The selected topic is not part of this roadmap.
      </StatePanel>
    );
  const category = categories.find((item) => item.id === career.category);
  return (
    <>
      <BackLink to={`${pageRoutes.careers}${catalogSearch}`}>
        Back to catalog
      </BackLink>
      <div className="roadmap-layout">
        <div className="roadmap-main">
          <Notice>
            Selecting a topic sets your current topic. It does not mark the
            topic complete.
          </Notice>
          {topicSaveError && (
            <Notice tone="error">
              Your current topic could not be saved in this browser. Try again
              or continue browsing without changing it.
            </Notice>
          )}
          {topicStatusSaveError && (
            <Notice tone="error">
              Topic completion could not be saved in this browser. Try again.
            </Notice>
          )}
          <section className="roadmap-hero">
            <p>{category?.title}</p>
            <h1>{career.title}</h1>
            <div className="action-row">
              <Button disabled>Set as current roadmap</Button>
            </div>
            <p className="hero-availability">
              Prototype: focus saving is not connected.
            </p>
          </section>
          <section className="roadmap-about">
            <h2>About this career</h2>
            <p>{career.description}</p>
            <details>
              <summary>Read more about the work</summary>
              <ul>
                {career.activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
              <p>
                <strong>Example project:</strong> {career.example}
              </p>
              <ul className="skill-list">
                {career.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </details>
          </section>
          {career.id === "frontend" ? (
            <>
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
              <p className="field-help mb-4">
                Sample curriculum and statuses, not published learning content.
                The order is guidance; topics are not locked.
              </p>
              <Accordion
                type="multiple"
                defaultValue={["web-foundations"]}
                className="milestone-list"
              >
                {sampleMilestones.map((milestone, index) => (
                  <div className="milestone-card" key={milestone.id}>
                    <AccordionItem value={milestone.id}>
                      <AccordionTrigger>
                        {index + 1}. {milestone.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="milestone-description">
                          {milestone.description}
                        </p>
                        {milestone.topics.map((item) => {
                          const status = topicStatuses[item.id] ?? item.status;
                          if (hideDone && status === "Done") return null;
                          const hidden = hiddenTopicIds.has(item.id);
                          return (
                            <div
                              key={item.id}
                              id={`topic-task-${item.id}`}
                              className={`topic-task${hidden ? " is-hidden" : ""}`}
                              aria-hidden={hidden}
                              inert={hidden}
                            >
                              <div className="topic-task-content">
                                <div className="topic-task-row">
                                  <button
                                    type="button"
                                    id={`topic-${item.id}`}
                                    className="topic-selector"
                                    aria-pressed={topicId === item.id}
                                    aria-controls="topic-details"
                                    onClick={(event) => {
                                      chooseTopic(
                                        item.id,
                                        event.currentTarget,
                                      );
                                    }}
                                  >
                                    {status === "Done" ? (
                                      <Check size={19} aria-hidden="true" />
                                    ) : (
                                      <Circle size={18} aria-hidden="true" />
                                    )}
                                    <span>
                                      <strong>{item.title}</strong>
                                    </span>
                                    <StatusBadge status={status} />
                                  </button>
                                  <button
                                    type="button"
                                    id={`hide-topic-${item.id}`}
                                    className="topic-visibility-button"
                                    aria-label={`Hide task: ${item.title}`}
                                    aria-controls={`topic-${item.id}`}
                                    onClick={() => hideTopic(item.id)}
                                  >
                                    <Eye size={16} aria-hidden="true" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {milestone.topics
                          .filter((item) => {
                            const status = topicStatuses[item.id] ?? item.status;
                            return (
                              hiddenTopicIds.has(item.id) &&
                              (!hideDone || status !== "Done")
                            );
                          })
                          .map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              id={`show-topic-${item.id}`}
                              className="hidden-topic-reveal"
                              aria-label={`Show task: ${item.title}`}
                              aria-controls={`topic-${item.id}`}
                              onClick={() => showTopic(item.id)}
                            >
                              <Eye size={16} aria-hidden="true" />
                              Show task: {item.title}
                            </button>
                          ))}
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                ))}
              </Accordion>
            </>
          ) : (
            <StatePanel
              kind="empty"
              title="This roadmap is awaiting content review"
              action={
                <Button asChild variant="outline">
                  <Link to={pageRoutes.roadmap("frontend")}>
                    View the sample Frontend layout
                  </Link>
                </Button>
              }
            >
              The career overview is a sample. A complete curriculum has not
              been published for this prototype.
            </StatePanel>
          )}
        </div>
        <aside
          id="topic-details"
          className="topic-panel"
          aria-label="Topic details"
        >
          {career.id === "frontend" && topic ? (
            <>
              <header>
                <div>
                  <p>
                    Sample topic ·{" "}
                    {
                      sampleMilestones.find((milestone) =>
                        milestone.topics.some((item) => item.id === topic.id),
                      )?.title
                    }
                  </p>
                  <h2 tabIndex={-1} ref={panelHeading}>
                    {topic.title}
                  </h2>
                  <div className="mt-3">
                    <StatusBadge status={topicStatus ?? topic.status} />
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Close topic details"
                  onClick={closeTopic}
                >
                  <X />
                </Button>
              </header>
              <section>
                <h3>Overview</h3>
                <p>{topic.explanation}</p>
              </section>
              <section>
                <h3>Learning outcome</h3>
                <p>{topic.outcome}</p>
              </section>
              <section>
                <h3>Tools and setup</h3>
                <p>
                  A text editor and a modern browser are enough for this sample
                  topic. No paid tools are required.
                </p>
              </section>
              <section>
                <h3>Links and resources</h3>
                <a
                  href={topic.resource}
                  target="_blank"
                  rel="noreferrer"
                  className="resource-link"
                >
                  <span>
                    {topic.resourceTitle}
                    <small>{topic.publisher} · Free · Opens in a new tab</small>
                  </span>
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </section>
              <section>
                <h3>Completion</h3>
                {topicStatus === "Done" ? (
                  <Notice tone="success">
                    You marked this topic complete.
                  </Notice>
                ) : (
                  <>
                    <p className="mb-3">
                      Mark this topic complete when you feel you have finished
                      it.
                    </p>
                    <Button onClick={completeTopic}>Mark topic complete</Button>
                  </>
                )}
              </section>
            </>
          ) : (
            <div className="empty-topic-panel">
              <Eye size={28} aria-hidden="true" />
              <h2>Take a closer look.</h2>
              <p>
                Select a topic to read its overview, learning outcome and
                resources.
              </p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
