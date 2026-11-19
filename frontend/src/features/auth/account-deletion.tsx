import { useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/context";
import { supabase, authStorageKey } from "@/auth/supabase";
import { endAcceptedDeletion, isCurrentAccount } from "@/auth/transport";
import { api } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function AccountDeletion() {
  const { user } = useAuth();
  const availability = useQuery({ queryKey: ["account", user?.id, "deletion-availability"],
    queryFn: async ({ signal }) => {
      const { data, error } = await api.GET("/api/v1/me/account-deletion", { signal });
      if (error || !data) throw new Error("Account deletion is temporarily unavailable.");
      return data;
    }, enabled: !!user, retry: false, staleTime: 30_000, refetchOnMount: "always" });
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const key = useRef(crypto.randomUUID());
  const owner = user?.id;
  function close() {
    if (pending) return;
    setOpen(false); setPassword(""); setCode(""); setConfirmation(""); setError("");
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending || !owner || confirmation !== "DELETE" || !password) return;
    setPending(true); setError("");
    try {
      const result = await api.POST("/api/v1/me/account-deletion", { body: {
        confirmation: "DELETE", password, idempotency_key: key.current,
        mfa_code: code || null, recovery,
      } });
      if (!isCurrentAccount(owner)) return;
      if (result.error || !result.data) {
        setError(result.error && "message" in result.error ? String(result.error.message) : "Deletion was not confirmed. Try signing in again before taking further action.");
        return;
      }
      setPassword(""); setCode("");
      endAcceptedDeletion();
      try {
        await supabase?.auth.stopAutoRefresh();
        await supabase?.auth.signOut({ scope: "local" });
      } finally {
        try { localStorage.removeItem(authStorageKey); }
        finally { window.location.replace("/sign-in?account_deleted=1"); }
      }
    } catch {
      setError("The result could not be confirmed. Do not submit repeatedly; try signing in again. An accepted deletion cannot be undone.");
    } finally { setPending(false); }
  }
  return <Card className="settings-card">
    <header><h2>Delete account</h2><p>Permanently remove your account and saved personal data.</p></header>
    <Button variant="destructive" disabled={!availability.data?.enabled} onClick={() => { key.current = crypto.randomUUID(); setOpen(true); }}>Delete account</Button>
    {availability.isError ? <div role="alert"><p>Could not check account deletion availability.</p><Button variant="outline" disabled={availability.isFetching} onClick={() => void availability.refetch()}>Try again</Button></div>
      : !availability.isPending && !availability.data?.enabled && <p role="status" className="field-help">Account deletion is temporarily unavailable. Please try again later.</p>}
    <Dialog open={open} onOpenChange={next => { if (!next) close(); }}>
      <DialogContent onInteractOutside={event => { if (pending) event.preventDefault(); }} onEscapeKeyDown={event => { if (pending) event.preventDefault(); }}>
        <DialogHeader><DialogTitle>Delete your account permanently?</DialogTitle>
          <DialogDescription>Access ends as soon as deletion is accepted. Your profile, files, skills, Discovery, saved careers, recommendations and learning progress will be removed within seven days. This cannot be undone.</DialogDescription></DialogHeader>
        <form className="form-grid" onSubmit={submit}>
          <div className="field"><Label htmlFor="delete-password">Confirm your password</Label><Input id="delete-password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required disabled={pending} /></div>
          {availability.data?.mfa_required && <><div className="field"><Label htmlFor="delete-code">{recovery ? "Recovery code" : "Authenticator code"}</Label><Input id="delete-code" autoComplete="one-time-code" value={code} onChange={event => setCode(event.target.value)} required disabled={pending} /></div>
            <label className="security-confirm"><input type="checkbox" checked={recovery} onChange={event => { setRecovery(event.target.checked); setCode(""); }} disabled={pending} />Use a recovery code</label></>}
          <div className="field"><Label htmlFor="delete-confirm">Type DELETE to confirm</Label><Input id="delete-confirm" autoComplete="off" value={confirmation} onChange={event => setConfirmation(event.target.value)} required pattern="DELETE" disabled={pending} /></div>
          {error && <p role="alert" className="field-error">{error}</p>}
          <div className="action-row"><Button type="button" variant="outline" onClick={close} disabled={pending}>Cancel</Button><Button type="submit" variant="destructive" disabled={pending || confirmation !== "DELETE" || !password}>{pending ? "Confirming deletion…" : "Permanently delete account"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  </Card>;
}
