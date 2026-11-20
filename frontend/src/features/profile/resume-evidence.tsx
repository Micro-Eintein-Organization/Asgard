import type { components } from "@/api/generated/schema";
import { coreApi, useCoreQuery } from "@/features/core/data";
import { Link } from "react-router";
import { readCareerSkillMatches } from "@/features/skill-matching/api";

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
    <ResumeApplications basis="benchmark" />
    <ResumeApplications basis="learning_path" />
  </section>;
}

function ResumeApplications({ basis }: { basis: "benchmark" | "learning_path" }) {
  const query = useCoreQuery(["career-skill-matches", basis], signal => readCareerSkillMatches(signal, basis));
  const title = basis === "benchmark" ? "Job-sample matches" : "Roadmap matches";
  if (query.isPending) return <p role="status">Loading {title.toLowerCase()}…</p>;
  if (query.error) return <p>{title} unavailable. <button type="button" className="underline" onClick={() => void query.refetch()}>Retry</button></p>;
  return <details><summary>{title}</summary>
    {query.data?.interpretation?.status !== "completed" && <p className="field-help">Interpreted wording is not current. Exact matches remain available. Update resume matches on Career skill matches.</p>}
    <Link className="underline" to="/career-skill-matches">Open career skill matches</Link>
    {query.data?.items.map(career => {
      const matches = career.skills.filter(skill => skill.resume_signals?.length || skill.interpretation_signals?.length);
      return matches.length ? <section key={career.career_id}><h4>{career.career_title}</h4><ul>
        {matches.map(skill => <li key={skill.competency_id}>{skill.label}
          <span className="field-help"> · {skill.resume_signals?.length ? "Exact resume wording" : "AI-interpreted wording"}</span>
          {[...(skill.resume_signals ?? []), ...(skill.interpretation_signals ?? [])].map((signal, index) => <details key={index}>
            <summary>Source passage · page {signal.page}</summary><blockquote>{signal.span}</blockquote>
          </details>)}
          {basis === "learning_path" && <Link className="underline" to={`/roadmaps/${career.career_id}`}>View roadmap</Link>}
          {(skill.topic_links ?? []).map(topic => <p key={topic.topic_id}><Link className="underline"
            to={`/roadmaps/${career.career_id}?roadmap=${topic.roadmap_id}&topic=${topic.topic_id}`}>{topic.title}</Link></p>)}
        </li>)}
      </ul></section> : null;
    })}
    {!query.data?.items.some(career => career.skills.some(skill => skill.resume_signals?.length || skill.interpretation_signals?.length)) &&
      <p>No supported resume matches in this view.</p>}
  </details>;
}
