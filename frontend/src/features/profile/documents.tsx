import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { Button } from "@/components/ui/button";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";
import { ResumeEvidence } from "./resume-evidence";
import { APIRequestError } from "@/api/errors";

const failureMessages: Record<string, string> = {
  no_selectable_text: "This PDF has no readable text. Use a text-based PDF rather than a scan.",
  encrypted_pdf: "Use a PDF without password protection.",
  invalid_pdf: "This PDF could not be read. Export it as a new text-based PDF.",
  unsafe_or_large_context: "Use a shorter resume with Skills, Education, Experience or Projects headings.",
  pdf_busy: "PDF reading was busy. Try again shortly.",
  provider_unavailable: "The analysis service is temporarily unavailable. Try again later.",
  quota_exceeded: "The analysis allowance has been reached. Wait before trying again.",
  timeout: "Analysis took too long. Try a shorter PDF later.",
  invalid_evidence: "Analysis did not return usable, source-supported background. Try a simpler PDF.",
  storage_unavailable: "Resume storage is temporarily unavailable. Try again later.",
  no_usable_evidence: "No usable background was found. Use a resume with clear background sections.",
  too_many_pages: "Use a PDF with no more than 50 pages.",
  too_much_text: "This PDF has too much text. Use a shorter resume.",
};

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
  const inFlight = useRef(false);
  const analysisKey = useRef({ document: "", key: "" });
  const [retryAt, setRetryAt] = useState(0);
  const [clock, setClock] = useState(() => Date.now());
  const query = useCoreQuery(["documents"], coreApi.documents);
  const { refetch } = query;
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
    if (analysisKey.current.document !== candidate.id) {
      analysisKey.current = { document: candidate.id, key: crypto.randomUUID() };
    }
    return coreApi.analyzeDocument({ id: candidate.id, body: {
      expected_revision: current.revision, idempotency_key: analysisKey.current.key,
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
  useEffect(() => {
    if (!retryAt || Date.now() >= retryAt) return;
    const timer = window.setInterval(() => {
      setClock(Date.now());
      if (Date.now() >= retryAt) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [retryAt]);
  useEffect(() => {
    if (!active || !busyCandidate || pending) return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (Date.now() - started > 125_000) window.clearInterval(timer);
      else void refetch();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active, busyCandidate, pending, refetch]);
  async function analyze() {
    if (pending || inFlight.current || Date.now() < retryAt) return;
    inFlight.current = true;
    const owner = user?.id;
    try {
      await extract.mutateAsync();
    } catch (error) {
      if (error instanceof APIRequestError && error.retryAfter !== null) {
        setRetryAt(Date.now() + error.retryAfter * 1000);
        setClock(Date.now());
      }
    } finally {
      inFlight.current = false;
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
          <Button type="button" disabled={pending || clock < retryAt || !!busyCandidate || (!file && !state.candidate) || (state.synthetic_only && !synthetic)}
            onClick={() => void analyze()}>Analyze PDF</Button>
          {file && <Button type="button" variant="outline" disabled={pending} onClick={() => {
            setFile(null);
            extract.reset();
            setPhase("");
            if (input.current) input.current.value = "";
          }}>Clear selected PDF</Button>}
        </div>
      </div>}
      {state && !state.available && <p>Resume extraction is unavailable in this environment. You can still add skill reports manually.</p>}
      {state?.active && <div className="resume-saved-background">
        <p>Saved document background remains available until you remove it.</p>
        <ResumeEvidence evidence={state.active.evidence} />
        <p className="field-help">Resume skills are used by career matching. They do not assign proficiency ratings to your manual skill reports.</p>
        <div className="action-row">
        <Link className="underline" to={appRoutes.careerSkillMatches}>View career matches</Link>
        <Link className="underline" to={appRoutes.results}>Review career suggestions</Link>
        </div>
      </div>}
      {state?.latest_failure && !state.candidate && (!state.active || new Date(state.latest_failure.created_at) > new Date(state.active.created_at)) && <p role="alert">{failureMessages[state.latest_failure.failure_code ?? ""] ?? "The resume could not be analyzed. Try again later with a readable-text PDF."} Previous successful background is preserved.</p>}
      {clock < retryAt && <p role="status">Try analysis again after {new Date(retryAt).toLocaleTimeString()}. Reloading does not reset your allowance.</p>}
      {state?.candidate && <p>A pending document is saved and can be removed.</p>}
      {busyCandidate && <Button type="button" variant="outline" disabled={pending} onClick={() => void query.refetch()}>Check resume status</Button>}
      {state && (state.active || state.candidate) && <Button type="button" variant="destructive" disabled={pending} onClick={() => {
        if (!window.confirm("Remove the saved resume background and any pending PDF? Manual skills and learning progress are preserved.")) return;
        remove.reset();
        remove.mutate({ expected_revision: state.revision });
      }}>Remove resume</Button>}
      {!!state?.cleanup_pending && <p>Private-file cleanup pending. <Button type="button" variant="outline" disabled={pending} onClick={() => {
        cleanup.reset();
        cleanup.mutate();
      }}>Retry cleanup</Button></p>}
      {pending && <p role="status">{phase || "Saving document state…"}</p>}
      {remove.isSuccess && !pending && <p role="status">Document background removed from active use.</p>}
      {error && <p role="alert">{error.message} <Button type="button" variant="outline" disabled={pending} onClick={() => {
        void query.refetch();
        remove.reset();
        cleanup.reset();
        extract.reset();
      }}>Reload document state</Button></p>}
    </section>
  );
}
