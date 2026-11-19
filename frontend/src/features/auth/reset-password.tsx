import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { consumeRecoveryLocation, openRecovery, replaceRecoveredPassword } from "@/auth/recovery";
import { isCurrentAccount, endCurrentAccountAccess } from "@/auth/transport";
import { validateNewPassword } from "@/auth/password";
import { routes } from "@/lib/routes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Capture and scrub callback credentials before the route or its shell renders.
const callback = consumeRecoveryLocation();

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "ready" | "invalid">("checking");
  const [mfa, setMfa] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [changed, setChanged] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void openRecovery(callback.code, callback.flowId).then(result => {
      if (active) { setMfa(result.mfaRequired); setState("ready"); }
    }).catch(() => {
      if (active) { setState("invalid"); setError("This recovery link cannot be used. Request a new email and open it in the same browser."); }
    });
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending || state !== "ready") return;
    if (!changed && (validateNewPassword(password) !== true || password !== confirmation)) {
      const validation = validateNewPassword(password);
      setError(validation === true ? "Enter the same password twice." : validation); return;
    }
    setPending(true); setError("");
    try {
      const result = await replaceRecoveredPassword(password, code, false);
      setPassword(""); setConfirmation(""); setCode("");
      if (!result.complete) {
        setChanged(true);
        setError("Your password changed, but ending the sessions was not confirmed. Finish signing out below.");
        return;
      }
      if (isCurrentAccount(result.userId)) endCurrentAccountAccess();
      void navigate(routes.login + "?password_reset=1", { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The result could not be confirmed. Try signing in or request a new recovery email.");
    } finally { setPending(false); }
  }

  return <div className="auth-container"><Card className="auth-card">
    <header><h1>Choose a new password.</h1><p>Your authenticator and recovery codes stay enabled.</p></header>
    {state === "checking" && <p role="status">Checking your recovery link…</p>}
    {error && <p role="alert" className="field-error">{error}</p>}
    {state === "ready" && <form className="form-grid" onSubmit={submit}>
      {!changed && <>
        <div className="field"><Label htmlFor="new-password">New password</Label><Input id="new-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={event => setPassword(event.target.value)} disabled={pending} /><p className="field-help">Use at least 8 characters. Spaces, paste and password managers are supported.</p></div>
        <div className="field"><Label htmlFor="confirm-new-password">Confirm new password</Label><Input id="confirm-new-password" type="password" autoComplete="new-password" required value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={pending} /></div>
        {mfa && <><div className="field"><Label htmlFor="recovery-mfa">Authenticator code</Label><Input id="recovery-mfa" autoComplete="one-time-code" required inputMode="numeric" pattern="[0-9]{6}" value={code} onChange={event => setCode(event.target.value)} disabled={pending} /></div>
          <p className="field-help">If you lost your authenticator, sign in with your current password and use a backup code to replace it first. Losing both your password and authenticator is not supported by backup-code recovery.</p></>}
      </>}
      <Button type="submit" disabled={pending}>{pending ? "Please wait…" : changed ? "Finish signing out" : "Save new password"}</Button>
    </form>}
    <div className="form-footer"><Link to={routes.recovery}>Request a new recovery email</Link></div>
  </Card></div>;
}
