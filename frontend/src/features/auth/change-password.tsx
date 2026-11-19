import { useEffect, useState } from "react";
import { useAuth } from "@/auth/context";
import { isCurrentAccount } from "@/auth/transport";
import { recoveryAcknowledgment, recoveryCooldown, requestRecovery } from "@/auth/recovery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ChangePassword() {
  const { user } = useAuth();
  const [remaining, setRemaining] = useState(recoveryCooldown);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setRemaining(recoveryCooldown()), 1000);
    return () => clearInterval(timer);
  }, []);
  async function send() {
    if (!user?.email || pending || recoveryCooldown()) return;
    const owner = user.id;
    setPending(true); setMessage(""); setError("");
    try {
      await requestRecovery(user.email);
      if (isCurrentAccount(owner)) setMessage(recoveryAcknowledgment);
    } catch (cause) {
      if (isCurrentAccount(owner)) setError(cause instanceof Error ? cause.message : "Could not send recovery instructions. Try again later.");
    } finally {
      setPending(false); setRemaining(recoveryCooldown());
    }
  }
  return <Card className="settings-card">
    <header><h2>Change password</h2><p>Send a recovery link to your account email. Open it in this browser to choose a new password. Two-factor authentication stays enabled.</p></header>
    <Button variant="outline" onClick={() => void send()} disabled={!user?.email || pending || remaining > 0}>{pending ? "Sending…" : remaining > 0 ? `Send again in ${remaining}s` : "Send password reset email"}</Button>
    {message && <p role="status">{message}</p>}
    {error && <p role="alert" className="field-error">{error}</p>}
  </Card>;
}
