import {
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { LogoutGuardContext, type LogoutGuard } from "./logout-context";

export function LogoutBoundary({ children }: { children: ReactNode }) {
  const guard = useRef<LogoutGuard | null>(null);
  const register = useCallback((check: LogoutGuard) => {
    guard.current = check;
    return () => {
      if (guard.current === check) guard.current = null;
    };
  }, []);
  const canLogout = useCallback(() => !guard.current || guard.current(), []);
  const value = useMemo(
    () => ({ register, canLogout }),
    [register, canLogout],
  );

  return (
    <LogoutGuardContext.Provider value={value}>
      {children}
    </LogoutGuardContext.Provider>
  );
}
