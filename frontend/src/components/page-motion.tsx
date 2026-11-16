import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export function PageMotion() {
  const { pathname } = useLocation();
  const previousPath = useRef<string | null>(null);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const content = document.getElementById("main-content");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!content || preference.matches || !content.animate) return;
    const styles = getComputedStyle(content);
    const animation = content.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: parseFloat(styles.getPropertyValue("--motion-standard")) || 180,
      easing: styles.getPropertyValue("--motion-ease-enter").trim() || "ease-out",
    });
    const stop = () => { if (preference.matches) animation.cancel(); };
    preference.addEventListener("change", stop);
    return () => {
      animation.cancel();
      preference.removeEventListener("change", stop);
    };
  }, [pathname]);
  return null;
}
