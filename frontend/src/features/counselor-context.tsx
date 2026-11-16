import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router";

export type ScreenContext = { label: string; career_ids?: string[]; roadmap_id?: string;
  topic_id?: string; questionnaire_id?: string; question_id?: string; category_id?: string;
  recommendation_run_id?: string; filter?: string };
type Registration = { path: string; value: ScreenContext; token: symbol };
const Context = createContext<{ registration: Registration | null;
  setRegistration: React.Dispatch<React.SetStateAction<Registration | null>> } | null>(null);
export function CounselorContextProvider({ children }: { children: ReactNode }) {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const value = useMemo(() => ({ registration, setRegistration }), [registration]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useScreenContext(value: ScreenContext | null) {
  const context = useContext(Context);
  const { pathname } = useLocation();
  const serialized = JSON.stringify(value);
  const setter = context?.setRegistration;
  useEffect(() => {
    if (!setter || serialized === "null") return;
    const token = Symbol();
    setter({ path: pathname, value: JSON.parse(serialized) as ScreenContext, token });
    return () => setter(previous => previous?.token === token ? null : previous);
  }, [setter, pathname, serialized]);
}
export function useCurrentScreen() {
  const context = useContext(Context);
  const { pathname } = useLocation();
  return context?.registration?.path === pathname ? context.registration.value : null;
}
