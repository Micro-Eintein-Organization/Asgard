import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageHeading, StatePanel } from "@/components/shared";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

const groups = [
  ["learning", "In progress", "in-progress"],
  ["not_started", "Not started", "not-started"],
  ["done", "Complete", "complete"],
  ["skipped", "Skipped", null],
] as const;

export function DashboardScreen() {
  const dashboard = useCoreQuery(["dashboard"], coreApi.dashboard);
  const preferences = useCoreQuery(["preferences"], coreApi.preferences);
  const id = dashboard.data?.learning_state.current_roadmap_id ?? "";
  const roadmap = useCoreQuery(["roadmap", id], () => coreApi.roadmap(id), !!id);
  const careerId = roadmap.data?.career_id ?? "";
  const career = useCoreQuery(["career", careerId], () => coreApi.career(careerId), !!careerId);
  const progress = useCoreQuery(["progress", id], () => coreApi.progress(id), !!id);
  const branches = useCoreQuery(["branches", id], () => coreApi.branches(id), !!id);
  const activeId = dashboard.data?.active_topic?.roadmap_id ?? "";
  const activeRoadmap = useCoreQuery(["roadmap", activeId], () => coreApi.roadmap(activeId), !!activeId);
  const [monthOffset, setMonthOffset] = useState(0);
  const dateParts = new Intl.DateTimeFormat("en", {year:"numeric",month:"2-digit",day:"2-digit",timeZone:preferences.data?.timezone ?? "UTC"}).formatToParts(new Date());
  const part = (name: string) => dateParts.find(item => item.type === name)?.value ?? "01";
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const calendar = new Date(Date.UTC(Number(part("year")), Number(part("month")) - 1 + monthOffset, 1));
  const month = calendar.toISOString().slice(0,7);
  const activity = useCoreQuery(["activity",month], () => coreApi.activity(month));
  const queries = [dashboard,preferences,roadmap,career,progress,branches,activeRoadmap,activity];
  const error = queries.find(query => query.error)?.error;
  if (error) return <StatePanel kind="error" title="Dashboard unavailable" action={<Button onClick={() => queries.forEach(query => {if (query.data || query.error) void query.refetch();})}>Try again</Button>}>{error.message}</StatePanel>;
  if (!dashboard.data || !preferences.data || !activity.data || (id && (!roadmap.data || !career.data || !progress.data || !branches.data))) return <StatePanel kind="loading" title="Loading your Dashboard">Reading your saved learning state.</StatePanel>;
  const overview = dashboard.data;
  const savedActivity = activity.data;
  const content = roadmap.data;
  const topics = content?.milestones.filter(item => !item.retired_at).flatMap(milestone => milestone.topics.filter(item => !item.retired_at && (!item.branch_id || branches.data?.some(choice => choice.branch_id === item.branch_id)))) ?? [];
  const nextId = overview.progress?.next_topic_ids[0];
  const next = topics.find(item => item.id === nextId);
  const milestone = content?.milestones.find(item => item.id === overview.core_milestone_id);
  const summary = overview.progress?.milestones.find(item => item.milestone_id === milestone?.id);
  const stateOf = (topicId: string) => progress.data?.find(item => item.topic_id === topicId)?.status ?? "not_started";
  const topicLink = (topicId?: string) => id && careerId ? `${appRoutes.roadmap(careerId)}?roadmap=${id}${topicId ? `&topic=${topicId}` : ""}` : appRoutes.careers;
  const needsBranch = summary?.requires_branch_choice;
  const activeLink = overview.active_topic && activeRoadmap.data
    ? `${appRoutes.roadmap(activeRoadmap.data.career_id)}?roadmap=${activeId}&topic=${overview.active_topic.topic_id}`
    : null;
  const activeTitle = activeRoadmap.data?.milestones
    .flatMap((item) => item.topics)
    .find((item) => item.id === overview.active_topic?.topic_id)?.title;
  const nextLink = activeLink ?? (needsBranch && milestone ? topicLink() + "#milestone-" + milestone.id : topicLink(nextId));
  const days = new Date(Date.UTC(calendar.getUTCFullYear(),calendar.getUTCMonth()+1,0)).getUTCDate();
  const monthLabel = calendar.toLocaleDateString("en",{month:"long",year:"numeric",timeZone:"UTC"});
  if (!id && !overview.active_topic) return <>
    <PageHeading title="Your next step is here." />
    <StatePanel kind="empty" title="Choose your first roadmap" action={<Button asChild><Link to={appRoutes.careers}>Browse careers</Link></Button>}>Choose a roadmap to see your learning topics and progress here.</StatePanel>
  </>;
  return <>
    {id ? <h1 className="sr-only">Dashboard</h1> : <PageHeading title="Your next step is here." action={<Button asChild variant="outline"><Link to={appRoutes.careers}>Browse careers</Link></Button>} />}
    <div className="dashboard-layout">
      <div className="dashboard-main">
        <section className="milestone-hero" aria-labelledby="milestone-heading">
          <h2 id="milestone-heading">{activeTitle ?? next?.title ?? milestone?.title ?? "Choose a learning path"}</h2>
          {milestone && <p>{milestone.title}</p>}
          <Link to={nextLink}>{activeLink ? "Resume learning" : needsBranch ? "Choose your tool path" : overview.progress?.fully_done ? "View roadmap" : overview.progress?.no_remaining_suggestions ? "Review skipped topics" : "Continue learning"} <ChevronRight aria-hidden="true" size={17} /></Link>
          <div className="sample-progress"><div><span>{summary?.requires_branch_choice ? `${summary.common_done} of ${summary.common_total} common topics Done · choose a tool path` : `${summary?.done ?? 0} of ${summary?.applicable ?? 0} topics Done`}</span><span>{summary?.percentage != null ? `${summary.percentage}%` : ""}</span></div>{summary?.percentage != null && <Progress value={summary.percentage} aria-label={`Milestone progress, ${summary.percentage} percent`} />}</div>
          {overview.progress?.requires_branch_choice && <p>Choose the remaining tool paths to see full-roadmap progress.</p>}
        </section>
        <section>
          <div className="section-heading"><h2>Your learning topics</h2><Link to={topicLink() + (milestone ? `#milestone-${milestone.id}` : "")}>{milestone ? "View milestone" : "View roadmap"}</Link></div>
          <Accordion type="multiple" defaultValue={["learning"]}>
            {groups.map(([status,heading,color]) => {
              const matching = topics.filter(item => stateOf(item.id) === status);
              return <AccordionItem value={status} key={status}><AccordionTrigger className="dashboard-status-trigger" aria-label={`${heading}, ${matching.length} topics`}><span className="dashboard-status-heading"><span>{heading}</span>{color && <span className={`topic-count topic-count--${color}`} aria-hidden="true">{matching.length}</span>}</span></AccordionTrigger><AccordionContent>{matching.length ? matching.map(item => <div className="topic-row" key={item.id}><Link to={topicLink(item.id)}>{item.title}<small>{content?.milestones.find(entry => entry.topics.some(topic => topic.id === item.id))?.title}</small></Link></div>) : <p className="field-help">No topics in this status.</p>}</AccordionContent></AccordionItem>;
            })}
          </Accordion>
        </section>
      </div>
      <aside className="dashboard-side" aria-label="Learning context">
        <Card className="support-card current-roadmap-card">
          <div className="current-roadmap-title-group"><p className="current-roadmap-label">Current roadmap</p><div className="current-roadmap-heading"><h2>{career.data?.title ?? "No roadmap selected"}</h2><Link to={appRoutes.careers} className="current-roadmap-edit">Edit <SquarePen aria-hidden="true" size={16} /></Link></div></div>
          <p>Your roadmap changes only when you explicitly save a new focus.</p>
          <Link to={id ? topicLink() : appRoutes.careers} className="current-roadmap-open">Open roadmap</Link>
        </Card>
        <Card id="progress" className="support-card">
          <div className="calendar-title"><h2>{monthLabel}</h2><div className="flex"><Button variant="ghost" size="icon" aria-label="Previous month" onClick={() => setMonthOffset(value => value-1)}><ChevronLeft /></Button><Button variant="ghost" size="icon" aria-label="Next month" disabled={monthOffset === 0} onClick={() => setMonthOffset(value => value+1)}><ChevronRight /></Button></div></div>
          <div className="streak-summary" role="group" aria-label="Learning streak"><p>Current streak <strong>{savedActivity.streak_days} days</strong></p><p>Longest streak <strong className="streak-unavailable">Not available</strong></p></div>
          {!savedActivity.days.length && <p className="streak-empty">Complete a topic to start your learning streak.</p>}
          <div className="calendar-grid" aria-label="Activity calendar">{["Su","Mo","Tu","We","Th","Fr","Sa"].map(day => <span key={day}>{day}</span>)}{Array.from({length:calendar.getUTCDay()},(_,i) => <span key={`space-${i}`} aria-hidden="true" />)}{Array.from({length:days},(_,i) => {
            const date = `${month}-${String(i+1).padStart(2,"0")}`;
            const active = savedActivity.days.some(day => day.local_date === date && day.done_count > 0);
            return <span key={date} className={`calendar-day ${active ? monthOffset === 0 ? "active-current" : "active-past" : ""} ${date === today ? "today" : ""}`} aria-label={`${date}, ${active ? "active learning day" : "no completion"}`} aria-current={date === today ? "date" : undefined}>{i+1}</span>;
          })}</div><p className="calendar-legend">Orange days mark completed topics. The ring marks today.</p>
        </Card>
      </aside>
    </div>
  </>;
}
