import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/auth/context";
import { routes } from "@/lib/routes";

type Guard = () => boolean;
const LogoutGuardContext = createContext<RefObject<Guard | null> | null>(null);

export function LogoutBoundary({ children }: { children: ReactNode }) {
  const guard = useRef<Guard | null>(null);
  return (
    <LogoutGuardContext.Provider value={guard}>
      {children}
    </LogoutGuardContext.Provider>
  );
}

export function useLogoutGuard(check: Guard) {
  const guard = useContext(LogoutGuardContext);
  useEffect(() => {
    if (!guard) return;
    guard.current = check;
    return () => {
      if (guard.current === check) guard.current = null;
    };
  }, [guard, check]);
}

export function useLogout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const guard = useContext(LogoutGuardContext);
  return async () => {
    if (guard?.current && !guard.current()) return;
    await signOut();
    await navigate(routes.home, { replace: true });
  };
}
