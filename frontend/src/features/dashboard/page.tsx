import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeading, StatusBadge, Notice } from "@/components/shared";
import { PreviewDataState } from "@/components/preview-states";
import { appRoutes as pageRoutes } from "@/lib/routes";
import { sampleMilestones } from "@/fixtures/catalog";
import { useCurrentTopicId } from "@/lib/learning-state";

function SampleCalendar() {
  const [month, setMonth] = useState(1);
  const october = month === 1;
  const days = october ? 31 : 30;
  const offset = october ? 4 : 2;
  return (
    <Card id="progress" className="support-card">
      <div className="calendar-title">
        <h2>{october ? "October" : "September"} 2026</h2>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous month"
            disabled={!october}
            onClick={() => setMonth(0)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next month"
            disabled={october}
            onClick={() => setMonth(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="calendar-grid" aria-label="Sample activity calendar">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
        {Array.from({ length: offset }, (_, index) => (
          <span key={`space-${index}`} aria-hidden="true" />
        ))}
        {Array.from({ length: days }, (_, index) => (
          <span
            className={`calendar-day ${october && [19, 21, 23].includes(index + 1) ? "sample-active" : ""}`}
            key={index}
            aria-label={`${october ? "October" : "September"} ${index + 1}${october && [19, 21, 23].includes(index + 1) ? ", example Done activity" : ", no example activity"}`}
          >
            {index + 1}
          </span>
        ))}
      </div>
      <p className="calendar-legend">
        Sample dates only. Outlined days illustrate Done activity. No live
        streak is calculated.
      </p>
    </Card>
  );
}

export function DashboardPage() {
  const currentTopicId = useCurrentTopicId();
  const [helper, setHelper] = useState(true);
  const currentMilestone = sampleMilestones.find((milestone) =>
    milestone.topics.some((topic) => topic.id === currentTopicId),
  );
  const currentTopic = currentMilestone?.topics.find(
    (topic) => topic.id === currentTopicId,
  );
  const completedTopics =
    currentMilestone?.topics.filter((topic) => topic.status === "Done").length ??
    0;
  const milestoneProgress = currentMilestone
    ? Math.round((completedTopics / currentMilestone.topics.length) * 100)
    : 0;
  const topicLink = (id: string) =>
    `${pageRoutes.roadmap("frontend")}?topic=${encodeURIComponent(id)}`;
  return (
    <>
      <PageHeading
        title="Your next step is here."
        description="Keep your focus in sight. Pick up a topic, or make room to explore something different."
        action={
          <Button asChild variant="outline">
            <Link to={pageRoutes.careers}>Browse careers</Link>
          </Button>
        }
      />
      {!currentTopicId ? (
        <PreviewDataState
          state="empty"
          subject="current learning topic"
          action={
            <Button asChild>
              <Link to={pageRoutes.roadmap("frontend")}>Choose a topic</Link>
            </Button>
          }
        >
          Choose a topic from the Frontend roadmap to see your current step
          here.
        </PreviewDataState>
      ) : !currentMilestone || !currentTopic ? (
        <PreviewDataState
          state="error"
          subject="current learning topic"
          action={
            <Button asChild variant="outline">
              <Link to={pageRoutes.roadmap("frontend")}>Choose a topic</Link>
            </Button>
          }
        >
          The saved topic is not part of the available roadmap. Choose another
          topic to replace it.
        </PreviewDataState>
      ) : (
        <div className="dashboard-layout">
          <div className="dashboard-main">
            <section
              className="milestone-hero"
              aria-labelledby="milestone-heading"
            >
              <p className="card-category">Current learning topic</p>
              <h2 id="milestone-heading">{currentTopic.title}</h2>
              <p>{currentMilestone.title}</p>
              <StatusBadge status={currentTopic.status} />
              <Link to={topicLink(currentTopic.id)}>
                Continue learning <ChevronRight aria-hidden="true" size={17} />
              </Link>
              <div className="sample-progress">
                <div>
                  <span>
                    {completedTopics} of {currentMilestone.topics.length} sample
                    topics Done
                  </span>
                  <span>{milestoneProgress}%</span>
                </div>
                <Progress
                  value={milestoneProgress}
                  aria-label={`Sample milestone progress, ${milestoneProgress} percent`}
                />
              </div>
            </section>
            <section>
              <div className="section-heading">
                <h2>Your learning topics</h2>
                <Link to={topicLink(currentTopic.id)}>View milestone</Link>
              </div>
              <Accordion
                type="multiple"
                defaultValue={["Learning", "Not started"]}
              >
                {(
                  [
                    ["Learning", "In-Progress"],
                    ["Not started", "Not Started"],
                    ["Done", "Complete"],
                    ["Skipped", "Skipped"],
                  ] as const
                ).map(([status, label]) => {
                  const topics = currentMilestone.topics.filter(
                    (topic) => topic.status === status,
                  );
                  return (
                    <AccordionItem value={status} key={status}>
                      <AccordionTrigger>{label}</AccordionTrigger>
                      <AccordionContent>
                        {topics.length ? (
                          topics.map((topic) => (
                            <div className="topic-row" key={topic.id}>
                              <Link to={topicLink(topic.id)}>
                                {topic.title}
                                <small>{currentMilestone.title}</small>
                              </Link>
                              <StatusBadge status={topic.status} />
                            </div>
                          ))
                        ) : (
                          <p className="field-help">
                            No topics in this status.
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </section>
          </div>
          <aside className="dashboard-side" aria-label="Learning context">
            <Card className="support-card">
              <div className="section-heading">
                <h2>Current roadmap</h2>
                <Link to={pageRoutes.careers}>Edit</Link>
              </div>
              <div className="focus-title">Frontend Developer</div>
              <p>
                A sample focus for this layout. Your roadmap changes only when
                you explicitly save a new focus.
              </p>
              <Link to={pageRoutes.roadmap("frontend")} className="inline-link">
                Open roadmap
              </Link>
            </Card>
            <SampleCalendar />
            <Card className="support-card">
              <h2>Make it yours.</h2>
              <p>
                Your name is enough to complete a basic profile. A photo and PDF
                are optional.
              </p>
              <Button asChild variant="outline">
                <Link to={pageRoutes.profile}>Edit profile</Link>
              </Button>
            </Card>
          </aside>
        </div>
      )}
      {currentTopic && helper && (
        <div className="dismissible-guidance mt-8">
          <Notice>
            <div className="guidance-content">
              <div>
                <strong>Want a different starting point?</strong>
                <p>Try the Discovery prototype, or keep browsing.</p>
                <Link to={pageRoutes.welcome}>Open Discovery</Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Dismiss sample guidance"
                onClick={() => setHelper(false)}
              >
                <X />
              </Button>
            </div>
          </Notice>
          <p className="field-help mt-2">
            This dismissal lasts only while this page stays open.
          </p>
        </div>
      )}
    </>
  );
}
