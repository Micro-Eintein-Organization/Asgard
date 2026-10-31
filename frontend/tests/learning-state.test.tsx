import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculateStreaks,
  getLocalDateKey,
  readTopicCompletionDates,
  readTopicStatuses,
  setTopicStatus,
  useTopicStatuses,
} from "@/lib/learning-state";

function localDateOffset(date: Date, offset: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + offset);
  return getLocalDateKey(result);
}

beforeEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function TopicStatusSnapshot() {
  const value = useTopicStatuses();
  return (
    <output data-testid="topic-status-snapshot">
      {JSON.stringify({
        statuses: readTopicStatuses(value),
        completionDates: readTopicCompletionDates(value),
      })}
    </output>
  );
}

describe("topic completion dates and streaks", () => {
  it("calculates consecutive current and longest streaks", () => {
    const today = new Date(2026, 9, 31, 12);
    const dates = [-2, -1, 0].map((offset) => localDateOffset(today, offset));
    expect(calculateStreaks(dates, today)).toEqual({
      currentStreak: 3,
      longestStreak: 3,
    });
  });

  it("resets the current streak across a gap and retains the longest streak", () => {
    const today = new Date(2026, 9, 31, 12);
    const dates = [-8, -7, -6, -1, 0].map((offset) =>
      localDateOffset(today, offset),
    );
    expect(calculateStreaks(dates, today)).toEqual({
      currentStreak: 2,
      longestStreak: 3,
    });
  });

  it("starts the current streak yesterday when today has no activity", () => {
    const today = new Date(2026, 9, 31, 12);
    expect(
      calculateStreaks(
        [-2, -1].map((offset) => localDateOffset(today, offset)),
        today,
      ),
    ).toEqual({ currentStreak: 2, longestStreak: 2 });
  });

  it("returns zero streaks for no activity or when neither today nor yesterday is active", () => {
    const today = new Date(2026, 9, 31, 12);
    expect(calculateStreaks([], today)).toEqual({
      currentStreak: 0,
      longestStreak: 0,
    });
    expect(
      calculateStreaks([localDateOffset(today, -3)], today),
    ).toEqual({ currentStreak: 0, longestStreak: 1 });
  });

  it("counts multiple topic completions on one local date as one active day", () => {
    setTopicStatus("topic-a", "Done");
    setTopicStatus("topic-b", "Done");
    const stored = window.localStorage.getItem("asgard.topic-statuses");
    const completionDates = readTopicCompletionDates(stored);
    const activeDays = [...new Set(Object.values(completionDates))];
    expect(Object.keys(completionDates)).toEqual(["topic-a", "topic-b"]);
    expect(activeDays).toHaveLength(1);
    expect(calculateStreaks(activeDays)).toEqual({
      currentStreak: 1,
      longestStreak: 1,
    });
  });

  it("keeps a date active until its last completed topic is undone", () => {
    setTopicStatus("topic-a", "Done");
    setTopicStatus("topic-b", "Done");
    setTopicStatus("topic-a", "Learning");
    let completionDates = readTopicCompletionDates(
      window.localStorage.getItem("asgard.topic-statuses"),
    );
    expect(Object.keys(completionDates)).toEqual(["topic-b"]);

    setTopicStatus("topic-b", "Not started");
    const stored = window.localStorage.getItem("asgard.topic-statuses");
    completionDates = readTopicCompletionDates(stored);
    expect(completionDates).toEqual({});
    expect(readTopicStatuses(stored)).toMatchObject({
      "topic-a": "Learning",
      "topic-b": "Not started",
    });
    expect(calculateStreaks(Object.values(completionDates))).toEqual({
      currentStreak: 0,
      longestStreak: 0,
    });
  });

  it("records a fresh local date when a topic is completed again", () => {
    vi.useFakeTimers();
    const firstDate = new Date(2026, 8, 30, 12);
    vi.setSystemTime(firstDate);
    setTopicStatus("topic-a", "Done");
    setTopicStatus("topic-a", "Learning");
    vi.setSystemTime(new Date(2026, 9, 1, 12));
    setTopicStatus("topic-a", "Done");
    expect(
      readTopicCompletionDates(
        window.localStorage.getItem("asgard.topic-statuses"),
      ),
    ).toEqual({ "topic-a": "2026-10-01" });
  });

  it("keeps legacy Done statuses but does not invent completion dates", () => {
    const stored = JSON.stringify({ "legacy-topic": "Done" });
    expect(readTopicStatuses(stored)).toEqual({ "legacy-topic": "Done" });
    expect(readTopicCompletionDates(stored)).toEqual({});
    expect(calculateStreaks([])).toEqual({
      currentStreak: 0,
      longestStreak: 0,
    });
  });

  it("preserves topic statuses when completion-date metadata is malformed", () => {
    const stored = JSON.stringify({
      "topic-a": "Done",
      "topic-b": "Learning",
      __completionDates: "invalid date map",
    });

    expect(readTopicStatuses(stored)).toEqual({
      "topic-a": "Done",
      "topic-b": "Learning",
    });
    expect(readTopicCompletionDates(stored)).toEqual({});
  });

  it("reads valid partial completion dates without changing statuses", () => {
    const stored = JSON.stringify({
      "topic-a": "Done",
      "topic-b": "Done",
      "topic-c": "Learning",
      __completionDates: {
        "topic-a": "2026-10-30",
        "topic-c": "2026-10-29",
        "removed-topic": "2026-10-28",
      },
    });

    expect(readTopicStatuses(stored)).toEqual({
      "topic-a": "Done",
      "topic-b": "Done",
      "topic-c": "Learning",
    });
    expect(readTopicCompletionDates(stored)).toEqual({
      "topic-a": "2026-10-30",
    });
  });

  it("uses local date fields instead of converting calendar dates to UTC", () => {
    const lateLocalDate = new Date(2026, 5, 1, 23, 45);
    expect(getLocalDateKey(lateLocalDate)).toBe("2026-06-01");
  });

  it("ignores invalid dates when calculating current and longest streaks", () => {
    expect(
      calculateStreaks(
        [
          "2026-03-01",
          "2026-02-30",
          "2026-03-03",
          "2026-13-01",
          "not-a-date",
        ],
        new Date(2026, 2, 3, 12),
      ),
    ).toEqual({ currentStreak: 1, longestStreak: 1 });
  });

  it("calculates a longest streak across the December and January boundary", () => {
    const dates = ["2026-12-30", "2026-12-31", "2027-01-01", "2027-01-02"];
    expect(calculateStreaks(dates, new Date(2027, 0, 2, 12))).toEqual({
      currentStreak: 4,
      longestStreak: 4,
    });
  });

  it("uses the in-memory fallback and notifies same-tab subscribers on storage failure", () => {
    setTopicStatus("topic-a", "Learning");
    render(<TopicStatusSnapshot />);
    const setItem = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new DOMException("Storage unavailable", "SecurityError");
      });

    let storageError: unknown;
    act(() => {
      try {
        setTopicStatus("topic-a", "Done");
      } catch (error) {
        storageError = error;
      }
    });
    expect(storageError).toHaveProperty("message", "Storage unavailable");
    const snapshot = JSON.parse(
      screen.getByTestId("topic-status-snapshot").textContent ?? "{}",
    );
    expect(snapshot.statuses["topic-a"]).toBe("Done");
    expect(snapshot.completionDates["topic-a"]).toBe(getLocalDateKey(new Date()));

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "asgard.unrelated-setting",
          newValue: "updated",
        }),
      );
    });
    const snapshotAfterUnrelatedStorageChange = JSON.parse(
      screen.getByTestId("topic-status-snapshot").textContent ?? "{}",
    );
    expect(snapshotAfterUnrelatedStorageChange.statuses["topic-a"]).toBe("Done");

    setItem.mockRestore();
    act(() => setTopicStatus("topic-a", "Learning"));
  });
});
