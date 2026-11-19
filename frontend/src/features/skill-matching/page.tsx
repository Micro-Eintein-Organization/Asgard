import { Link } from "react-router";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatePanel } from "@/components/shared";
import { experienceLevels } from "@/features/competencies/levels";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { readCareerSkillMatches } from "./api";

const statusLabels = {
  MATCHED: "Matched",
  UNKNOWN: "Not sure",
  MISSING: "No evidence recorded",
} as const;

export default function SkillMatchingPage() {
  const [basis, setBasis] = useState<"benchmark" | "learning_path">("benchmark");
  return <Tabs value={basis} onValueChange={value => setBasis(value as typeof basis)}>
    <TabsList aria-label="Skill comparison basis">
      <TabsTrigger value="benchmark">Job-sample skills</TabsTrigger>
      <TabsTrigger value="learning_path">Roadmap skills</TabsTrigger>
    </TabsList>
    <TabsContent value={basis}>
      <SkillMatchingResults key={basis} basis={basis} />
    </TabsContent>
  </Tabs>;
}

function SkillMatchingResults({ basis }: { basis: "benchmark" | "learning_path" }) {
  const query = useCoreQuery(["career-skill-matches", basis], signal => readCareerSkillMatches(signal, basis));
  const update = useCoreMutation(coreApi.interpretResume, { clearSkillEvidence: true });
  const interpretation = query.data?.interpretation;
  const { refetch } = query;
  useEffect(() => {
    if (interpretation?.status !== "pending") return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (Date.now() - started >= 65_000) window.clearInterval(timer);
      else void refetch();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [interpretation?.status, refetch]);

  if (query.isPending)
    return (
      <StatePanel kind="loading" title="Loading career skill matches">
        Reading your saved skills and most recent resume evidence.
      </StatePanel>
    );

  if (query.isError || !query.data)
    return (
      <StatePanel
        kind="error"
        title="Career skill matches unavailable"
        action={<Button onClick={() => void query.refetch()}>Try again</Button>}
      >
        {query.error?.message ?? "Career skill matches could not be loaded."}
      </StatePanel>
    );

  const { source, source_version, postings_sample_label } = query.data;
  const items = [...query.data.items].sort((a, b) =>
    (b.evidence_count ?? b.matched_skill_count) - (a.evidence_count ?? a.matched_skill_count)
      || a.career_title.localeCompare(b.career_title) || a.career_id.localeCompare(b.career_id));
  const hasMatchedOrUnknown = items.some(career =>
    career.skills.some(skill => skill.evidence_found || skill.status === "MATCHED" || skill.status === "UNKNOWN"),
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1>Career skill matches</h1>
        <p className="field-help">Find which career skills have evidence in your records. Counts are not proficiency scores or career recommendations.</p>
        <p className="field-help">{basis === "benchmark"
          ? "Compare your reported and resume skills with skills collected from example job postings."
          : "Compare your reported skills, resume and completed lessons with skills linked to each roadmap."}</p>
        <p className="field-help">
          Source: {source}{source_version !== null ? ` (version ${source_version})` : ""}
        </p>
      </header>
      {interpretation?.status === "no_resume" && <p className="field-help">Analyze a resume in Profile to add resume evidence. Manual skills and completed learning remain usable.</p>}
      {interpretation && !["completed", "no_resume"].includes(interpretation.status) && <p role="status" className="field-help">
        {interpretation.status === "pending" ? "Interpreting resume wording…" : "Automatic resume interpretation is not current. Exact matches remain available."}
      </p>}
      {interpretation?.document_id && <Button variant="outline"
        disabled={update.isPending || interpretation.status === "pending" || interpretation.status === "unavailable"}
        onClick={() => update.mutate(interpretation.document_id!)}>
        {update.isPending ? "Updating resume matches…" : "Update resume matches"}
      </Button>}
      {update.error && <p role="alert">{update.error.message}</p>}

      {items.length === 0 ? (
        <StatePanel
          kind="empty"
          title="No careers available to compare"
          action={
            <Button asChild variant="outline">
              <Link to={appRoutes.profile}>Open profile settings</Link>
            </Button>
          }
        >
          No careers are available to compare yet.
        </StatePanel>
      ) : (
        <>
          {!hasMatchedOrUnknown && (
            <p role="status" className="field-help">
              No supporting evidence has been recorded for these career skills yet. This does not mean you lack the ability to learn them. {" "}
              <Link className="underline" to={appRoutes.profile}>Go to your profile to add skills</Link>.
            </p>
          )}

          <p className="field-help">
            Each skill counts once, even with several sources. Completed lessons record learning activity and do not assign an experience rating.
          </p>

          <section aria-label="Career skill evidence" className="space-y-4">
            {items.map(career => (
              <Card key={career.career_id} className="settings-card p-0">
                <details>
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-5">
                    <span className="font-semibold">{career.career_title}</span>
                    <span>
                      {career.benchmark_skill_count === 0
                        ? "No skills listed for comparison"
                        : `Evidence found for ${career.evidence_count ?? career.matched_skill_count} of ${career.benchmark_skill_count} skills`}
                    </span>
                    <span className="field-help w-full">{career.sample_label}</span>
                  </summary>
                  <div className="space-y-4 px-5 pb-5">
                    {career.benchmark_skill_count === 0 ? (
                      <p className="field-help">{basis === "benchmark" ? "No reviewed benchmark mappings for this career in this sample." : "This career has no linked skills yet."}</p>
                    ) : (
                      <>
                        <p className="field-help">{career.sample_note}</p>
                        <ul className="space-y-3">
                          {career.skills.map(skill => (
                            <li key={skill.competency_id} className="rounded-lg border p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className="font-medium">{skill.label}</h2>
                                <Badge variant="outline">{skill.evidence_found || skill.status === "MATCHED" ? "Evidence found" : statusLabels[skill.status]}</Badge>
                              </div>
                              {skill.reported_level !== null && (
                                <p className="field-help">
                                  Your experience: {experienceLevels[skill.reported_level]}
                                </p>
                              )}
                              {skill.user_report?.level != null && skill.user_report.level > 0 && <p className="field-help">Reported by you</p>}
                              {(skill.resume_signals?.length ?? 0) > 0 && <div className="field-help">From resume
                                {(skill.resume_signals ?? []).map((signal, index) => <details key={index}><summary>Page {signal.page} · source passage</summary><p>{signal.span}</p></details>)}
                              </div>}
                              {(skill.interpretation_signals ?? []).map((signal, index) => <details key={`ai-${index}`} className="field-help">
                                <summary>From resume · AI-interpreted wording · page {signal.page}</summary><p>{signal.text}</p><p>{signal.span}</p>
                              </details>)}
                              {(skill.learning_signals ?? []).map(signal => <p key={signal.topic_id} className="field-help">
                                Related lesson completed: <Link className="underline" to={appRoutes.roadmap(career.career_id) + `?roadmap=${signal.roadmap_id}&topic=${signal.topic_id}`}>{signal.title}</Link>
                              </p>)}
                              {skill.posting_count !== null && skill.total_postings !== null && (
                                <p className="field-help">
                                  seen in {skill.posting_count} of {skill.total_postings} {skill.total_postings === 1 ? "posting" : "postings"}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {(career.postings?.length ?? 0) > 0 && (
                      <section aria-label={`${postings_sample_label} for ${career.career_title}`} className="space-y-3">
                        <h2 className="text-lg font-semibold">{postings_sample_label}</h2>
                        <p className="field-help">
                          Curated reference postings. They may not be active vacancies and are not a comprehensive list of employer requirements.
                        </p>
                        <div className="space-y-3">
                          {career.postings?.map(posting => (
                            <article
                              key={`${posting.source}:${posting.source_version}:${posting.posting_id}`}
                              aria-label={`${posting.job_title} at ${posting.company}`}
                              className="space-y-3 rounded-lg border p-4"
                            >
                              <div className="space-y-1">
                                <h3 className="font-medium">{posting.job_title}</h3>
                                <p>{posting.company}</p>
                                <p className="field-help">Viewed: {posting.retrieved_on}</p>
                                <a
                                  className="underline"
                                  href={posting.source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View original posting
                                </a>
                              </div>
                              <ul aria-label="Collected skills" className="space-y-2">
                                {posting.skills.map((postingSkill, index) => (
                                  <li key={`${postingSkill.label}-${index}`}>
                                    <span>{postingSkill.label}</span>
                                    {postingSkill.resume_match !== null && (
                                      <p className="field-help">
                                        In your resume: {postingSkill.resume_match.matched_phrase}
                                        {postingSkill.resume_match.pages.length > 0 && (
                                          <> ({postingSkill.resume_match.pages.length === 1 ? "page" : "pages"} {postingSkill.resume_match.pages.join(", ")})</>
                                        )}
                                      </p>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </article>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </details>
              </Card>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
