import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import type { components } from "@/api/generated/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { coreApi, useCoreMutation, useRoadmapGuidance } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

type Topic = components["schemas"]["GuidanceTopic"];
type Reflection = components["schemas"]["GuidanceReflection"];

const statusLabels = {
  not_started: "Not started",
  learning: "Learning",
  done: "Done",
  skipped: "Skipped",
};

export function LearningGuidance({ roadmapId, careerId, dashboard = false, showNext = true }: {
  roadmapId: string;
  careerId: string;
  dashboard?: boolean;
  showNext?: boolean;
}) {
  const query = useRoadmapGuidance(roadmapId);
  const practice = useCoreMutation(coreApi.savePractice);
  const save = useCoreMutation(coreApi.saveMilestoneReflection);
  const remove = useCoreMutation(coreApi.deleteMilestoneReflection);
  const [editor, setEditor] = useState<{ milestoneId: string; version: number }>();
  const { hash } = useLocation();
  const data = query.data;
  const busy = practice.isPending || save.isPending || remove.isPending;
  const error = query.error ?? practice.error ?? save.error ?? remove.error;
  const base = appRoutes.roadmap(careerId) + "?roadmap=" + roadmapId;
  const latest = data?.reflections.filter((item) => item.complete && item.understood === null).at(-1);
  const ready = !!data;
  useEffect(() => {
    if (dashboard || !ready || !hash.startsWith("#reflection-")) return;
    const target = document.getElementById(hash.slice(1));
    target?.focus();
  }, [dashboard, hash, ready]);
  const topicLink = (topic: Topic) => base + "&topic=" + topic.id;
  const milestoneLink = (id: string) => base + "#milestone-" + id;
  const savePractice = (id: string, saved: boolean) => {
    if (data) practice.mutate({
      roadmapId, topicId: id, body: { saved, expected_version: data.version },
    });
  };

  function practiceList(items: Topic[]) {
    return <ul className="space-y-2">{items.map((topic) => (
      <li key={topic.id} className="flex flex-wrap items-center justify-between gap-2">
        <div>
          {topic.unavailable ? topic.title : <Link className="underline" to={topicLink(topic)}>{topic.title}</Link>}
          <p className="text-sm">{topic.unavailable === "retired" ? "Topic retired"
            : topic.unavailable === "branch" ? "On a different tool path" : statusLabels[topic.status]}</p>
        </div>
        <Button variant="outline" disabled={busy} onClick={() => savePractice(topic.id, false)}
          aria-label={`Remove ${topic.title} from practice`}>Remove</Button>
      </li>
    ))}</ul>;
  }

  function reflection(item: Reflection) {
    if (editor?.milestoneId !== item.milestone_id) return (
      <Button variant="outline" disabled={busy}
        onClick={() => data && setEditor({ milestoneId: item.milestone_id, version: data.version })}>
        {item.understood !== null ? "Edit reflection" : "Reflect"}
      </Button>
    );
    const { version } = editor;
    return (
      <form className="space-y-3" onSubmit={(event) => {
        event.preventDefault();
        const fields = new FormData(event.currentTarget);
        save.mutate({
          roadmapId, milestoneId: item.milestone_id,
          body: { expected_version: version, understood: String(fields.get("understood") ?? ""),
            practise: String(fields.get("practise") ?? "") },
        }, { onSuccess: () => setEditor(undefined) });
      }}>
        <label className="grid gap-1">What do you understand now?
          <textarea className="min-h-20 rounded-md border bg-background p-2" name="understood"
            maxLength={1000} defaultValue={item.understood ?? ""} />
        </label>
        <label className="grid gap-1">What would you like to practise again?
          <textarea className="min-h-20 rounded-md border bg-background p-2" name="practise"
            maxLength={1000} defaultValue={item.practise ?? ""} />
        </label>
        <div className="flex flex-wrap gap-2">
          <Button disabled={busy} type="submit">Save reflection</Button>
          <Button disabled={busy} type="button" variant="outline" onClick={() => setEditor(undefined)}>Cancel</Button>
          {item.understood !== null && (
            <Button disabled={busy} type="button" variant="outline" onClick={() => remove.mutate({
              roadmapId, milestoneId: item.milestone_id, body: { expected_version: version },
            }, { onSuccess: () => setEditor(undefined) })}>Delete reflection</Button>
          )}
        </div>
      </form>
    );
  }

  return (
    <Card className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Learning guidance</h2>
      {query.isPending && <p role="status">Loading your learning plan…</p>}
      {error && <div role="alert" className="space-y-2">
        <p>{error.message}</p>
        <Button variant="outline" onClick={() => {
          setEditor(undefined);
          practice.reset();
          save.reset();
          remove.reset();
          void query.refetch();
        }}>Reload learning plan</Button>
      </div>}
      {data && <>
        {showNext && data.next_topic && <div>
          <h3 className="font-semibold">{data.next_topic.status === "learning" ? "Resume learning" : "Next in your roadmap"}</h3>
          <Link className="underline" to={topicLink(data.next_topic)}>{data.next_topic.title}</Link>
          <p className="text-sm">{data.next_topic.status === "learning" ? "You marked this topic as Learning." : "This is the next unfinished topic in the authored sequence for your tool path."}</p>
          <p>{data.next_topic.explanation}</p>
        </div>}
        {showNext && data.needs_branch && data.next_milestone_id && (
          <Link className="underline" to={milestoneLink(data.next_milestone_id)}>Choose a tool path to continue</Link>
        )}
        {showNext && !data.next_topic && !data.needs_branch && <p>Review your progress and any skipped topics on the roadmap.</p>}
        <section className="space-y-2">
          <h3 className="font-semibold">Saved practice</h3>
          {data.practice.length === 0 && <p>No topics saved for extra practice.</p>}
          {practiceList(data.practice.filter((topic) => !topic.unavailable))}
          {data.practice.some((topic) => topic.unavailable) && <>
            <h4 className="font-semibold">Unavailable</h4>
            {practiceList(data.practice.filter((topic) => topic.unavailable))}
          </>}
        </section>
        {dashboard ? latest && (
          <Link className="underline" to={base + "#reflection-" + latest.milestone_id}>Reflect on {latest.title}</Link>
        ) : <>
          {data.suggestions.length > 0 && <section className="space-y-2">
            <h3 className="font-semibold">Suggested practice</h3>
            <ul className="space-y-3">{data.suggestions.map((topic) => <li key={topic.id}>
              <Link className="underline" to={topicLink(topic)}>{topic.title}</Link>
              <p className="text-sm">This topic is linked to {topic.skill_labels.join(", ")}, which you rated as no experience.</p>
              <Button variant="outline" disabled={busy} onClick={() => savePractice(topic.id, true)}>Save for practice</Button>
            </li>)}</ul>
          </section>}
          {data.suggestions.length === 0 && (
            <p>No additional practice suggestions from your current skill reports. You can still choose a topic below.</p>
          )}
          <form className="flex flex-wrap items-end gap-2" onSubmit={(event) => {
            event.preventDefault();
            const id = String(new FormData(event.currentTarget).get("topic") ?? "");
            if (id) savePractice(id, true);
          }}>
            <label className="grid gap-1">Choose another practice topic
              <select name="topic" required className="max-w-full rounded-md border bg-background p-2">
                <option value="">Select a topic</option>
                {data.topics.filter((topic) => !data.practice.some((entry) => entry.id === topic.id))
                  .map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}
              </select>
            </label>
            <Button variant="outline" disabled={busy} type="submit">Save topic</Button>
          </form>
          <section className="space-y-3">
            <h3 className="font-semibold">Milestone reflections</h3>
            <p>Reflections are private. <Link className="underline" to={appRoutes.profile + "#profile-skills"}>Review your skill reports in Profile</Link>.</p>
            {data.reflections.map((item) => (
              <div className="space-y-2 border-t pt-2" id={"reflection-" + item.milestone_id} key={item.milestone_id} tabIndex={-1}>
                <h4 className="font-semibold">{item.title}{item.retired && " (retired)"}</h4>
                {item.complete && item.understood === null && <p>You finished this milestone. Take a moment to reflect if you like.</p>}
                {item.understood && editor?.milestoneId !== item.milestone_id && <p className="whitespace-pre-wrap break-words">{item.understood}</p>}
                {item.practise && editor?.milestoneId !== item.milestone_id && <p className="whitespace-pre-wrap break-words">{item.practise}</p>}
                {reflection(item)}
              </div>
            ))}
          </section>
        </>}
      </>}
    </Card>
  );
}
