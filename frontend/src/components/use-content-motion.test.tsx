import { useRef } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { useContentMotion } from "./use-content-motion";

const originalAnimate = HTMLElement.prototype.animate;
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, writable: true, value: originalAnimate });
});

function Content({ identity }: { identity: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  useContentMotion(ref, identity);
  return <div ref={ref}><input defaultValue="saved draft" /></div>;
}

function setup(reduced = false) {
  const preference = new EventTarget() as EventTarget & { matches: boolean };
  preference.matches = reduced;
  vi.stubGlobal("matchMedia", () => preference);
  const cancels: ReturnType<typeof vi.fn>[] = [];
  const animate = vi.fn(() => {
    const cancel = vi.fn();
    cancels.push(cancel);
    return { cancel };
  });
  Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, writable: true, value: animate });
  return { animate, cancels, preference };
}

test("skips initial/unchanged content and preserves drafts and focus during replacement", () => {
  const { animate, cancels } = setup();
  const view = render(<Content identity={null} />);
  view.rerender(<Content identity="one" />);
  expect(animate).not.toHaveBeenCalled();
  const input = view.getByRole("textbox") as HTMLInputElement;
  input.value = "unsaved selection";
  input.focus();
  view.rerender(<Content identity="two" />);
  view.rerender(<Content identity="two" />);
  expect(animate).toHaveBeenCalledTimes(1);
  view.rerender(<Content identity="three" />);
  expect(cancels[0]).toHaveBeenCalledOnce();
  expect(input).toHaveFocus();
  expect(input.value).toBe("unsaved selection");
  expect(view.getByRole("textbox")).toBe(input);
  view.unmount();
  expect(cancels[1]).toHaveBeenCalledOnce();
});

test("respects reduced motion and cancels immediately on a live preference change", () => {
  const { animate, cancels, preference } = setup(true);
  const view = render(<Content identity="one" />);
  view.rerender(<Content identity="two" />);
  expect(animate).not.toHaveBeenCalled();
  preference.matches = false;
  view.rerender(<Content identity="three" />);
  preference.matches = true;
  preference.dispatchEvent(new Event("change"));
  expect(cancels[0]).toHaveBeenCalledOnce();
});

test("keeps content visible without Web Animations support", () => {
  setup();
  Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, writable: true, value: undefined });
  const view = render(<Content identity="one" />);
  view.rerender(<Content identity="two" />);
  expect(view.getByRole("textbox")).toBeVisible();
});
