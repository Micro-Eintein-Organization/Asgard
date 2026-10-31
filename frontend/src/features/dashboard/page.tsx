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
import {
  calculateStreaks,
  getLocalDateKey,
  readTopicCompletionDates,
  readTopicStatuses,
  useCurrentTopicId,
  useTopicStatuses,
} from "@/lib/learning-state";

function DashboardCalendar({
  activeDateKeys,
  currentStreak,
  longestStreak,
}: {
  activeDateKeys: readonly string[];
  currentStreak: number;
  longestStreak: number;
}) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const displayedMonth = new Date(
    today.getFullYear(),
    today.getMonth() + monthOffset,
    1,
  );
  const days = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() + 1,
    0,
  ).getDate();
  const offset = displayedMonth.getDay();
  const monthLabel = new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(displayedMonth);
  const activeDates = new Set(activeDateKeys);
  return (
    <Card id="progress" className="support-card">
      <div className="calendar-title">
        <h2>{monthLabel}</h2>
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous month"
            onClick={() => setMonthOffset((value) => value - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next month"
            disabled={monthOffset === 0}
            onClick={() => setMonthOffset((value) => value + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="streak-summary" role="group" aria-label="Learning streaks">
        <p>
          Current streak <strong>{currentStreak} days</strong>
        </p>
        <p>
          Longest streak <strong>{longestStreak} days</strong>
        </p>
      </div>
      {activeDates.size === 0 && (
        <p className="streak-empty">
          Complete a topic to start your learning streak.
        </p>
      )}
      <div className="calendar-grid" aria-label="Activity calendar">
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
        {Array.from({ length: days }, (_, index) => {
          const day = index + 1;
          const date = new Date(
            displayedMonth.getFullYear(),
            displayedMonth.getMonth(),
            day,
          );
          const dateKey = getLocalDateKey(date);
          const isActive = activeDates.has(dateKey);
          const isToday = monthOffset === 0 && day === today.getDate();
          return (
            <span
              className={[
                "calendar-day",
                isActive
                  ? monthOffset === 0
                    ? "active-current"
                    : "active-past"
                  : "",
                isToday ? "today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={dateKey}
              aria-label={`${monthLabel} ${day}${isActive ? ", active learning day" : ", no completion"}`}
              aria-current={isToday ? "date" : undefined}
            >
              {day}
            </span>
          );
        })}
      </div>
      <p className="calendar-legend">
        Orange days mark completed topics. The ring marks today.
      </p>
    </Card>
  );
}

export function DashboardPage() {
  const currentTopicId = useCurrentTopicId();
  const topicStatusSnapshot = useTopicStatuses();
  const topicStatuses = readTopicStatuses(topicStatusSnapshot);
  const activeDateKeys = [
    ...new Set(Object.values(readTopicCompletionDates(topicStatusSnapshot))),
  ];
  const { currentStreak, longestStreak } = calculateStreaks(activeDateKeys);
  const [helper, setHelper] = useState(true);
  const currentMilestone = sampleMilestones.find((milestone) =>
    milestone.topics.some((topic) => topic.id === currentTopicId),
  );
  const currentTopic = currentMilestone?.topics.find(
    (topic) => topic.id === currentTopicId,
  );
  const currentTopicStatus = currentTopic
    ? topicStatuses[currentTopic.id] ?? currentTopic.status
    : null;
  const completedTopics =
    currentMilestone?.topics.filter(
      (topic) => (topicStatuses[topic.id] ?? topic.status) === "Done",
    ).length ?? 0;
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
              <div className="milestone-topic-meta">
                <p className="card-category">Current learning topic</p>
                <StatusBadge status={currentTopicStatus ?? currentTopic.status} />
              </div>
              <h2 id="milestone-heading">{currentTopic.title}</h2>
              <p>{currentMilestone.title}</p>
              <Link to={topicLink(currentTopic.id)}>
                {currentTopicStatus === "Done"
                  ? "Review topic"
                  : "Continue learning"}{" "}
                <ChevronRight aria-hidden="true" size={17} />
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
                    (topic) => (topicStatuses[topic.id] ?? topic.status) === status,
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
                              <StatusBadge
                                status={topicStatuses[topic.id] ?? topic.status}
                              />
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
            <DashboardCalendar
              activeDateKeys={activeDateKeys}
              currentStreak={currentStreak}
              longestStreak={longestStreak}
            />
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
      {!currentTopic && (
        <div className="dashboard-layout">
          <aside className="dashboard-side" aria-label="Learning activity">
            <DashboardCalendar
              activeDateKeys={activeDateKeys}
              currentStreak={currentStreak}
              longestStreak={longestStreak}
            />
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
