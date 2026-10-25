import { useLocation } from "react-router";
import { appRoutes, routes } from "./routes";

export function usePageRoutes() {
  return useIsPreview() ? routes : appRoutes;
}

export function useIsPreview() {
  const { pathname } = useLocation();
  return pathname === "/preview" || pathname.startsWith("/preview/");
}
