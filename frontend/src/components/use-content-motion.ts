import { useEffect, useRef, type RefObject } from "react";

export function animateContent(content: HTMLElement, distance = 4) {
  if (!content.animate || typeof window.matchMedia !== "function") return;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (preference.matches) return;
  const styles = getComputedStyle(content);
  const animation = content.animate(
    [{ opacity: 0, translate: `0 ${distance}px` }, { opacity: 1, translate: "0 0" }],
    {
      duration: parseFloat(styles.getPropertyValue("--motion-standard")) || 220,
      easing: styles.getPropertyValue("--motion-ease-enter").trim() || "ease-out",
    },
  );
  const stop = () => { if (preference.matches) animation.cancel(); };
  preference.addEventListener("change", stop);
  return () => {
    animation.cancel();
    preference.removeEventListener("change", stop);
  };
}

export function useContentMotion(ref: RefObject<HTMLElement | null>, changeKey: string | null) {
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (changeKey === null || !ref.current) return;
    const old = previous.current;
    previous.current = changeKey;
    if (old === null || old === changeKey) return;
    return animateContent(ref.current);
  }, [ref, changeKey]);
}
