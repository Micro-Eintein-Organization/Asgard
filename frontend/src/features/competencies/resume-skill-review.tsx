import { useEffect, useRef, useState, type ReactNode } from "react";
import type { components } from "@/api/generated/schema";
import { Button } from "@/components/ui/button";
import { coreApi, useCoreQuery } from "@/features/core/data";

type Suggestion = components["schemas"]["ResumeSkillSuggestion"];

export function ResumeSkillReview({ careers, onReview, disabled, active = true, initialCareer = "" }: {
  careers: { id: string; title: string }[];
  onReview: (item: Suggestion) => ReactNode;
  disabled: boolean;
  active?: boolean;
  initialCareer?: string;
}) {
  const availability = useCoreQuery(["resume-review-availability"], coreApi.resumeReviewAvailability);
  const [career, setCareer] = useState(initialCareer);
  const [file, setFile] = useState<File | null>(null);
  const [items, setItems] = useState<Suggestion[] | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const request = useRef<AbortController | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (active) return;
    request.current?.abort();
    request.current = null;
    setPending(false);
    setItems(null);
    setError("");
    setFile(null);
    if (input.current) input.current.value = "";
  }, [active]);

  function clear(resetInput = true, keepFile = false) {
    request.current?.abort();
    request.current = null;
    setPending(false);
    setItems(null);
    setError("");
    if (!keepFile) setFile(null);
    if (resetInput && input.current) input.current.value = "";
  }

  async function review() {
    if (disabled || !career || !file || pending) return;
    const current = new AbortController();
    request.current = current;
    setPending(true);
    setError("");
    setItems(null);
    try {
      const result = await coreApi.reviewResume(career, file, current.signal);
      if (!current.signal.aborted) setItems(result.suggestions);
    } catch (error) {
      if (!current.signal.aborted)
        setError(error instanceof Error ? error.message : "Resume review failed.");
    } finally {
      if (request.current === current) {
        request.current = null;
        setPending(false);
      }
    }
  }

  if (availability.isPending) return <p role="status">Checking resume review availability…</p>;
  if (availability.error) return <p role="status">Resume review is unavailable. You can select skills manually.</p>;
  if (!availability.data?.enabled) return <p>Resume review is turned off. You can select skills manually.</p>;
  return (
    <div className="resume-review">
      <div className="resume-file-card">
        <span className="resume-file-icon" aria-hidden="true">PDF</span>
        <div className="resume-file-info">
          <strong>{file?.name ?? (items ? "Resume review complete" : "Review a resume")}</strong>
          <span>{pending ? "Reading your resume…" : items ? "Review complete; suggestions below" : file ? "Ready to review" : "Select a PDF to review skills"}</span>
        </div>
        <label className="resume-file-choose" htmlFor="resume-pdf">{file || items ? "Replace PDF" : "Choose PDF"}</label>
        {(file || items || pending) && <button type="button" className="resume-file-remove" onClick={() => clear()}>Remove</button>}
        <input className="sr-only" ref={input} id="resume-pdf" type="file" accept="application/pdf,.pdf" onChange={(event) => {
          const next = event.currentTarget.files?.[0] ?? null;
          clear(false);
          setFile(next);
        }} />
      </div>
      <div className="form-grid resume-review-controls">
        <p>Your PDF is read temporarily. Choose which suggested skills to save.</p>
        <label htmlFor="resume-career">Career</label>
        <select id="resume-career" value={career} onChange={(event) => {
          clear(false, true);
          setCareer(event.target.value);
        }}>
          <option value="">Choose a career</option>
          {careers.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <p className="field-help">Selectable text PDF, up to 10 MB.</p>
        <p id="resume-review-help" className="field-help">
          {disabled ? "Finish or cancel your skill edit before reviewing a resume."
            : !career && !file ? "Choose a career and a PDF to review skills."
            : !career ? "Choose a career to review this PDF."
            : !file ? "Choose a PDF to review skills for this career."
            : "Review the suggestions, select Add, then choose your experience and Save skill below."}
        </p>
        <div className="action-row">
          <Button type="button" aria-describedby="resume-review-help" disabled={disabled || !career || !file || pending} onClick={() => void review()}>
            Review resume
          </Button>
          <Button type="button" variant="outline" onClick={() => clear()}>{items || pending ? "End review" : "Skip for now"}</Button>
        </div>
        {pending && <p role="status">Reading your resume…</p>}
        {error && <p role="alert">{error}</p>}
        {items && (items.length ? (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.skill_id}>
                <strong>{item.label}</strong>
                <p>Page {item.page}</p>
                <blockquote className="whitespace-pre-wrap break-words">{item.passage}</blockquote>
                {onReview(item)}
                <Button type="button" variant="outline" onClick={() =>
                  setItems((current) => current?.filter((entry) => entry.skill_id !== item.skill_id) ?? null)
                }>Dismiss {item.label}</Button>
              </li>
            ))}
          </ul>
        ) : <p role="status">No skills to review. You can select skills manually below.</p>)}
      </div>
    </div>
  );
}
