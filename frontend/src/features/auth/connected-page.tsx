import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "@/auth/context";
import { authConfigured, supabase } from "@/auth/supabase";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Unavailable } from "@/components/shared";
import { resendCooldown, startResendCooldown } from "@/auth/cooldown";
import { validateNewPassword } from "@/auth/password";
import { appRoutes, routes } from "@/lib/routes";

type Fields = {
  email: string;
  password: string;
  confirmation: string;
  code: string;
};
type Mode = "login" | "register" | "verify" | "recovery";

export function ConnectedAuthPage({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const auth = useAuth();
  const pendingSignupEmail = sessionStorage.getItem("asgard.signup-email");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    defaultValues: {
      email: sessionStorage.getItem("asgard.signup-email") ?? "",
    },
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [visible, setVisible] = useState(false);
  const [resending, setResending] = useState(false);
  const [remaining, setRemaining] = useState(resendCooldown);
  useEffect(() => {
    if (mode !== "recovery" && auth.user?.email_confirmed_at && !auth.loading)
      void navigate(
        mode === "verify" ? appRoutes.welcome : appRoutes.dashboard,
        {
          replace: true,
        },
      );
  }, [auth.user, auth.loading, navigate, mode]);
  useEffect(() => {
    const timer = setInterval(() => setRemaining(resendCooldown()), 1000);
    return () => clearInterval(timer);
  }, []);
  function beginCooldown() {
    setRemaining(startResendCooldown());
  }
  async function submit(values: Fields) {
    if (!supabase || mode === "recovery") return;
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email.trim(),
          password: values.password,
        });
        if (error)
          throw new Error(
            error.code === "email_not_confirmed"
              ? "Confirm your email before signing in."
              : "Could not sign in. Check your email and password, then try again.",
          );
        void navigate(appRoutes.dashboard, { replace: true });
      } else if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email: values.email.trim(),
          password: values.password,
        });
        if (error)
          throw new Error(
            error.code === "weak_password"
              ? "Use at least 8 characters for your password."
              : "Could not start registration. Check the details or try again later.",
          );
        if (data.session) {
          await supabase.auth.signOut({ scope: "local" });
          throw new Error(
            "Email verification is not configured as required. Contact the project owner.",
          );
        }
        sessionStorage.setItem("asgard.signup-email", values.email.trim());
        beginCooldown();
        void navigate(routes.verify);
      } else {
        if (!pendingSignupEmail)
          throw new Error(
            "Start by creating an account before entering a verification code.",
          );
        const { error } = await supabase.auth.verifyOtp({
          email: pendingSignupEmail,
          token: values.code,
          type: "signup",
        });
        if (error)
          throw new Error(
            "That code did not work or has expired. Check your latest email, or request a new code when the timer ends.",
          );
        sessionStorage.removeItem("asgard.signup-email");
        sessionStorage.removeItem("asgard.resend-at");
        setVerificationComplete(true);
        void navigate(appRoutes.welcome, { replace: true });
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Account access is temporarily unavailable. Try again.",
      );
    }
  }
  async function resend() {
    if (!supabase || remaining > 0 || resending || isSubmitting) return;
    const email =
      mode === "verify" ? pendingSignupEmail : getValues("email").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter the email address where you want the code sent.");
      return;
    }
    setResending(true);
    setError("");
    setMessage("");
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      beginCooldown();
      if (error)
        throw new Error(
          "We could not send another code. Check the email address and connection, then try again when the timer ends.",
        );
      sessionStorage.setItem("asgard.signup-email", email);
      setMessage(
        "If this address can receive a verification code, a new email is on its way.",
      );
    } catch {
      setError(
        "We could not send another code. Check the email address and connection, then try again when the timer ends.",
      );
    } finally {
      setResending(false);
    }
  }
  const title = {
    login: "Welcome back.",
    register: "Create an account.",
    verify: "Check your email.",
    recovery: "Reset your password.",
  }[mode];
  if (mode === "verify" && !pendingSignupEmail && !verificationComplete)
    return <Navigate to={routes.register} replace />;
  return (
    <div className="auth-container">
      <Card className="auth-card">
        <header>
          <h1>{title}</h1>
          <p>
            {mode === "verify"
              ? `We sent a six-digit code to ${pendingSignupEmail}. Check your inbox and spam folder.`
              : mode === "recovery"
                ? "Password recovery is not connected yet. No recovery email will be sent."
                : mode === "register"
                  ? "A place to explore your options and keep your learning together."
                  : "Sign in to return to your learning path."}
          </p>
        </header>
        <form className="form-grid" onSubmit={handleSubmit(submit)}>
          <div className="field">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              readOnly={mode === "verify"}
              aria-invalid={!!errors.email}
              {...register("email", {
                required: "Enter your email.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />
            {errors.email && (
              <p role="alert" className="field-error">
                {errors.email.message}
              </p>
            )}
          </div>
          {(mode === "login" || mode === "register") && (
            <div className="field">
              <Label htmlFor="password">Password</Label>
              <div className="password-input">
                <Input
                  id="password"
                  type={visible ? "text" : "password"}
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  aria-invalid={!!errors.password}
                  {...register("password", {
                    required: "Enter your password.",
                    validate: (value) =>
                      mode !== "register" || validateNewPassword(value),
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setVisible(!visible)}
                  aria-pressed={visible}
                  aria-label={visible ? "Hide password" : "Show password"}
                >
                  {visible ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </Button>
              </div>
              {mode === "register" && (
                <p className="field-help">
                  Use at least 8 characters. Spaces, paste and password managers
                  are supported.
                </p>
              )}
              {errors.password && (
                <p role="alert" className="field-error">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}
          {mode === "register" && (
            <div className="field">
              <Label htmlFor="confirmation">Confirm password</Label>
              <Input
                id="confirmation"
                type={visible ? "text" : "password"}
                autoComplete="new-password"
                aria-invalid={!!errors.confirmation}
                {...register("confirmation", {
                  validate: (value) =>
                    value === getValues("password") ||
                    "The passwords must match.",
                })}
              />
              {errors.confirmation && (
                <p role="alert" className="field-error">
                  {errors.confirmation.message}
                </p>
              )}
            </div>
          )}
          {mode === "verify" && (
            <div className="field">
              <Label htmlFor="email-code">Email confirmation code</Label>
              <Input
                id="email-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="code-input"
                aria-invalid={!!errors.code}
                {...register("code", {
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Enter the six-digit code.",
                  },
                  required: "Enter your verification code.",
                })}
              />
              {errors.code && (
                <p role="alert" className="field-error">
                  {errors.code.message}
                </p>
              )}
            </div>
          )}
          {error && (
            <p role="alert" className="field-error">
              {error}
            </p>
          )}
          {message && <p role="status">{message}</p>}
          <Button
            type="submit"
            disabled={
              !authConfigured ||
              mode === "recovery" ||
              isSubmitting ||
              resending
            }
          >
            {isSubmitting
              ? "Please wait…"
              : mode === "login"
                ? "Sign in"
                : mode === "register"
                  ? "Send email code"
                  : mode === "recovery"
                    ? "Send recovery instructions"
                    : "Verify"}
          </Button>
          {!authConfigured && mode !== "recovery" && (
            <Unavailable>
              Account access is not configured in this environment. No email
              will be sent and no account will be created.
            </Unavailable>
          )}
          {mode === "verify" && (
            <div className="field">
              <p className="field-help" id="resend-help">
                Didn’t get the email? You can request another code when the
                timer ends.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => void resend()}
                disabled={
                  !authConfigured || remaining > 0 || resending || isSubmitting
                }
                aria-describedby="resend-help"
              >
                {resending
                  ? "Requesting code…"
                  : remaining > 0
                    ? `Resend code in ${remaining}s`
                    : "Resend code"}
              </Button>
            </div>
          )}
          {mode === "login" && (
            <Link className="inline-link" to={routes.recovery}>
              Forgot your password?
            </Link>
          )}
          {mode === "verify" && (
            <Link className="inline-link" to={routes.register}>
              Use a different email address
            </Link>
          )}
        </form>
        <div className="form-footer">
          <Link to={mode === "login" ? "/create-account" : "/sign-in"}>
            {mode === "login" ? "Create an account" : "Return to sign-in"}
          </Link>
          <p className="field-help mt-3">
            This local build supports email/password only. Password recovery is
            not connected yet.
          </p>
          <p className="field-help mt-3">
            Google sign-in and authenticator setup await provider verification.
          </p>
        </div>
      </Card>
    </div>
  );
}
