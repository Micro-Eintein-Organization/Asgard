import { useScreenContext } from "@/features/counselor-context";
import { WorkExamples, LearningExamples } from "./exploration";
import { useState } from "react";
import { ArrowLeft, ArrowRightLeft, Banknote, BookOpen, BriefcaseBusiness, ClipboardList, GitCompareArrows, NotebookPen } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router";
import { Card } from "@/components/ui/card";
import { PageHeading } from "@/components/shared";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { OccupationalProfile } from "@/features/competencies/occupational-profile";
import { experienceLabel } from "@/features/competencies/levels";
import { Button } from "@/components/ui/button";
import { ComparisonCitations, ComparisonInsight, useComparisonInsight } from "@/features/ai-guidance";
import { SharedPractice } from "./shared-practice";
import { SavedCareerEditor } from "./saved-career";
import { EscoCareerSources } from "@/features/catalog/esco";
import { PhilippineSalaryComparison, PhilippineSalarySources } from "./ph-salary";

const comparisonSections = [
  { id: "work", title: "What each career does", description: "Compare the activities, outputs and checks in each role.", icon: BriefcaseBusiness },
  { id: "salary", title: "Philippine salary comparison", description: "Get a rough idea of starting pay in each career, in pesos per month.", icon: Banknote },
  { id: "shared", title: "Shared work and skills", description: "See how the work connects and try a practice activity.", icon: GitCompareArrows },
  { id: "learning", title: "What you could start learning", description: "Explore a first step in either learning path.", icon: BookOpen },
  { id: "experience", title: "Experience you’ve reported", description: "Revisit what you have recorded for each career.", icon: ClipboardList },
  { id: "notes", title: "Saved careers and personal notes", description: "Keep an alternative and a private note about your choice.", icon: NotebookPen },
] as const;

function CareerPairForm({
  left,
  right,
  submit,
}: {
  left: string;
  right: string;
  submit: (left: string, right: string) => void;
}) {
  const [first, setFirst] = useState(left);
  const [second, setSecond] = useState(right);
  const catalog = useCoreQuery(["comparison-catalog"], () =>
    coreApi.catalog({ limit: 100 }),
  );
  const careers = (catalog.data?.items ?? [])
    .filter((career) => career.status === "published")
    .toSorted((a, b) => a.title.localeCompare(b.title));
  const available = (id: string) => careers.some((career) => career.id === id);
  const canSubmit = first !== second && available(first) && available(second);
  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) submit(first, second);
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
        {[
          { name: "First career", value: first, other: second, set: setFirst },
          {
            name: "Second career",
            value: second,
            other: first,
            set: setSecond,
          },
        ].map((field) => (
          <label
            key={field.name}
            className="flex min-w-0 flex-col gap-1 sm:flex-1"
          >
            {field.name}
            <select
              className="min-h-11 w-full rounded-md border bg-background px-3"
              value={field.value}
              onChange={(event) => field.set(event.target.value)}
              disabled={!catalog.data}
            >
              <option value="">Choose a career</option>
              {field.value && !available(field.value) && (
                <option value={field.value} disabled>
                  {catalog.data ? "Career unavailable" : "Loading career…"}
                </option>
              )}
              {careers.map((career) => (
                <option
                  key={career.id}
                  value={career.id}
                  disabled={career.id === field.other}
                >
                  {career.title}
                </option>
              ))}
            </select>
          </label>
        ))}
        <Button type="submit" disabled={!canSubmit}>
          <ArrowRightLeft className="size-4" aria-hidden="true" />
          Compare careers
        </Button>
      </div>
      {catalog.isPending && <p role="status">Loading careers…</p>}
      {catalog.error && (
        <p role="alert">
          Career choices are unavailable.{" "}
          <Button
            type="button"
            variant="outline"
            onClick={() => void catalog.refetch()}
          >
            Reload careers
          </Button>
        </p>
      )}
      {catalog.data &&
        ((first && !available(first)) || (second && !available(second))) && (
          <p role="status">
            A selected career is unavailable. Choose a replacement.
          </p>
        )}
    </form>
  );
}

