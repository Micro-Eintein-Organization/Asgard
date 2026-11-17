import { act, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { StatePanel } from "./shared";
import { LoadingIndicator } from "./loading-indicator";
import { Button } from "./ui/button";

afterEach(() => vi.useRealTimers());

it("keeps loading text accessible and removes the decorative snowflake on completion", () => {
  vi.useFakeTimers();
  const view = render(<StatePanel kind="loading" title="Loading your roadmap">Reading saved progress.</StatePanel>);
  expect(screen.getByRole("status")).toHaveTextContent("Loading your roadmap");
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(view.container.querySelector('.loading-indicator[data-size="panel"] img')).toHaveAttribute("width", "32");
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText(/taking longer than usual/)).toBeVisible();
  view.rerender(<StatePanel kind="success" title="Loaded" />);
  expect(view.container.querySelector(".loading-indicator")).toBeNull();
  expect(screen.queryByText(/taking longer than usual/)).not.toBeInTheDocument();
});

it("preserves a pending button's label and disabled state", () => {
  render(<Button disabled><LoadingIndicator />Saving…</Button>);
  expect(screen.getByRole("button", { name: "Saving…" })).toBeDisabled();
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
});
