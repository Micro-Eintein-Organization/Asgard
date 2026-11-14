import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { experienceLevels, experienceLabel } from "./levels";

export function SkillComparison({ careerId, roadmapId, initiallyOpen = false }: {
  careerId: string;
  roadmapId?: string;
  initiallyOpen?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [draft, setDraft] = useState<{
    id: string;
    level: string;
    version: number;
    recorded: boolean;
  } | null>(null);
  const [feedback, setFeedback] = useState("");
  const save = useCoreMutation(coreApi.saveCompetency, {
    clearSuggestions: () => !!draft?.recorded,
  });
  const remove = useCoreMutation(coreApi.removeCompetency, {
    clearSuggestions: () => true,
  });
  const pending = save.isPending || remove.isPending;
  const query = useCoreQuery(
    ["skill-comparison", careerId],
    () => coreApi.competencyComparison(careerId),
    open,
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        if (
          !next &&
          draft &&
          !window.confirm("Discard your unsaved experience edit?")
        )
          return;
        setOpen(next);
        if (!next) setDraft(null);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="text-foreground">
          Review your experience
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="pr-12">
          <DialogTitle>Your experience with this learning path</DialogTitle>
          <DialogDescription>
            Recording experience is optional. These skills describe what you can
            practise here, not requirements you must already meet.
          </DialogDescription>
        </DialogHeader>
        {query.isPending && <p role="status">Loading comparison…</p>}
        {query.error && (
          <div role="alert">
            <p>{query.error.message}</p>
            <Button variant="outline" onClick={() => void query.refetch()}>
              Reload comparison
            </Button>
          </div>
        )}
        {query.data && !query.data.items.length && (
          <p>Reviewed skill mappings are not available for this career yet.</p>
        )}
        <ul className="space-y-5">
          {query.data?.items
            .toSorted(
              (a, b) =>
                (a.explanation?.group ?? "").localeCompare(
                  b.explanation?.group ?? "",
                ) || a.label.localeCompare(b.label),
            )
            .map((item, index, items) => (
              <li key={item.id}>
                {(!index ||
                  items[index - 1].explanation?.group !==
                    item.explanation?.group) && (
                  <h3 className="font-semibold pt-4">
                    {item.explanation?.group ?? "Learning-path experience"}
                  </h3>
                )}
                <h4 className="font-semibold break-words">
                  {item.explanation?.question ?? item.label}
                </h4>
                {item.explanation && (
                  <>
                    <p>{item.explanation.example}</p>
                    <p className="text-sm">Skill: {item.label}</p>
                    <details>
                      <summary>Why this matters here</summary>
                      <p>{item.explanation.why_it_matters}</p>
                    </details>
                  </>
                )}
                <p>{experienceLabel(item.recorded, item.level)}</p>
                <Button
                  variant="outline"
                  disabled={pending || draft !== null}
                  aria-label={`${item.recorded ? "Edit" : "Add"} experience: ${item.label}`}
                  onClick={() => {
                    save.reset();
                    remove.reset();
                    setFeedback("");
                    setDraft({
                      id: item.id,
                      level: item.level == null ? "" : String(item.level),
                      version: query.data!.account_version,
                      recorded: item.recorded,
                    });
                  }}
                >
                  {item.recorded ? "Edit experience" : "Add experience"}
                </Button>
                {item.topics.length ? (
                  <ul>
                    {item.topics.map((topic) => (
                      <li key={topic.topic_id}>
                        <Link
                          onClick={(event) => {
                            if (
                              pending ||
                              (draft &&
                                !window.confirm(
                                  "Discard your unsaved experience edit?",
                                ))
                            )
                              event.preventDefault();
                          }}
                          className="underline"
                          to={
                            appRoutes.roadmap(careerId) +
                            `?roadmap=${topic.roadmap_id}&topic=${topic.topic_id}`
                          }
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No reviewed learning topic is linked yet.</p>
                )}
                {draft?.id === item.id && (
                  <form
                    className="space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void save
                        .mutateAsync({
                          id: draft.id,
                          body: {
                            expected_version: draft.version,
                            level:
                              draft.level === "" ? null : Number(draft.level),
                          },
                        })
                        .then(() => {
                          setDraft(null);
                          setFeedback(
                            "Experience saved. Review suggestions to use your current reports.",
                          );
                        })
                        .catch(() => {});
                    }}
                  >
                    <h3 className="font-semibold">
                      {
                        query.data?.items.find((item) => item.id === draft.id)
                          ?.label
                      }
                    </h3>
                    <label htmlFor="inline-experience">Your experience</label>
                    <select
                      autoFocus
                      id="inline-experience"
                      className="block w-full border rounded-md p-2"
                      disabled={pending}
                      value={draft.level}
                      onChange={(event) =>
                        setDraft({ ...draft, level: event.target.value })
                      }
                    >
                      <option value="">Not sure yet</option>
                      {experienceLevels.map((label, level) => (
                        <option key={level} value={level}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                      <Button disabled={pending}>Save experience</Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={pending}
                        onClick={() => setDraft(null)}
                      >
                        Cancel edit
                      </Button>
                      {draft.recorded && (
                        <Button
                          type="button"
                          variant="outline"
                          disabled={pending}
                          onClick={() => {
                            void remove
                              .mutateAsync({
                                id: draft.id,
                                body: { expected_version: draft.version },
                              })
                              .then(() => {
                                setDraft(null);
                                setFeedback(
                                  "Experience removed. Affected suggestions have been cleared.",
                                );
                              })
                              .catch(() => {});
                          }}
                        >
                          Remove report
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </li>
            ))}
        </ul>
        {(save.error || remove.error) && (
          <p role="alert">
            {save.error?.message ?? remove.error?.message} Cancel your edit and
            reload before retrying.
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => {
                setDraft(null);
                save.reset();
                remove.reset();
                void query.refetch();
              }}
            >
              Reload experience
            </Button>
          </p>
        )}
        {feedback && (
          <p role="status">
            {feedback}{" "}
            <Link className="underline" to={appRoutes.results}>
              Review suggestions
            </Link>
          </p>
        )}
        <p className="text-sm">
          Experience is matched to skills in this learning path. Occupational
          sources describe work; their ratings are not personal targets.
        </p>
        <Link className="underline" to={`/careers/${careerId}/sources`}>
          Sources and limitations
        </Link>
        <Link className="underline" to={appRoutes.profile + "#profile-skills"}>
          Manage all experience in Profile
        </Link>
        {roadmapId && (
          <Link
            className="block underline"
            to={appRoutes.resumeReview(careerId, roadmapId)}
            onClick={(event) => {
              if (pending || (draft && !window.confirm("Discard your unsaved experience edit?")))
                event.preventDefault();
            }}
          >
            Review skills from a resume
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
}
