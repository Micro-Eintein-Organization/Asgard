import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
};
export const AuthContext = createContext<AuthState | null>(null);
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider is required.");
  return context;
}
