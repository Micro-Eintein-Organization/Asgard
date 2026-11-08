import {
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/auth/context";
import { routes } from "@/lib/routes";
import { LogoutGuardContext, type LogoutGuard } from "./logout-context";

export function useLogoutGuard(check: LogoutGuard) {
  const context = useContext(LogoutGuardContext);
  useEffect(() => {
    if (!context) return;
    return context.register(check);
  }, [context, check]);
}

export function useLogout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const context = useContext(LogoutGuardContext);
  return async () => {
    if (context && !context.canLogout()) return;
    await signOut();
    await navigate(routes.home, { replace: true });
  };
}
