import { Link, Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { StatePanel } from "@/components/shared";
import { appRoutes, routes } from "@/lib/routes";
import { authConfigured } from "@/auth/supabase";
import { ConnectedAuthPage } from "./connected-page";
import { useAuth } from "@/auth/context";

export function AuthPage({
  mode,
}: {
  mode: "login" | "register" | "recovery" | "verify";
}) {
  return <ConnectedAuthPage key={mode} mode={mode} />;
}

export function LandingPage() {
  const { user, loading, error } = useAuth();
  if (loading)
    return (
      <StatePanel kind="loading" title="Restoring your session">
        Checking account access.
      </StatePanel>
    );
  if (user?.email_confirmed_at && !error)
    return <Navigate to={appRoutes.dashboard} replace />;
  return (
    <section className="landing">
      <div>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
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
              ? "Sign in to manage your profile and explore the published career catalog. AI recommendations and PDF uploads are unavailable."
              : "Account access is not configured in this environment."}
          </p>
        </div>
      </div>
      <div className="path-preview">
        <p>Your learning path</p>
        <h2 className="landing-roadmap-title">Find a place to begin</h2>
        <p className="landing-roadmap-intro">Explore at your pace</p>
        <div className="landing-roadmap-topics">
          {[
            "Browse published careers",
            "Choose your current roadmap",
            "Read topics and learning resources",
            "Record your learning progress",
          ].map((step) => (
            <div key={step}>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6 w-full">
          <Link to={routes.login}>Log in to explore</Link>
        </Button>
        <p className="landing-note">
          Available careers depend on the reviewed content published in this
          environment.
        </p>
      </div>
    </section>
  );
}
