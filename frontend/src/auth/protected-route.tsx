import { Link, Navigate, Outlet } from "react-router";
import { StatePanel } from "@/components/shared";
import { useAuth } from "./context";
import { authConfigured } from "./supabase";

export function ProtectedRoute() {
  const { user, loading, error, mfa } = useAuth();
  if (!authConfigured)
    return (
      <StatePanel kind="empty" title="Account setup awaits approval">
        Local authentication and database setup have not been activated.
      </StatePanel>
    );
  if (loading)
    return (
      <StatePanel kind="loading" title="Restoring your session">
        Checking account access.
      </StatePanel>
    );
  if (error)
    return (
      <StatePanel
        kind="error"
        title="Session unavailable"
        action={<Link to="/sign-in">Sign in again</Link>}
      >
        {error}
      </StatePanel>
    );
  if (!user) return <Navigate to="/sign-in" replace />;
  if (!user.email_confirmed_at) return <Navigate to="/check-email" replace />;
  if (mfa === "required") return <Navigate to="/verify-2fa" replace />;
  if (mfa === "checking") return <StatePanel kind="loading" title="Checking account security">Please wait.</StatePanel>;
  return <Outlet />;
}
