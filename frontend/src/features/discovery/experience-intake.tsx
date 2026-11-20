import { useCallback, useState } from "react";
import { NaturalLanguageSkills } from "@/features/competencies/natural-language-skills";
import { ProfileDocuments } from "@/features/profile/documents";
import { coreApi, useCoreQuery, useCoreMutation } from "@/features/core/data";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquareText } from "lucide-react";

export function ExperienceIntake({ onGuardChange }: { onGuardChange: (dirty: boolean, pending: boolean) => void }) {
  const [tab, setTab] = useState<"skills" | "resume">("skills");
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const skills = useCoreQuery(["skills"], coreApi.myCompetencies);
  const [search, setSearch] = useState("");
  const matches = useCoreQuery(["discovery-skill-search", search], () => coreApi.competencies({ q: search, limit: 8 }), search.trim().length > 1);
  const save = useCoreMutation(coreApi.confirmSkills, { clearSkillEvidence: true, clearSuggestions: () => true });
  const guard = useCallback((dirty: boolean, pending: boolean) => { setDirty(dirty); setBusy(pending); onGuardChange(dirty, pending); }, [onGuardChange]);
  function changeTab(next: "skills" | "resume") {
    if (busy || next === tab) return;
    if (dirty && !window.confirm("Discard unsaved experience input and change input method?")) return;
    setTab(next);
  }
  return <section className="discovery-intake" aria-label="Your experience">
    <h2>Bring your experience into Discovery</h2>
    <p>Describe work you have done or analyze a resume. Save at least one skill or a successful resume analysis before continuing.</p>
    {skills.error && <p role="alert">Saved skills are unavailable: {skills.error.message} You can choose Start with the basics to continue exploring.</p>}
    {!!skills.data?.items.length && <p role="status">Your saved skills are available. You can add more below.</p>}
    <div className="action-row">
      <Button disabled={busy} variant={tab === "skills" ? "default" : "outline"} aria-pressed={tab === "skills"} onClick={() => changeTab("skills")}><MessageSquareText aria-hidden="true" />Describe experience</Button>
      <Button disabled={busy} variant={tab === "resume" ? "default" : "outline"} aria-pressed={tab === "resume"} onClick={() => changeTab("resume")}><FileText aria-hidden="true" />Upload resume</Button>
    </div>
    {tab === "skills" ? <NaturalLanguageSkills saved={skills.data} onGuardChange={guard} />
      : <ProfileDocuments compact onGuardChange={guard} />}
    <details><summary>Select a skill manually</summary>
      <label htmlFor="discovery-manual-skill">Search published skills</label>
      <input id="discovery-manual-skill" className="border rounded-lg p-3 w-full" value={search} onChange={event => setSearch(event.target.value)} />
      {matches.data?.items.map(item => <Button key={item.id} variant="outline" disabled={!skills.data || save.isPending} onClick={() => save.mutate({ expected_version: skills.data!.version, items: [{ competency_id: item.id }] })}>{item.label}</Button>)}
      {save.error && <p role="alert">{save.error.message}</p>}
      {save.isSuccess && <p role="status">Skill saved. You can continue Discovery.</p>}
    </details>
  </section>;
}
