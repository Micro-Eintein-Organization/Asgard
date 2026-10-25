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
  Unavailable,
} from "@/components/shared";
import { findCareer, categories, sampleMilestones } from "@/fixtures/catalog";
import { usePageRoutes } from "@/lib/page-routes";

export function RoadmapPage() {
  const pageRoutes = usePageRoutes();
  const { careerId } = useParams();
  const career = findCareer(careerId);
  const location = useLocation();
  const catalogSearch =
    typeof location.state?.catalogSearch === "string"
      ? location.state.catalogSearch
      : "";
  const [params, setParams] = useSearchParams();
  const [hideDone, setHideDone] = useState(false);
  const topicId = params.get("topic");
  const topic = sampleMilestones
    .flatMap((milestone) => milestone.topics)
    .find((item) => item.id === topicId);
  const panelHeading = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
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
        Choose a role from the catalog to inspect its roadmap preview.
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
            Browsing a roadmap does not change your focus or progress.
          </Notice>
          <section className="roadmap-hero">
            <p>{category?.title}</p>
            <h1>{career.title}</h1>
            <div className="action-row">
              <Button disabled>Set as current roadmap</Button>
            </div>
            <p className="hero-availability">
              Focus saving is not connected in this preview.
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
                        {milestone.topics
                          .filter((item) => !hideDone || item.status !== "Done")
                          .map((item) => (
                            <button
                              key={item.id}
                              id={`topic-${item.id}`}
                              className="topic-selector"
                              aria-pressed={topicId === item.id}
                              aria-controls="topic-details"
                              onClick={(event) => {
                                opener.current = event.currentTarget;
                                setParams(
                                  { topic: item.id },
                                  { state: location.state },
                                );
                              }}
                            >
                              {item.status === "Done" ? (
                                <Check size={19} aria-hidden="true" />
                              ) : (
                                <Circle size={18} aria-hidden="true" />
                              )}
                              <span>
                                <strong>{item.title}</strong>
                              </span>
                              <StatusBadge status={item.status} />
                              <Eye size={16} aria-hidden="true" />
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
              been published for this preview.
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
                    <StatusBadge status={topic.status} />
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
                <h3>Record your progress</h3>
                <div className="progress-actions">
                  {["Learning", "Done", "Skip", "Clear"].map((label) => (
                    <Button variant="outline" disabled key={label}>
                      {label}
                    </Button>
                  ))}
                </div>
                <Unavailable>
                  Progress saving is not connected. Opening a resource changes
                  nothing.
                </Unavailable>
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
