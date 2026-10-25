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
import {
  PreviewStateControl,
  PreviewDataState,
  type PreviewState,
} from "@/components/preview-states";
import { routes } from "@/lib/routes";

function SampleCalendar() {
  const [month, setMonth] = useState(1);
  const october = month === 1;
  const days = october ? 31 : 30;
  const offset = october ? 4 : 2;
  return (
    <Card className="support-card">
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
  const [state, setState] = useState<PreviewState>("sample");
  const [helper, setHelper] = useState(true);
  const topicLink = (id: string) => `${routes.roadmap("frontend")}?topic=${id}`;
  return (
    <>
      <PageHeading
        title="Your next step is here."
        description="Keep your focus in sight. Pick up a topic, or make room to explore something different."
        action={
          <Button asChild variant="outline">
            <Link to={routes.careers}>Browse careers</Link>
          </Button>
        }
      />
      <PreviewStateControl value={state} onChange={setState} />
      {state !== "sample" ? (
        <PreviewDataState
          state={state}
          subject="learning activity"
          onReset={() => setState("sample")}
          emptyAction={
            <Button asChild>
              <Link to={routes.careers}>Browse careers</Link>
            </Button>
          }
        />
      ) : (
        <div className="dashboard-layout">
          <div className="dashboard-main">
            <section
              className="milestone-hero"
              aria-labelledby="milestone-heading"
            >
              <p className="card-category">Sample current milestone</p>
              <h2 id="milestone-heading">Web foundations</h2>
              <p>Continue with Semantic HTML.</p>
              <Link to={topicLink("semantic-html")}>
                Continue learning <ChevronRight aria-hidden="true" size={17} />
              </Link>
              <div className="sample-progress">
                <div>
                  <span>1 of 4 sample topics Done</span>
                  <span>25%</span>
                </div>
                <Progress
                  value={25}
                  aria-label="Sample milestone progress, 25 percent"
                />
              </div>
            </section>
            <section>
              <div className="section-heading">
                <h2>Your learning topics</h2>
                <Link to={routes.roadmap("frontend")}>View milestone</Link>
              </div>
              <Accordion type="multiple" defaultValue={["learning", "next"]}>
                <AccordionItem value="learning">
                  <AccordionTrigger>In-Progress</AccordionTrigger>
                  <AccordionContent>
                    <div className="topic-row">
                      <Link to={topicLink("semantic-html")}>
                        Semantic HTML<small>Web foundations</small>
                      </Link>
                      <StatusBadge status="Learning" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="next">
                  <AccordionTrigger>Not Started</AccordionTrigger>
                  <AccordionContent>
                    <div className="topic-row">
                      <Link to={topicLink("css-layout")}>
                        CSS and layout<small>Next in this sample path</small>
                      </Link>
                      <StatusBadge status="Not started" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="complete">
                  <AccordionTrigger>Complete</AccordionTrigger>
                  <AccordionContent>
                    <div className="topic-row">
                      <Link to={topicLink("how-the-web-works")}>
                        How the web works<small>Web foundations</small>
                      </Link>
                      <StatusBadge status="Done" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>
          </div>
          <aside className="dashboard-side" aria-label="Learning context">
            <Card className="support-card">
              <div className="section-heading">
                <h2>Current roadmap</h2>
                <Link to={routes.careers}>Edit</Link>
              </div>
              <div className="focus-title">Frontend Developer</div>
              <p>
                A sample focus for this layout. Your roadmap changes only when
                you explicitly save a new focus.
              </p>
              <Link to={routes.roadmap("frontend")} className="inline-link">
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
                <Link to={routes.profile}>Edit profile</Link>
              </Button>
            </Card>
          </aside>
        </div>
      )}
      {helper && (
        <div className="dismissible-guidance mt-8">
          <Notice>
            <div className="guidance-content">
              <div>
                <strong>Want a different starting point?</strong>
                <p>Try the Discovery preview, or keep browsing.</p>
                <Link to={routes.welcome}>Open Discovery</Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Dismiss preview guidance"
                onClick={() => setHelper(false)}
              >
                <X />
              </Button>
            </div>
          </Notice>
          <p className="field-help mt-2">
            This dismissal lasts only while this preview page stays open.
          </p>
        </div>
      )}
    </>
  );
}
