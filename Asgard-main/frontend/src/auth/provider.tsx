import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { AuthContext } from "./context";
import { supabase } from "./supabase";
import { setTransportSession, setUnauthorizedHandler } from "./transport";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<{
    user: User | null;
    loading: boolean;
    error: string | null;
  }>({
    user: null,
    loading: Boolean(supabase),
    error: null,
  });
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let revision = 0;
    function apply(session: Session | null, error: string | null = null) {
      if (!active) return;
      if (setTransportSession(session)) {
        void queryClient.cancelQueries();
        queryClient.clear();
      }
      setState({ user: session?.user ?? null, loading: false, error });
    }
    setUnauthorizedHandler(() => {
      apply(null);
      void supabase!.auth.signOut({ scope: "local" }).catch(() => undefined);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      revision += 1;
      apply(session);
    });
    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (revision === 0)
          apply(
            data.session,
            error
              ? "Could not restore your session. Try signing in again."
              : null,
          );
      })
      .catch(() => {
        if (revision === 0)
          apply(null, "Could not restore your session. Try signing in again.");
      });
    return () => {
      active = false;
      subscription.unsubscribe();
      setUnauthorizedHandler(null);
    };
  }, [queryClient]);

  async function signOut() {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error)
      throw new Error(
        "Could not sign out. Check your connection and try again.",
      );
    setTransportSession(null);
    await queryClient.cancelQueries();
    queryClient.clear();
    setState({ user: null, loading: false, error: null });
  }
  return (
    <AuthContext.Provider value={{ ...state, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
