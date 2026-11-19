import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { supabase } from "@/auth/supabase";
import { beginRecovery, prepareRecovery, finishRecovery } from "@/auth/recovery-codes";
import { useAuth } from "@/auth/context";
import { appRoutes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function RecoverAuthenticator() {
  const auth = useAuth();
  const owner = auth.user?.id;
  const activeOwner = useRef(owner);
  useEffect(() => { activeOwner.current = owner; return () => { activeOwner.current = undefined; }; }, [owner]);
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [setup, setSetup] = useState<{ secret: string; qr: string } | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const submitting = useRef(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current || !owner || !supabase) return;
    submitting.current = true; setBusy(true); setError("");
    try {
      if (setup) {
        const result = await finishRecovery(password, token, code);
        if (activeOwner.current !== owner) return;
        const accepted = await supabase.auth.setSession(result);
        if (accepted.error) throw new Error("Your authenticator was replaced. Sign in again using its current code, then replace your backup codes in Settings.");
        setToken(""); setSetup(null); setCodes(result.codes);
        await auth.refreshAssurance();
      } else {
        let capability = token;
        if (!capability) {
          capability = (await beginRecovery(password, code)).token;
          if (activeOwner.current !== owner) return;
          setToken(capability); setCode("");
        }
        const result = await prepareRecovery(password, capability);
        if (activeOwner.current === owner) setSetup(result);
      }
    } catch (cause) {
      if (activeOwner.current === owner) setError(cause instanceof Error ? cause.message : "Recovery was not confirmed. Try again.");
    } finally {
      submitting.current = false;
      if (activeOwner.current === owner) { setPassword(""); setCode(""); setBusy(false); }
    }
  }
  return <div className="auth-container security-page"><Card className="auth-card security-card">
    <header><h1>{codes.length ? "Save your new recovery codes" : "Recover your authenticator"}</h1>
      <p>{codes.length ? "Your replacement authenticator is verified. These codes replace your previous set and are shown once." : "Use your password and an unused backup code to replace your lost authenticator. Recovery removes existing authenticators and signs out other devices. App access stays blocked until you verify the replacement."}</p></header>
    {error && <p role="alert" className="security-feedback security-feedback-error">{error}</p>}
    {codes.length ? <section className="security-recovery" aria-label="Save recovery codes">
      <pre className="security-codes">{codes.join("\n")}</pre>
      <Button disabled={busy} onClick={() => {
        const url = URL.createObjectURL(new Blob([codes.join("\n")], { type: "text/plain" }));
        const link = document.createElement("a"); link.href = url; link.download = "asgard-recovery-codes.txt";
        link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}>Download recovery codes</Button>
      <Button variant="outline" onClick={() => {
        void navigator.clipboard.writeText(codes.join("\n")).then(() => setCopied(true)).catch(() => setError("Could not copy. Download the codes instead."));
      }}>Copy recovery codes</Button>
      {copied && <p role="status">Recovery codes copied. Store them privately.</p>}
      <Button asChild><Link to={appRoutes.account} onClick={() => setCodes([])}>I saved my codes</Link></Button>
    </section> : <form className="form-grid" onSubmit={submit}>
      {setup && <section className="security-setup" aria-label="Replacement authenticator setup">
        <img width="200" height="200" src={setup.qr.startsWith("data:image/") ? setup.qr : "data:image/svg+xml;charset=utf-8," + encodeURIComponent(setup.qr)} alt="Scan this code with your replacement authenticator" />
        <p>Or enter this setup key manually:</p><code className="security-setup-key">{setup.secret}</code>
      </section>}
      <div className="field"><Label htmlFor="backup-password">Confirm your password</Label>
        <Input id="backup-password" type="password" autoComplete="current-password" required disabled={busy} value={password} onChange={event => setPassword(event.target.value)} /></div>
      {(!token || setup) && <div className="field"><Label htmlFor="backup-code">{setup ? "New authenticator code" : "Recovery code"}</Label>
        <Input id="backup-code" autoComplete="one-time-code" required disabled={busy} inputMode={setup ? "numeric" : "text"} pattern={setup ? "[0-9]{6}" : undefined} value={code} onChange={event => setCode(event.target.value)} /></div>}
      <Button disabled={busy}>{busy ? "Please wait" : setup ? "Verify replacement authenticator" : token ? "Retry replacement setup" : "Recover authenticator"}</Button>
      {token && <p>Keep this page open. If you reload or recovery expires, sign in again and start with another unused backup code.</p>}
    </form>}
    {!codes.length && <Button type="button" variant="outline" disabled={busy} onClick={() => {
      setBusy(true); void auth.signOut().catch(() => { setError("Could not sign out. Try again."); setBusy(false); });
    }}>Sign out</Button>}
  </Card></div>;
}
