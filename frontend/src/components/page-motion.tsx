import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { animateContent } from "./use-content-motion";

export function PageMotion() {
  const { pathname } = useLocation();
  const previousPath = useRef<string | null>(null);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const content = document.getElementById("main-content");
    if (content) return animateContent(content, 6);
  }, [pathname]);
  return null;
}
