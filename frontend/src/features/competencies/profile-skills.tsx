import { useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { experienceLabel, experienceLevels } from "./levels";
import { ResumeSkillReview } from "./resume-skill-review";
import { Link } from "react-router";
import { appRoutes } from "@/lib/routes";
import { SavedResumeSkills } from "@/features/profile/resume-evidence";

type Draft = { id: string; label: string; level: string; version: number; example?: string };
const skillPageSize = 8;

export function ProfileSkills({
  onGuardChange,
  documents,
  active = true,
  reviewCareer,
  reviewRoadmap,
}: {
  onGuardChange: (dirty: boolean, pending: boolean) => void;
  documents?: ReactNode;
  active?: boolean;
  reviewCareer?: string;
  reviewRoadmap?: string;
}) {
  const { user } = useAuth();
  const [careerId, setCareerId] = useState("");
  const careers = useCoreQuery(["experience-careers"], () =>
    coreApi.catalog({ limit: 100 }),
  );
  const resumeCareer = reviewCareer && reviewRoadmap
    ? careers.data?.items.find(item =>
        item.id === reviewCareer && item.roadmap_ids.includes(reviewRoadmap),
      )
    : undefined;
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [offset, setOffset] = useState(0);
  const [draft, setDraft] = useState<Draft | null>(null);
  const resumeFocus = useRef(false);
  const levelInput = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (draft && resumeFocus.current) {
      levelInput.current?.focus();
      resumeFocus.current = false;
    }
  }, [draft]);
  const [feedback, setFeedback] = useState("");
  const saved = useCoreQuery(["skills"], coreApi.myCompetencies);
  const available = useCoreQuery(
    ["skill-search", search, offset, careerId],
    () =>
      coreApi.competencies({
        q: search,
        offset,
        limit: skillPageSize,
        career_id: careerId || undefined,
      }),
    adding && !draft && Boolean(search.trim() || careerId),
  );
  const save = useCoreMutation(coreApi.saveCompetency, {
    clearSuggestions: ({ id }) =>
      !!saved.data?.recommendations_enabled &&
      !!saved.data.items.some((item) => item.competency_id === id),
  });
  const catalogAvailability = useCoreQuery(
    ["skill-catalog-availability"],
    () => coreApi.competencies({ limit: 1 }),
    adding && available.data?.total === 0 && Boolean(search.trim() || careerId),
  );
  const remove = useCoreMutation(coreApi.removeCompetency, {
    clearSuggestions: () => !!saved.data?.recommendations_enabled,
  });
  const pending = save.isPending || remove.isPending;
  const error = saved.error ?? (adding ? available.error : null) ?? save.error ?? remove.error;
  useEffect(() => {
    onGuardChange(draft !== null, pending);
  }, [draft, pending, onGuardChange]);
  useEffect(() => () => onGuardChange(false, false), [onGuardChange]);
  function edit(id: string, label: string, level: number | null, example?: string) {
    if (!saved.data) return;
    setDraft({
      id,
      label,
      level: level === null ? "" : String(level),
      version: saved.data.version,
      example,
    });
    setFeedback("");
    save.reset();
    remove.reset();
  }
  async function persist(removing = false) {
    if (!draft || !user || pending) return;
    const owner = user.id;
    try {
      if (removing)
        await remove.mutateAsync({
          id: draft.id,
          body: { expected_version: draft.version },
        });
      else
        await save.mutateAsync({
          id: draft.id,
          body: {
            expected_version: draft.version,
            level: draft.level === "" ? null : Number(draft.level),
          },
        });
      if (isCurrentAccount(owner)) {
        setDraft(null);
        setAdding(false);
        setFeedback(removing ? "Skill removed." : "Skill saved.");
      }
    } catch {
      /* Keep the draft and display the mutation's sanitized error. */
    }
  }
  return (
    <>
    <Card className="settings-card" id="resume-skill-review" tabIndex={-1}>
      <header><h2>Academic profile &amp; document management</h2><p>Review skills from a resume or add your experience below.</p></header>
      {documents}
      <details>
      <summary>Review career-linked skills without storing a resume</summary>
      <ResumeSkillReview
        key={`${user?.id}:${resumeCareer?.id ?? ""}`}
        initialCareer={resumeCareer?.id}
        active={active}
        careers={careers.data?.items ?? []}
        disabled={pending || draft !== null}
        onReview={(item) => {
          const existing = saved.data?.items.find((skill) => skill.competency_id === item.skill_id);
          return <>
            {existing && <p>Saved experience: {experienceLabel(true, existing.level)}</p>}
            <Button type="button" variant="outline" disabled={!saved.data || pending || draft !== null}
              onClick={() => {
                resumeFocus.current = true;
                edit(item.skill_id, item.label, existing?.level ?? null);
              }}>
              {existing ? "Edit" : "Add"} {item.label}
            </Button>
          </>;
        }}
      />
      </details>
      {resumeCareer && reviewRoadmap && (
        <Link className="underline" to={appRoutes.skillComparison(resumeCareer.id, reviewRoadmap)}>
          Return to skill comparison
        </Link>
      )}
    </Card>
    <Card className="settings-card" id="profile-skills" tabIndex={-1}>
      <header className="settings-section-heading">
        <h2>Skills</h2>
        {!draft && <Button type="button" variant="outline" aria-expanded={adding}
          onClick={() => setAdding(!adding)}>
          {adding ? "Close skill search" : "Add a skill"}
        </Button>}
      </header>
      <details>
        <summary>How saved experience affects suggestions</summary>
        <p>
          {saved.data?.recommendations_enabled
            ? "Suggestions consider experience alongside your interests and goals. Adding a report makes suggestions outdated. Editing or removing a report erases affected suggestions. Generate replacements when ready."
            : "Suggestions are not currently connected to saved experience."}{" "}
          Learning progress stays separate.
        </p>
      </details>
      {saved.isPending && <p role="status">Loading your skills…</p>}
      {error && (
        <div role="alert" className="field-error">
          <p>{error.message}</p>
          <Button
            variant="outline"
            disabled={pending}
            onClick={async () => {
              if (
                draft &&
                !window.confirm("Discard skill edits and reload saved skills?")
              )
                return;
              setDraft(null);
              save.reset();
              remove.reset();
              await saved.refetch();
              if (adding && (search.trim() || careerId)) await available.refetch();
            }}
          >
            Reload skills
          </Button>
        </div>
      )}
      {feedback && <p role="status">{feedback}</p>}
      <SavedResumeSkills />
      {saved.data && !saved.data.items.length && (
        <p>No confirmed skill reports yet. Adding a skill is optional.</p>
      )}
      {!adding && !draft && !!saved.data?.items.length && <details>
      <summary>Saved skills ({saved.data.items.length})</summary>
      <ul className="settings-skill-list">
        {saved.data?.items
          .toSorted(
            (a, b) =>
              (
                a.career_context?.[0]?.title ?? "Other saved experience"
              ).localeCompare(
                b.career_context?.[0]?.title ?? "Other saved experience",
              ) || a.label.localeCompare(b.label),
          )
          .map((item, index, items) => (
            <li
              key={item.competency_id}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              {(!index ||
                items[index - 1].career_context?.[0]?.career_id !==
                  item.career_context?.[0]?.career_id) && (
                <h3 className="w-full font-semibold">
                  {item.career_context
                    ?.map((context) => context.title)
                    .join(" / ") || "Other saved experience"}
                </h3>
              )}
              <span className="min-w-0 break-words">
                {item.label}
                <span className="block text-sm">
                  {experienceLabel(true, item.level)}
                </span>
              </span>
              <Button
                variant="outline"
                disabled={pending || draft !== null}
                aria-label={"Edit " + item.label}
                onClick={() => edit(item.competency_id, item.label, item.level, item.explanation?.example)}
              >
                Edit
              </Button>
            </li>
          ))}
      </ul>
      </details>}
      {draft ? (
        <form
          className="form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            void persist();
          }}
        >
          <h3>{draft.label}</h3>
          {draft.example && <p className="field-help">{draft.example}</p>}
          <label htmlFor="skill-experience">Your experience</label>
          <select
            id="skill-experience"
            ref={levelInput}
            className="w-full rounded-md border p-2"
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
          <div className="action-row">
            <Button disabled={pending} type="submit">
              {save.isPending ? "Saving…" : "Save skill"}
            </Button>
            {saved.data?.items.some(
              (item) => item.competency_id === draft.id,
            ) && (
              <Button
                variant="outline"
                disabled={pending}
                type="button"
                onClick={() => {
                  if (
                    window.confirm("Remove this skill and its current rating?")
                  )
                    void persist(true);
                }}
              >
                Remove skill
              </Button>
            )}
            <Button
              variant="outline"
              disabled={pending}
              type="button"
              onClick={() => {
                setDraft(null);
                save.reset();
                remove.reset();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : adding && (
        <div className="form-grid">
          <label htmlFor="skill-search">Find a skill</label>
          <Input id="skill-search" value={search} placeholder="Search by skill name"
            onChange={(event) => { setSearch(event.target.value); setOffset(0); }} />
          <details open={careerId ? true : undefined}>
          <summary>Filter by learning path</summary>
          <label htmlFor="skill-career">Learning path</label>
          <select
            id="skill-career"
            className="w-full rounded-md border p-2"
            value={careerId}
            onChange={(event) => {
              setCareerId(event.target.value);
              setOffset(0);
            }}
          >
            <option value="">All learning paths</option>
            {careers.data?.items.map((career) => (
              <option key={career.id} value={career.id}>
                {career.title}
              </option>
            ))}
          </select>
          {careers.error && (
            <p role="alert">
              Learning path filters are unavailable. You can still search all
              skills.
            </p>
          )}
          </details>
          {!search.trim() && !careerId && <p className="field-help">Search by name or choose a learning path to browse.</p>}
          {(search.trim() || careerId) && available.isPending && <p role="status">Searching skills…</p>}
          {(search.trim() || careerId) && available.data && !available.data.total && (
            <p>
              {catalogAvailability.data?.total === 0
                ? "The published skill catalog is empty. An administrator needs to publish the skill definitions before search is available."
                : search
                ? "No published skills match this search."
                : "Skill mappings are awaiting content review and publication."}
            </p>
          )}
          <ul className="settings-skill-list">
            {(search.trim() || careerId) && available.data?.items
              .filter(
                (item) =>
                  !saved.data?.items.some(
                    (record) => record.competency_id === item.id,
                  ),
              )
              .map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2"
                >
                  <span className="min-w-0 break-words">
                    {item.label}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!saved.data || pending}
                    aria-label={"Add " + item.label}
                    onClick={() => edit(item.id, item.label, null, item.explanation?.example)}
                  >
                    Add
                  </Button>
                </li>
              ))}
          </ul>
          {(search.trim() || careerId) && available.data && available.data.total > skillPageSize && (
            <div className="action-row">
              <Button
                variant="outline"
                disabled={!offset}
                onClick={() => setOffset(Math.max(0, offset - skillPageSize))}
              >
                Previous skills
              </Button>
              <Button
                variant="outline"
                disabled={offset + skillPageSize >= available.data.total}
                onClick={() => setOffset(offset + skillPageSize)}
              >
                Next skills
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
    </>
  );
}
