import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { StatusBadge, Unavailable } from "@/components/shared";
import { sampleMilestones } from "@/fixtures/catalog";
import { routes } from "@/lib/routes";
import { authConfigured } from "@/auth/supabase";
import { MIN_PASSWORD_LENGTH } from "@/auth/password";
import { ConnectedAuthPage } from "./connected-page";

export function AuthPage({
  mode,
}: {
  mode: "login" | "register" | "recovery" | "verify";
}) {
  return authConfigured && mode !== "recovery" ? (
    <ConnectedAuthPage key={mode} mode={mode} />
  ) : (
    <PreviewAuthPage key={mode} mode={mode} />
  );
}

export function LandingPage() {
  return (
    <section className="landing">
      <div>
        <h1>
          A direction to explore.
          <br />A path to follow.
        </h1>
        <p className="lead">
          Understand technology careers, explore curated learning roadmaps, and
          find a practical place to begin.
        </p>
        <div className="action-row">
          <Button asChild>
            <Link to={routes.register}>Get started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={routes.login}>Log in</Link>
          </Button>
        </div>
        <p className="landing-note">
          For adults 18 and above. All experience levels welcome.
        </p>
        <div className="landing-preview">
          <p>
            {authConfigured
              ? "Account access and profile saving are available. Career and learning features are being prepared."
              : "Account access is not configured in this environment. Career and learning screens use sample content."}
          </p>
          <Link to={routes.dashboard}>View the UI preview</Link>
        </div>
      </div>
      <div className="path-preview">
        <p>Inside a learning roadmap</p>
        <h2 className="landing-roadmap-title">Frontend Developer</h2>
        <p className="landing-roadmap-intro">Web foundations</p>
        <div className="landing-roadmap-topics">
          {sampleMilestones[0].topics.map((topic) => (
            <div key={topic.id}>
              <span>{topic.title}</span>
              <StatusBadge status={topic.status} />
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link to={routes.roadmap("frontend")}>Preview this roadmap</Link>
        </Button>
        <p className="landing-note">
          Sample content and statuses. Progress saving is not connected.
        </p>
      </div>
    </section>
  );
}

function PasswordField({
  id,
  label,
  register,
  newPassword = false,
}: {
  id: "password" | "confirmation";
  label: string;
  newPassword?: boolean;
  register: ReturnType<
    typeof useForm<{ email: string; password: string; confirmation: string }>
  >["register"];
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <div className="password-input">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={
            id === "confirmation" || newPassword
              ? "new-password"
              : "current-password"
          }
          {...register(id)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </Button>
      </div>
    </div>
  );
}

function PreviewAuthPage({
  mode,
}: {
  mode: "login" | "register" | "recovery" | "verify";
}) {
  const { register } = useForm<{
    email: string;
    password: string;
    confirmation: string;
  }>();
  const isRegistration = mode === "register";
  const title = {
    login: "Welcome back.",
    register: "Create an account.",
    recovery: "Reset your password.",
    verify: "Check your email.",
  }[mode];
  const description = {
    login: "Sign in to return to your learning path.",
    register:
      "A place to explore your options and keep your learning together.",
    recovery: "Enter your email to request password recovery.",
    verify: "Enter the confirmation code from your email, then choose Verify.",
  }[mode];
  return (
    <div className="auth-container">
      <Card className="auth-card">
        <header>
          <h1>{title}</h1>
          <p>{description}</p>
        </header>
        <form
          className="form-grid"
          onSubmit={(event) => event.preventDefault()}
        >
          {mode !== "verify" && (
            <div className="field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
              />
            </div>
          )}
          {(mode === "login" || isRegistration) && (
            <PasswordField
              id="password"
              label="Password"
              register={register}
              newPassword={isRegistration}
            />
          )}
          {isRegistration && (
            <>
              <p className="field-help">
                Use at least {MIN_PASSWORD_LENGTH} characters. Spaces and
                password managers are welcome.
              </p>
              <PasswordField
                id="confirmation"
                label="Confirm password"
                register={register}
              />
            </>
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
                aria-describedby="code-help"
              />
              <p className="field-help" id="code-help">
                Use the six-digit code. Verification requires the button below.
              </p>
            </div>
          )}
          <div>
            <Button type="submit" disabled>
              {mode === "verify"
                ? "Verify"
                : mode === "recovery"
                  ? "Send recovery instructions"
                  : isRegistration
                    ? "Send email code"
                    : "Sign in"}
            </Button>
            <Unavailable>
              Account access is not connected. No email will be sent and no
              account will be created.
            </Unavailable>
          </div>
          {mode === "verify" && (
            <Button disabled variant="outline">
              Resend code (not connected)
            </Button>
          )}
          {mode === "login" && (
            <Link className="inline-link" to={routes.recovery}>
              Forgot your password?
            </Link>
          )}
        </form>
        {(mode === "login" || isRegistration) && (
          <div className="form-footer">
            <p>
              {isRegistration ? "Already have an account?" : "New to Asgard?"}{" "}
              <Link to={isRegistration ? routes.login : routes.register}>
                {isRegistration ? "Sign in" : "Create an account"}
              </Link>
            </p>
            <p className="field-help mt-3">
              Google sign-in and authenticator setup await provider
              verification.
            </p>
          </div>
        )}
        {(mode === "verify" || mode === "recovery") && (
          <Link className="inline-link" to={routes.login}>
            Return to sign-in
          </Link>
        )}
      </Card>
      <p className="landing-note centered">
        Reviewing the design?{" "}
        <Link className="inline-link" to={routes.welcome}>
          Open the UI preview
        </Link>
      </p>
    </div>
  );
}
