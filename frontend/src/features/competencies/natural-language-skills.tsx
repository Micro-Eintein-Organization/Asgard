import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router";
import type { components } from "@/api/generated/schema";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { Button } from "@/components/ui/button";
import { coreApi, useCoreMutation } from "@/features/core/data";
import { experienceLevels } from "./levels";

type Suggestion = components["schemas"]["SkillSuggestion"];
type Saved = components["schemas"]["CompetencyState"];

export function NaturalLanguageSkills({ saved, onGuardChange }: {
  saved?: Saved; onGuardChange: (dirty: boolean, pending: boolean) => void;
}) {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [levels, setLevels] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const preview = useMutation({ mutationFn: async () => {
    const owner = user?.id;
    const result = await coreApi.interpretSkills(description);
    if (!owner || !isCurrentAccount(owner)) throw new Error("Your account changed. Reopen Profile.");
    return result;
  }, onSuccess: result => {
    setSuggestions(result.items); setSelected(new Set()); setLevels({});
    setNotice(result.items.length ? (result.interpretation_available ? "Review the mapped skills before saving."
      : "Automatic interpretation is unavailable. Review these exact matches or use manual selection.")
      : "No supported matches found. Describe a specific task you have done, or select skills manually.");
  } });
  const save = useCoreMutation(coreApi.confirmSkills, { clearSkillEvidence: true, clearSuggestions: () => true });
  const pending = preview.isPending || save.isPending;
  useEffect(() => {
    onGuardChange(Boolean(description.trim() || suggestions.length), pending);
    return () => onGuardChange(false, false);
  }, [description, suggestions.length, pending, onGuardChange]);
  async function persist() {
    if (!saved || !user) return;
    const owner = user.id;
    try {
      await save.mutateAsync({ expected_version: saved.version, items: [...selected].map(competency_id => ({
        competency_id, ...(levels[competency_id] !== undefined
          ? { level: levels[competency_id] === "" ? null : Number(levels[competency_id]) } : {}),
      })) });
      if (isCurrentAccount(owner)) {
        setDescription(""); setSuggestions([]); setSelected(new Set()); setLevels({});
        setNotice("Selected skills saved as confirmed evidence. Experience levels were preserved unless you edited them.");
      }
    } catch { /* The mutation displays its error and retains the review. */ }
  }
  return <section aria-label="Describe your skills" className="space-y-3">
    <label htmlFor="skill-description">Describe your skills or experience</label>
    <p className="field-help">For example: I used Python and SQL to build a sales dashboard. Review matches before saving; experience ratings are optional.</p>
    <textarea id="skill-description" className="w-full rounded-lg border p-3" rows={3} maxLength={2000}
      disabled={pending} value={description} onChange={event => {
        setDescription(event.target.value); setSuggestions([]); setSelected(new Set()); setNotice("");
      }} />
    <Button type="button" disabled={pending || !description.trim()} onClick={() => preview.mutate()}>
      {preview.isPending ? "Mapping skills…" : "Find matching skills"}
    </Button>
    {notice && <p role="status">{notice}</p>}
    {(preview.error || save.error) && <p role="alert">{(preview.error ?? save.error)?.message}</p>}
    {suggestions.map(item => {
      const existing = saved?.items.find(skill => skill.competency_id === item.competency_id);
      return <div key={item.competency_id} className="rounded-lg border p-3 space-y-2">
        <label><input type="checkbox" disabled={pending} checked={selected.has(item.competency_id)}
          onChange={event => setSelected(previous => {
            const next = new Set(previous);
            if (event.target.checked) next.add(item.competency_id); else next.delete(item.competency_id);
            return next;
          })} /> {item.label}</label>
        <p className="field-help">{item.method === "exact" ? "Exact wording" : "Interpreted wording"}: {item.quote}</p>
        <ul>{(item.applications ?? []).map(app => <li key={`${app.career_id}:${app.basis}`} className="field-help">
          {app.title} · {app.basis === "benchmark" ? "Job-sample skills" : "Roadmap skills"}
          {(app.topics ?? []).map(topic => <p key={topic.topic_id}><Link className="underline"
            to={`/roadmaps/${app.career_id}?roadmap=${topic.roadmap_id}&topic=${topic.topic_id}`}>{topic.title}</Link></p>)}
        </li>)}</ul>
        <label>Experience (optional) <select disabled={pending} value={levels[item.competency_id] ?? (existing?.level == null ? "" : String(existing.level))}
          onChange={event => setLevels(previous => ({ ...previous, [item.competency_id]: event.target.value }))}>
          <option value="">Unknown / not rated</option>
          {Object.entries(experienceLevels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select></label>
      </div>;
    })}
    {suggestions.length > 0 && <Button type="button" disabled={pending || !saved || !selected.size} onClick={() => void persist()}>
      {save.isPending ? "Saving skills…" : "Save selected skills"}
    </Button>}
  </section>;
}
