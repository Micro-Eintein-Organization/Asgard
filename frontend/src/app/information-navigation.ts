import { useAuth } from "@/auth/context";
import { appRoutes, routes } from "@/lib/routes";

export const informationPaths = new Set<string>([
  routes.licenses, routes.credits, routes.terms, routes.status,
]);

export function useInformationReturn() {
  const { user, loading, error, mfa } = useAuth();
  return !loading && !error && user?.email_confirmed_at && mfa === "ready"
    ? appRoutes.dashboard : routes.home;
}
