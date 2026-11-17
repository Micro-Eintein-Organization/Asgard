import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/auth/context";
import { supabase } from "@/auth/supabase";
import { mfaEnrollmentApproved, verifySecondFactor } from "@/auth/mfa";
import { appRoutes, routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatePanel } from "@/components/shared";

export function MfaPage({ challenge = false }: { challenge?: boolean }) {
  const auth = useAuth();
  if (auth.loading) return <StatePanel kind="loading" title="Restoring your session">Please wait.</StatePanel>;
  if (!auth.user) return <Navigate to={routes.login} replace />;
  if (!auth.user.email_confirmed_at) return <Navigate to={routes.verify} replace />;
  if (challenge && auth.mfa === "ready") return <Navigate to={appRoutes.dashboard} replace />;
  return <MfaForm key={auth.user.id + String(challenge)} challenge={challenge} />;
}

function MfaForm({ challenge }: { challenge: boolean }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const welcome = params.get("welcome") === "1";
  const destination = welcome ? appRoutes.welcome : appRoutes.account;
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [recovery, setRecovery] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!challenge);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [factors, setFactors] = useState<{ id: string; friendly_name?: string }[]>([]);
  const [pending, setPending] = useState<{ id: string; secret: string; qr: string } | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const alive = useRef(true);
  const authenticatedUntil = useRef(0);
  const [disableConfirmed, setDisableConfirmed] = useState(false);
  useEffect(() => {
    alive.current = true;
    if (!challenge && supabase) {
      void supabase.auth.mfa.listFactors().then(async ({ data, error }) => {
        if (error) throw error;
        if (!alive.current) return;
        setFactors(data.totp.filter(item => item.status === "verified"));
        if (data.totp.some(item => item.status === "verified")) {
          const result = await supabase!.auth.mfa.recoveryCodes.getStatus();
          if (!alive.current) return;
          if (result.error && result.error.code !== "mfa_factor_not_found") throw result.error;
          setRemaining(result.data?.remaining ?? null);
        }
      }).catch(() => {
        if (alive.current) setError("Could not load security settings or recovery capability. Try reopening this page.");
      }).finally(() => { if (alive.current) setLoading(false); });
    }
    return () => { alive.current = false; };
  }, [challenge]);

  async function perform(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError(""); setMessage("");
    try { await action(); }
    catch (cause) {
      if (alive.current) setError(cause instanceof Error ? cause.message : "Security update failed. Try again.");
    } finally { if (alive.current) { setBusy(false); setPassword(""); setCode(""); } }
  }
  async function freshAuthentication() {
    if (!supabase || !auth.user?.email) throw new Error("Sign in again to continue.");
    const { data, error } = await supabase.auth.signInWithPassword({ email: auth.user.email, password });
    if (error || data.user?.id !== auth.user.id) throw new Error("Password verification failed. Try again.");
    if (factors.length) await verifySecondFactor(code, recovery);
    authenticatedUntil.current = Date.now() + 300_000;
    if (!alive.current) throw new Error("Account changed. Reopen security settings.");
  }
  async function generateCodes(rotate = false) {
    if (!supabase) return;
    const result = rotate ? await supabase.auth.mfa.recoveryCodes.regenerate()
      : await supabase.auth.mfa.recoveryCodes.generate();
    if (result.error) throw new Error("Recovery codes could not be issued. The provider may have saved the change. Reopen settings to check status; use authenticated regeneration if the codes were lost.");
    setCodes(result.data.codes);
    setRemaining(result.data.total);
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    void perform(async () => {
      if (!supabase) return;
      if (challenge) {
        await verifySecondFactor(code, recovery);
        await auth.refreshAssurance();
        void navigate(appRoutes.dashboard, { replace: true });
      } else if (pending) {
        if (Date.now() >= authenticatedUntil.current)
          throw new Error("Setup authentication expired. Cancel setup and confirm your password again.");
        const result = await supabase.auth.mfa.challengeAndVerify({ factorId: pending.id, code });
        if (result.error) throw new Error("That authenticator code did not work. Use the current code and try again.");
        setFactors([{ id: pending.id }]); setPending(null);
        await generateCodes();
        await auth.refreshAssurance();
      } else {
        if (!mfaEnrollmentApproved) throw new Error("Authenticator setup is not enabled for this demo yet.");
        await freshAuthentication();
        const current = await supabase.auth.mfa.listFactors();
        if (current.error) throw new Error("Could not check existing setup. Try again.");
        if (current.data.all.some(item => item.status === "verified"))
          throw new Error("An authenticator is already enabled. Reopen settings to manage it.");
        for (const item of current.data.all.filter(item => item.factor_type === "totp" && item.status === "unverified")) {
          const removed = await supabase.auth.mfa.unenroll({ factorId: item.id });
          if (removed.error) throw new Error("Could not clear unfinished setup. Reopen settings.");
        }
        const result = await supabase.auth.mfa.enroll({ factorType: "totp" });
        if (result.error) throw new Error("Could not start authenticator setup. Reopen settings to check its status before retrying.");
        setPending({ id: result.data.id, secret: result.data.totp.secret, qr: result.data.totp.qr_code });
      }
    });
  }
  async function cancelPending() {
    if (!supabase || !pending) return;
    const result = await supabase.auth.mfa.unenroll({ factorId: pending.id });
    if (result.error) throw new Error("Could not cancel setup. Reopen settings to check its status.");
    setPending(null);
  }
  function downloadCodes() {
    const url = URL.createObjectURL(new Blob([codes.join("\n")], { type: "text/plain" }));
    const link = document.createElement("a"); link.href = url; link.download = "asgard-recovery-codes.txt";
    link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <div className={challenge || welcome ? "auth-container security-page" : "security-page security-management"}>
    {!challenge && !welcome && <Link className="security-back" to={appRoutes.account}>Back to Account and security</Link>}
    <Card className="auth-card security-card">
    <header><h1>{challenge ? "Verify your sign-in" : welcome ? "Protect your account" : "Authenticator and recovery codes"}</h1>
      <p>{challenge ? "Enter your authenticator code to finish signing in." : welcome ? "Add an authenticator app for an extra sign-in step. You can also set it up later in Settings." : "Manage the authenticator and backup codes used to protect your sign-in."}</p></header>
    {loading ? <p role="status">Loading security settings.</p> : <>
      {error && <p role="alert" className="security-feedback security-feedback-error">{error}</p>}
      {message && <p role="status" className="security-feedback">{message}</p>}
      {!challenge && !mfaEnrollmentApproved && <p role="status">Authenticator setup and changes are not enabled for this demo yet. Existing two-factor sign-in still works.</p>}
      {codes.length > 0 ? <section className="security-recovery" aria-label="Save recovery codes">
        <h2>Save your recovery codes</h2><p>These codes are shown once. Keep them somewhere private. Each code works only once.</p>
        <pre className="security-codes">{codes.join("\n")}</pre>
        <Button onClick={downloadCodes}>Download recovery codes</Button>
        <Button variant="outline" onClick={() => void perform(async () => {
          await navigator.clipboard.writeText(codes.join("\n")); setMessage("Recovery codes copied. Store them privately.");
        })}>Copy recovery codes</Button>
        <Button variant="outline" onClick={() => { setCodes([]); void navigate(destination, { replace: true }); }}>I saved my codes</Button>
      </section> : <>
        {!challenge && factors.length > 0 && <p className="security-feedback">Authenticator enabled. {remaining === null ? "Recovery-code status unavailable or no codes issued." : `${remaining} recovery codes remain.`}</p>}
        {pending && <section className="security-setup" aria-label="Authenticator setup">
          <img src={pending.qr.startsWith("data:image/") ? pending.qr : "data:image/svg+xml;charset=utf-8," + encodeURIComponent(pending.qr)} alt="Scan this code with your authenticator app" width="200" height="200" />
          <p>Or enter this setup key manually:</p><code className="security-setup-key">{pending.secret}</code>
        </section>}
        <form className="form-grid" onSubmit={submit}>
          {!challenge && !pending && <div className="field"><Label htmlFor="mfa-password">Confirm your password</Label>
            <Input id="mfa-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></div>}
          {(challenge || pending || factors.length > 0) && <div className="field"><Label htmlFor="mfa-code">{recovery && !pending ? "Recovery code" : "Authenticator code"}</Label>
            <Input id="mfa-code" autoComplete="one-time-code" inputMode={recovery ? "text" : "numeric"} required
              pattern={recovery ? undefined : "[0-9]{6}"} value={code} onChange={event => setCode(event.target.value)} /></div>}
          {(challenge || factors.length > 0) && !pending && <Button type="button" variant="outline" disabled={busy} onClick={() => { setRecovery(!recovery); setCode(""); }}>
            {recovery ? "Use authenticator instead" : "Use a recovery code"}</Button>}
          {(challenge || pending || factors.length === 0) && <Button disabled={busy || (!challenge && !mfaEnrollmentApproved)}>
            {busy ? "Please wait" : challenge || pending ? "Verify" : "Set up authenticator"}</Button>}
          {!challenge && !pending && factors.length > 0 && <>
            <Button type="button" disabled={busy || !password || !code || !mfaEnrollmentApproved} onClick={() => void perform(async () => {
              await freshAuthentication(); await generateCodes(remaining !== null); await auth.refreshAssurance();
            })}>{remaining === null ? "Generate recovery codes" : "Replace recovery codes"}</Button>
            <Label className="security-confirm"><input type="checkbox" checked={disableConfirmed} onChange={event => setDisableConfirmed(event.target.checked)} /> I understand disabling 2FA removes this extra sign-in protection.</Label>
            <Button type="button" variant="destructive" disabled={busy || !password || !code || !mfaEnrollmentApproved} onClick={() => void perform(async () => {
              if (!disableConfirmed)
                throw new Error("Confirm that you want to disable two-factor authentication.");
              await freshAuthentication();
              const removedCodes = await supabase!.auth.mfa.recoveryCodes.unenroll();
              if (removedCodes.error && removedCodes.error.code !== "mfa_factor_not_found")
                throw new Error("Recovery removal failed. Authenticator protection remains; reopen settings to check status.");
              for (const factor of factors) {
                const result = await supabase!.auth.mfa.unenroll({ factorId: factor.id });
                if (result.error) throw new Error("Not all authenticators were removed. Reopen settings to check status before retrying.");
              }
              const result = await supabase!.auth.signOut({ scope: "global" });
              if (result.error) throw new Error("2FA was removed, but session revocation failed. Sign out and contact the project owner.");
              void navigate(routes.login, { replace: true });
            })}>Disable two-factor authentication</Button>
          </>}
        </form>
        {pending ? <Button variant="outline" disabled={busy} onClick={() => void perform(cancelPending)}>Cancel setup</Button>
          : !challenge && <Link to={destination}>{welcome && !factors.length ? "Skip for now" : "Return to account"}</Link>}
        {challenge && <><p>Lost your authenticator and all recovery codes? Account recovery is unavailable. Email verification cannot bypass 2FA.</p>
          <Button variant="outline" disabled={busy} onClick={() => void perform(async () => { await auth.signOut(); void navigate(routes.login, { replace: true }); })}>Sign out</Button></>}
      </>}
    </>}
  </Card></div>;
}

export function AuthenticatorSetting() {
  return <Card className="settings-card security-setting"><header><h2>Authenticator app</h2><p>We strongly recommend optional two-factor authentication to protect your account.</p></header>
    {mfaEnrollmentApproved ? <div className="action-row"><Button asChild variant="outline"><Link to={routes.mfaSetup}>Manage authenticator and recovery codes</Link></Button></div> : <>
      <Button disabled variant="outline">Set up authenticator</Button><p>Authenticator setup is not enabled for this demo yet.</p></>}
  </Card>;
}
