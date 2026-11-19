import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatePanel } from "@/components/shared";
import { experienceLevels } from "@/features/competencies/levels";
import { useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { readCareerSkillMatches } from "./api";

const statusLabels = {
  MATCHED: "Matched",
  UNKNOWN: "Unknown",
  MISSING: "Missing",
} as const;

export default function SkillMatchingPage() {
  const query = useCoreQuery(["career-skill-matches"], readCareerSkillMatches);

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

  const { items, source, source_version, postings_sample_label } = query.data;
  const hasMatchedOrUnknown = items.some(career =>
    career.skills.some(skill => skill.status === "MATCHED" || skill.status === "UNKNOWN"),
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1>Career skill matches</h1>
        <p className="field-help">Based on your saved skills and your most recent resume.</p>
        <p className="field-help">
          Source: {source}{source_version !== null ? ` (version ${source_version})` : ""}
        </p>
      </header>

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
              None of your saved skills or resume mentions match the skills in these careers yet. {" "}
              <Link className="underline" to={appRoutes.profile}>Go to your profile to add skills</Link>.
            </p>
          )}

          <p className="field-help">
            Matched = you reported at least ‘Familiar with concepts’, or your resume mentions it. Unknown = ‘Not sure yet’. Missing = no record or ‘No experience reported’.
          </p>

          <section aria-label="Ranked career skill matches" className="space-y-4">
            {items.map(career => (
              <Card key={career.career_id} className="settings-card p-0">
                <details>
                  <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 p-5">
                    <span className="font-semibold">{career.rank}. {career.career_title}</span>
                    <span>
                      {career.benchmark_skill_count === 0
                        ? "No skill mapping yet"
                        : career.display_count}
                    </span>
                    <span className="field-help w-full">{career.sample_label}</span>
                  </summary>
                  <div className="space-y-4 px-5 pb-5">
                    {career.benchmark_skill_count === 0 ? (
                      <p className="field-help">This career has no linked skills yet.</p>
                    ) : (
                      <>
                        <p className="field-help">{career.sample_note}</p>
                        <ul className="space-y-3">
                          {career.skills.map(skill => (
                            <li key={skill.competency_id} className="rounded-lg border p-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <h2 className="font-medium">{skill.label}</h2>
                                <Badge variant="outline">{statusLabels[skill.status]}</Badge>
                              </div>
                              {skill.reported_level !== null && (
                                <p className="field-help">
                                  Your experience: {experienceLevels[skill.reported_level]}
                                </p>
                              )}
                              {skill.status === "MATCHED" && (skill.resume_signals?.length ?? 0) > 0 && (
                                <p className="field-help">from resume</p>
                              )}
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