export function CareerComparisonPage() {
  const [params, setParams] = useSearchParams();
  const left = params.get("left") ?? "",
    right = params.get("right") ?? "";
  const valid =
    /^[a-f0-9-]{36}$/i.test(left) &&
    /^[a-f0-9-]{36}$/i.test(right) &&
    left !== right;
  const query = useCoreQuery(
    ["career-comparison", left, right],
    (signal) => coreApi.compareCareers(left, right, signal),
    valid,
  );
  const insight = useComparisonInsight(left, right, valid && !!query.data && !query.error);
  useScreenContext({ label: query.data ? query.data.careers.map(item => item.career.title).join(" versus ") : "Compare careers", career_ids: valid ? [left, right] : [], comparison_context_id: insight?.data?.context_id ?? undefined });
  return (
    <section className="space-y-6">
      <PageHeading
        title="Compare careers"
        description="Compare the work, Philippine salary references, shared skills and first learning steps."
      />
      <Link className="inline-flex min-h-11 items-center gap-2 underline underline-offset-4" to="/careers">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to career catalog
      </Link>
      <Card className="gap-3 p-5 shadow-none">
        <h2 className="font-semibold">Choose two careers</h2>
        <CareerPairForm
        key={`${left}|${right}`}
        left={left}
        right={right}
        submit={(left, right) => setParams({ left, right })}
        />
      </Card>

      {!valid ? (
        params.has("left") || params.has("right") ? (
          <p role="alert">Choose two different published careers.</p>
        ) : null
      ) : query.error ? (
        <p role="alert">
          Comparison unavailable. Choose another career above or retry.{" "}
          <Button variant="outline" onClick={() => void query.refetch()}>
            Retry comparison
          </Button>
        </p>
      ) : query.isPending ? (
        <p role="status">Loading your comparison…</p>
      ) : (
        <>
          {query.data && (
            <div className="space-y-8">
              <nav aria-label="Comparison sections" className="flex flex-wrap gap-x-5 gap-y-1 border-y py-2 text-sm">
                {comparisonSections.map(({ id, title }) => (
                  <a key={id} href={`#compare-${id}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{title}</a>
                ))}
              </nav>
              <div className="grid gap-4 md:grid-cols-2">
                {query.data.careers.map(({ career }) => (
                  <Card key={career.id} className="min-w-0 gap-2 border-t-4 border-t-primary p-5 shadow-none">
                    <h2 className="text-2xl font-semibold">{career.title}</h2>
                    <Link className="underline" to={`/roadmaps/${career.id}`}>
                      Explore roadmap
                    </Link>
                  </Card>
                ))}
              </div>
              {comparisonSections.map(
                ({ id: section, title, description, icon: Icon }) => (
                    <section key={section} id={`compare-${section}`} aria-labelledby={`compare-${section}-heading`} className="scroll-mt-28 space-y-4">
                      <div className="space-y-1">
                        <h2 id={`compare-${section}-heading`} className="flex items-center gap-2 text-xl font-semibold">
                          <Icon className="size-5 shrink-0" aria-hidden="true" />
                          {title}
                        </h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                      </div>
                      {section === "salary" ? (
                        <PhilippineSalaryComparison careers={query.data!.careers.map(({ career }) => career)} />
                      ) : section === "shared" ? (
                        <div className="space-y-4">
                          <ComparisonInsight insight={insight} careers={query.data!.careers.map(({ career }) => career)} />
                          <SharedPractice careers={query.data!.careers} />
                        </div>
                      ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {query.data!.careers.map((column) => (
                          <Card
                            key={column.career.id}
                            className="min-w-0 gap-3 p-5 shadow-none"
                          >
                            <h3 className="font-semibold">
                              {column.career.title}
                            </h3>
                            {section === "work" &&
                              (column.career.exploration ? (
                                <WorkExamples
                                  guide={column.career.exploration}
                                />
                              ) : (
                                <p>{column.career.description}</p>
                              ))}
                            {section === "experience" && (
                              <>
                                {column.experience.some(
                                  (skill) => skill.recorded,
                                ) ? (
                                  <ul className="space-y-2">
                                    {column.experience
                                      .filter((skill) => skill.recorded)
                                      .map((skill) => (
                                        <li key={skill.id}>
                                          {skill.explanation?.question ??
                                            skill.label}
                                          <span className="block text-sm">
                                            {experienceLabel(true, skill.level)}
                                          </span>
                                        </li>
                                      ))}
                                  </ul>
                                ) : (
                                  <p>
                                    You haven’t recorded experience for this
                                    learning path.
                                  </p>
                                )}
                              </>
                            )}
                            {section === "learning" &&
                              (column.career.exploration ? (
                                <LearningExamples
                                  guide={column.career.exploration}
                                  careerId={column.career.id}
                                />
                              ) : (
                                <Link
                                  className="underline"
                                  to={`/roadmaps/${column.career.id}`}
                                >
                                  Browse existing curriculum
                                </Link>
                              ))}
                            {section === "notes" && (
                              <SavedCareerEditor
                                id={column.career.id}
                                title={column.career.title}
                              />
                            )}
                          </Card>
                        ))}
                      </div>
                      )}
                    </section>
                ),
              )}
            </div>
          )}
        </>
      )}
      <details className="text-sm">
        <summary className="cursor-pointer font-semibold">Sources and limitations</summary>
        <div className="mt-3 space-y-3">
          {query.data && <PhilippineSalarySources />}
          {query.data && (
            <ul className="space-y-2 pl-5 list-disc">
              {query.data.careers.map(({ career }) => (
                <li key={career.id}>
                  <Link className="underline" to={`/careers/${career.id}/sources`}>
                    {career.title} sources
                  </Link>
                  {career.exploration?.limitation && <p>{career.exploration.limitation}</p>}
                </li>
              ))}
            </ul>
          )}
          <ComparisonCitations data={insight?.data} />
          <p>Asgard combines selected occupational and skills information from these sources. Coverage varies by career.</p>
          <ul className="list-disc space-y-1 pl-5">
            <li><a className="underline" href="https://esco.ec.europa.eu/en/use-esco/download">ESCO v1.2.1</a>, European Commission.</li>
            <li><a className="underline" href="https://www.onetcenter.org/database.html">O*NET® 31.0 Database</a>, U.S. Department of Labor, Employment and Training Administration.</li>
            <li><a className="underline" href="https://psa.gov.ph/classification/psoc">Philippine Standard Occupational Classification</a>, Philippine Statistics Authority.</li>
            <li><a className="underline" href="https://www.tesda.gov.ph/Download/Training_Regulations">TESDA Training Regulations</a> for Computer Systems Servicing, Cyber Threat Monitoring, Cyber Threat Mitigation, Mobile Phones and Handheld Gadgets Servicing, Programming (.NET Technology), Programming (Java), Programming (Oracle Database), and Visual Graphic Design.</li>
            <li><a className="underline" href="https://cms-cdn.e.gov.ph/DICT/pdf/DICT_Updated%20NICS.pdf">National ICT Competency Standards</a>, Department of Information and Communications Technology.</li>
            <li><a className="underline" href="https://www.tesda.gov.ph/About/TESDA/27898">Philippine Skills Framework documents</a> for Supply Chain and Logistics, Software Development and Security, Global In-House Center, Contact Center and Business Process Management, Analytics and Artificial Intelligence, Health Information and Management, Game Development, Electronics, and Digital Art and Animation.</li>
          </ul>
          <p>This service uses the ESCO classification of the European Commission.</p>
          <p>O*NET® is a trademark of the U.S. Department of Labor, Employment and Training Administration. Asgard selected records and added its own career mappings and interpretations. USDOL/ETA has not approved, endorsed, or tested those changes.</p>
          <p>Asgard also selects and maps ESCO records to its careers. <a className="underline" href="https://esco.ec.europa.eu/en/use-esco/download/privacy-statement">ESCO reuse terms</a> · <a className="underline" href="https://www.onetcenter.org/license_db.html">O*NET database license</a></p>
        </div>
      </details>
    </section>
  );
}
export function CareerSourcesPage() {
  const { careerId = "" } = useParams();
  return (
    <section className="space-y-5">
      <PageHeading
        title="Sources and limitations"
        description="Reference details support transparency. Their native ratings are not personal proficiency targets."
      />
      <Link className="underline" to={`/roadmaps/${careerId}`}>
        Back to career
      </Link>
      <OccupationalProfile careerId={careerId} />
      <EscoCareerSources careerId={careerId} />
    </section>
  );
}
