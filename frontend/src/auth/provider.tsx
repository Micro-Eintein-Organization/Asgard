import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session, User } from "@supabase/supabase-js";
import { AuthContext } from "./context";
import { supabase } from "./supabase";
import { setTransportSession, setUnauthorizedHandler } from "./transport";
import { checkAssurance } from "./mfa";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const generation = useRef(0);
  const [state, setState] = useState<{
    user: User | null;
    loading: boolean;
    error: string | null;
    mfa: "checking" | "required" | "ready";
  }>({
    user: null,
    loading: Boolean(supabase),
    error: null,
    mfa: supabase ? "checking" : "ready",
  });
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let revision = 0;
    function apply(session: Session | null, error: string | null = null) {
      if (!active) return;
      generation.current += 1;
      if (setTransportSession(session)) {
        void queryClient.cancelQueries();
        queryClient.clear();
      }
      setState({ user: session?.user ?? null, loading: false, error,
        mfa: session ? "checking" : "ready" });
      if (session) {
        const expectedGeneration = generation.current;
        // Auth callbacks run under the SDK session lock; check factors after it releases.
        setTimeout(() => {
          void checkAssurance(session.access_token).then(mfa => {
            if (!active || generation.current !== expectedGeneration) return;
            setState(previous => ({ ...previous, mfa, error: null }));
          }).catch(() => {
            if (active && generation.current === expectedGeneration)
              setState(previous => ({ ...previous, error: "Could not check account security. Sign in again." }));
          });
        }, 0);
      }
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
      generation.current += 1;
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
    generation.current += 1;
    await queryClient.cancelQueries();
    queryClient.clear();
    setState({ user: null, loading: false, error: null, mfa: "ready" });
  }
  async function refreshAssurance() {
    if (!supabase) return;
    const expectedGeneration = generation.current;
    const mfa = await checkAssurance();
    if (generation.current !== expectedGeneration) return;
    setState(previous => ({ ...previous, error: null, mfa }));
  }
  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshAssurance }}>
      {children}
    </AuthContext.Provider>
  );
}
