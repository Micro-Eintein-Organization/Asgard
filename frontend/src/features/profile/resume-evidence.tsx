import type { components } from "@/api/generated/schema";
import { coreApi, useCoreQuery } from "@/features/core/data";

type Evidence = components["schemas"]["DocumentEvidence"];
const categories = [
  ["skill", "Skills from resume"],
  ["experience", "Work experience from resume"],
  ["education", "Education from resume"],
  ["project", "Projects from resume"],
] as const;

export function ResumeEvidence({ evidence, skillsOnly = false }: {
  evidence: Evidence[];
  skillsOnly?: boolean;
}) {
  return <div className="resume-evidence">
    {categories.filter(([kind]) => !skillsOnly || kind === "skill").map(([kind, title]) => {
      const items = evidence.filter(item => item.kind === kind);
      return <section key={kind} aria-label={title}>
        <table className="resume-evidence-table">
          <caption>{title}</caption>
          <thead><tr><th scope="col">Extracted background</th><th scope="col">Source</th></tr></thead>
          <tbody>{items.length ? items.map((item, index) => <tr key={index}>
            <td>{item.text}</td>
            <td><details><summary>Page {item.page}</summary>
              <blockquote>{item.span}</blockquote>
            </details></td>
          </tr>) : <tr><td colSpan={2}>No supported {kind === "experience" ? "work experience" : kind === "skill" ? "skills" : kind === "project" ? "projects" : "education"} found in this resume.</td></tr>}</tbody>
        </table>
      </section>;
    })}
  </div>;
}

export function SavedResumeSkills() {
  const query = useCoreQuery(["documents"], coreApi.documents);
  if (query.isPending) return <p role="status">Loading resume skills…</p>;
  if (query.error) return <p role="alert">Resume skills could not be loaded. <button type="button" onClick={() => void query.refetch()}>Reload resume skills</button></p>;
  if (!query.data?.active) return null;
  return <section className="resume-saved-skills" aria-label="From resume">
    <h3>From resume</h3>
    <p className="field-help">Saved automatically from your latest successful analysis. These resume claims have no experience rating; your confirmed skill reports stay separate.</p>
    <ResumeEvidence evidence={query.data.active.evidence} skillsOnly />
  </section>;
}
