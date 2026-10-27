import { Link, Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { StatusBadge, StatePanel } from "@/components/shared";
import { sampleMilestones } from "@/fixtures/catalog";
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
              ? "Account access and profile saving are available. Career and learning screens use labeled demo content."
              : "Account access is not configured in this environment. Career and learning screens use sample content."}
          </p>
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
          <Link to={appRoutes.roadmap("frontend")}>View this roadmap</Link>
        </Button>
        <p className="landing-note">
          Sample content and statuses. Progress saving is not connected.
        </p>
      </div>
    </section>
  );
}
