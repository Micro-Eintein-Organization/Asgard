import { useEffect } from "react";
import { Link } from "react-router";
import { coreApi, useCoreMutation, useCoreQuery } from "@/features/core/data";
import { appRoutes } from "@/lib/routes";

export function ProfileDocuments({ onGuardChange }: {
  onGuardChange?: (dirty: boolean, pending: boolean) => void;
}) {
  const query = useCoreQuery(["documents"], coreApi.documents);
  const remove = useCoreMutation(coreApi.removeDocuments);
  const cleanup = useCoreMutation(coreApi.cleanupDocuments);
  const state = query.data;
  const pending = remove.isPending || cleanup.isPending;
  useEffect(() => {
    onGuardChange?.(false, pending);
    return () => onGuardChange?.(false, false);
  }, [onGuardChange, pending]);
  const error = query.error ?? remove.error ?? cleanup.error;
  return (
    <section className="space-y-3 pt-2 border-t" id="documents">
      <h3 className="text-sm font-semibold">Academic profile and document management</h3>
      <p className="text-sm">PDF upload and analysis: Coming later.</p>
      {!state && !error && <p role="status">Loading document state…</p>}
      {state?.active && <div>
        <p>Saved document background remains available until you remove it.</p>
        <Link className="underline" to={appRoutes.results}>Review career suggestions</Link>
      </div>}
      {state?.candidate && <p>A pending document is saved and can be removed.</p>}
      {state && (state.active || state.candidate) && <button disabled={pending} onClick={() => {
        if (!window.confirm("Remove active and pending document background? Learning progress is preserved.")) return;
        remove.reset();
        remove.mutate({ expected_revision: state.revision });
      }}>Remove document background</button>}
      {!!state?.cleanup_pending && <p>Private-file cleanup pending. <button disabled={pending} onClick={() => {
        cleanup.reset();
        cleanup.mutate();
      }}>Retry cleanup</button></p>}
      {pending && <p role="status">Saving document state…</p>}
      {remove.isSuccess && !pending && <p role="status">Document background removed from active use.</p>}
      {error && <p role="alert">{error.message} <button disabled={pending} onClick={() => {
        void query.refetch();
        remove.reset();
        cleanup.reset();
      }}>Reload document state</button></p>}
    </section>
  );
}
