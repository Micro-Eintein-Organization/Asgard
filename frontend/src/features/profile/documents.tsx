import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { Button } from "@/components/ui/button";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

export function ProfileDocuments({ onGuardChange, compact = false, active = true }: {
  onGuardChange?: (dirty: boolean, pending: boolean) => void;
  compact?: boolean;
  active?: boolean;
}) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [synthetic, setSynthetic] = useState(false);
  const [phase, setPhase] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const query = useCoreQuery(["documents"], coreApi.documents);
  const remove = useCoreMutation(coreApi.removeDocuments);
  const cleanup = useCoreMutation(coreApi.cleanupDocuments);
  const state = query.data;
  const extract = useCoreMutation(async () => {
    if (!state || !user) throw new Error("Reload document state before analyzing.");
    const owner = user.id;
    let current = state;
    if (file) {
      setPhase("Uploading PDF…");
      current = await coreApi.uploadDocument({ file, revision: state.revision });
    }
    if (!isCurrentAccount(owner)) throw new Error("Your account changed. Reopen Profile.");
    const candidate = current.candidate;
    if (!candidate || candidate.status !== "uploaded")
      throw new Error("Reload document state before analyzing this PDF.");
    setPhase("Extracting skills and experience…");
    return coreApi.analyzeDocument({ id: candidate.id, body: {
      expected_revision: current.revision, idempotency_key: crypto.randomUUID(),
      synthetic_document: synthetic,
    } });
  });
  const pending = remove.isPending || cleanup.isPending || extract.isPending;
  useEffect(() => {
    if (!active && !pending) {
      setFile(null);
      setSynthetic(false);
      if (input.current) input.current.value = "";
    }
  }, [active, pending]);
  useEffect(() => {
    onGuardChange?.(file !== null, pending);
    return () => onGuardChange?.(false, false);
  }, [onGuardChange, pending, file]);
  const error = query.error ?? extract.error ?? remove.error ?? cleanup.error;
  const busyCandidate = state?.candidate && state.candidate.status !== "uploaded";
  async function analyze() {
    if (pending) return;
    const owner = user?.id;
    try {
      await extract.mutateAsync();
    } catch {
      // Reload persisted state even when the upload or analysis response was lost.
    } finally {
      if (owner && isCurrentAccount(owner)) {
        setFile(null);
        setPhase("");
        if (input.current) input.current.value = "";
        void query.refetch();
      }
    }
  }
  return (
    <section className={compact ? "space-y-3" : "space-y-3 pt-2 border-t"} id="documents">
      {!compact && <><h3 className="text-sm font-semibold">Academic profile and document management</h3>
      </>}
      {!state && !error && <p role="status">Loading document state…</p>}
      {state?.available && <div className="form-grid">
        <h3>Import skills and experience from your resume</h3>
        <p>Choose a PDF, then select Analyze PDF to extract and save its skills, work experience, education and projects. Your resume is stored privately; relevant background is processed by Groq. A successful analysis replaces your previous resume background.</p>
        <div className="resume-file-card">
          <span className="resume-file-icon" aria-hidden="true">PDF</span>
          <div className="resume-file-info">
            <strong>{file?.name ?? (state.candidate ? "Resume ready for analysis" : "Review a resume")}</strong>
            <span>{phase || (busyCandidate ? "Processing your resume…" : pending ? "Updating resume…" : file || state.candidate ? "Ready to analyze" : "Select a PDF to review skills and experience")}</span>
          </div>
          <button type="button" className="resume-file-choose disabled:cursor-not-allowed disabled:opacity-50"
            disabled={pending || !!state.candidate} onClick={() => input.current?.click()}>
            {file || state.active ? "Replace PDF" : "Choose PDF"}
          </button>
          <input className="sr-only" ref={input} id="background-pdf" type="file" accept="application/pdf,.pdf"
            tabIndex={-1} aria-label={state.active ? "Replace resume PDF" : "Choose resume PDF"}
            disabled={pending || !!state.candidate}
            onChange={event => {
              setFile(event.target.files?.[0] ?? null);
              extract.reset();
            }} />
        </div>
        <p className="field-help">Selectable-text PDF, up to 10 MB. No career selection is required. Experience ratings remain separate self-reports.</p>
        {state.synthetic_only && <label><input type="checkbox" checked={synthetic} disabled={pending}
          onChange={event => setSynthetic(event.target.checked)} /> This is a synthetic test resume with no real personal data.</label>}
        <div className="action-row">
          <Button type="button" disabled={pending || !!busyCandidate || (!file && !state.candidate) || (state.synthetic_only && !synthetic)}
            onClick={() => void analyze()}>Analyze PDF</Button>
          {file && <Button type="button" variant="outline" disabled={pending} onClick={() => {
            setFile(null);
            if (input.current) input.current.value = "";
          }}>Cancel selection</Button>}
        </div>
      </div>}
      {state && !state.available && <p>Resume extraction is unavailable in this environment. You can still add skill reports manually.</p>}
      {state?.active && <div>
        <p>Saved document background remains available until you remove it.</p>
        {([['skill', 'Skills from resume'], ['experience', 'Work experience from resume'], ['education', 'Education from resume'], ['project', 'Projects from resume']] as const).map(([kind, title]) => {
          const items = state.active!.evidence.filter(item => item.kind === kind);
          return <section key={kind} className="space-y-2" aria-label={title}>
            <h3>{title}</h3>
            {items.length ? <ul className="space-y-2">{items.map((item, index) => <li key={`${kind}-${index}`}>
              <p className="break-words">{item.text}</p>
              <details><summary>Source: page {item.page}</summary><blockquote className="whitespace-pre-wrap break-words">{item.span}</blockquote></details>
            </li>)}</ul> : <p>No supported {kind === 'experience' ? 'work experience' : kind === 'skill' ? 'skills' : kind === 'project' ? 'projects' : 'education'} found in this resume.</p>}
          </section>;
        })}
        <p className="field-help">Resume skills are used by career matching. They do not assign proficiency ratings to your manual skill reports.</p>
        <Link className="underline" to={appRoutes.careerSkillMatches}>View career matches</Link>{" · "}
        <Link className="underline" to={appRoutes.results}>Review career suggestions</Link>
      </div>}
      {state?.latest_failure && !state.candidate && (!state.active || new Date(state.latest_failure.created_at) > new Date(state.active.created_at)) && <p role="alert">The latest resume could not be analyzed. Previous successful background is preserved. Choose another selectable-text PDF or retry with a new upload.</p>}
      {state?.candidate && <p>A pending document is saved and can be removed.</p>}
      {busyCandidate && <Button type="button" variant="outline" disabled={pending} onClick={() => void query.refetch()}>Check resume status</Button>}
      {state && (state.active || state.candidate) && <button disabled={pending} onClick={() => {
        if (!window.confirm("Remove active and pending document background? Learning progress is preserved.")) return;
        remove.reset();
        remove.mutate({ expected_revision: state.revision });
      }}>Remove document background</button>}
      {!!state?.cleanup_pending && <p>Private-file cleanup pending. <button disabled={pending} onClick={() => {
        cleanup.reset();
        cleanup.mutate();
      }}>Retry cleanup</button></p>}
      {pending && <p role="status">{phase || "Saving document state…"}</p>}
      {remove.isSuccess && !pending && <p role="status">Document background removed from active use.</p>}
      {error && <p role="alert">{error.message} <button disabled={pending} onClick={() => {
        void query.refetch();
        remove.reset();
        cleanup.reset();
        extract.reset();
      }}>Reload document state</button></p>}
    </section>
  );
}
