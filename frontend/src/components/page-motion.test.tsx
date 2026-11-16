import { render, cleanup } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { PageMotion } from "./page-motion";

const location = vi.hoisted(() => ({ pathname: "/dashboard", search: "", hash: "" }));
vi.mock("react-router", () => ({ useLocation: () => location }));

const originalAnimate = HTMLElement.prototype.animate;
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, writable: true, value: originalAnimate });
});

function setup(reduced = false) {
  location.pathname = "/dashboard";
  const cancel = vi.fn();
  const animate = vi.fn(() => ({ cancel }));
  const preference = new EventTarget() as EventTarget & { matches: boolean };
  preference.matches = reduced;
  vi.stubGlobal("matchMedia", () => preference);
  Object.defineProperty(HTMLElement.prototype, "animate", { configurable: true, writable: true, value: animate });
  return { animate, cancel, preference };
}

test("fades pathname changes without remounting content or replaying query/hash changes", () => {
  const { animate, cancel } = setup();
  const view = render(<main id="main-content"><input defaultValue="draft" /><PageMotion /></main>);
  const input = view.getByRole("textbox");
  location.search = "?topic=one";
  location.hash = "#details";
  view.rerender(<main id="main-content"><input defaultValue="draft" /><PageMotion /></main>);
  expect(animate).toHaveBeenCalledTimes(1);
  location.pathname = "/careers";
  view.rerender(<main id="main-content"><input defaultValue="draft" /><PageMotion /></main>);
  expect(animate).toHaveBeenCalledTimes(2);
  expect(cancel).toHaveBeenCalledTimes(1);
  expect(view.getByRole("textbox")).toBe(input);
});

test("skips reduced motion and cancels when the preference changes", () => {
  const { animate, cancel, preference } = setup(true);
  const view = render(<main id="main-content"><PageMotion /></main>);
  expect(animate).not.toHaveBeenCalled();
  preference.matches = false;
  location.pathname = "/careers";
  view.rerender(<main id="main-content"><PageMotion /></main>);
  expect(animate).toHaveBeenCalledTimes(1);
  preference.matches = true;
  preference.dispatchEvent(new Event("change"));
  expect(cancel).toHaveBeenCalledTimes(1);
});
