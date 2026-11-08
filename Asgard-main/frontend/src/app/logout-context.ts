import { createContext } from "react";

export type LogoutGuard = () => boolean;

export type LogoutGuardContextValue = {
  register: (check: LogoutGuard) => () => void;
  canLogout: () => boolean;
};

export const LogoutGuardContext =
  createContext<LogoutGuardContextValue | null>(null);
