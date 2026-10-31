import { useSyncExternalStore } from "react";
import type { TopicState } from "@/components/shared";

const currentTopicKey = "asgard.current-learning-topic";
const topicStatusesKey = "asgard.topic-statuses";
const completionDatesProperty = "__completionDates";
const currentTopicEvent = "asgard:current-learning-topic-change";
let inMemoryTopicId: string | null = null;
let hasInMemoryTopic = false;
let inMemoryTopicStatuses: string | null = null;

function getCurrentTopicSnapshot() {
  try {
    return window.localStorage.getItem(currentTopicKey) ??
      (hasInMemoryTopic ? inMemoryTopicId : null);
  } catch {
    return hasInMemoryTopic ? inMemoryTopicId : null;
  }
}

function subscribeToCurrentTopic(onChange: () => void) {
  function onStorageChange(event: StorageEvent) {
    if (event.key === null || event.key === currentTopicKey) {
      hasInMemoryTopic = false;
      inMemoryTopicId = null;
    }
    if (event.key === null || event.key === topicStatusesKey) {
      inMemoryTopicStatuses = null;
    }
    onChange();
  }
  window.addEventListener(currentTopicEvent, onChange);
  window.addEventListener("storage", onStorageChange);
  onChange();
  return () => {
    window.removeEventListener(currentTopicEvent, onChange);
    window.removeEventListener("storage", onStorageChange);
  };
}

export function useCurrentTopicId() {
  return useSyncExternalStore(
    subscribeToCurrentTopic,
    getCurrentTopicSnapshot,
    () => null,
  );
}

function getTopicStatusesSnapshot() {
  if (inMemoryTopicStatuses !== null) return inMemoryTopicStatuses;
  try {
    return window.localStorage.getItem(topicStatusesKey);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLocalDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31)
    return false;
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readTopicCompletionDates(value: string | null) {
  if (!value) return {} satisfies Record<string, string>;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || !isRecord(parsed[completionDatesProperty]))
      return {} satisfies Record<string, string>;
    return Object.fromEntries(
      Object.entries(parsed[completionDatesProperty]).filter(
        (entry): entry is [string, string] =>
          parsed[entry[0]] === "Done" && isLocalDateKey(entry[1]),
      ),
    );
  } catch {
    return {} satisfies Record<string, string>;
  }
}

function localDateOrdinal(dateKey: string) {
  if (!isLocalDateKey(dateKey)) return null;
  const [year, month, day] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

export function calculateStreaks(
  activeDateKeys: readonly string[],
  today = new Date(),
) {
  const activeDays = new Set(
    activeDateKeys
      .map(localDateOrdinal)
      .filter((day): day is number => day !== null),
  );
  let longestStreak = 0;
  let previousDay: number | null = null;
  let runningStreak = 0;
  for (const day of [...activeDays].sort((a, b) => a - b)) {
    runningStreak = previousDay === day - 1 ? runningStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, runningStreak);
    previousDay = day;
  }

  const todayOrdinal = localDateOrdinal(getLocalDateKey(today));
  let currentDay =
    todayOrdinal !== null && activeDays.has(todayOrdinal)
      ? todayOrdinal
      : todayOrdinal !== null && activeDays.has(todayOrdinal - 1)
        ? todayOrdinal - 1
        : null;
  let currentStreak = 0;
  while (currentDay !== null && activeDays.has(currentDay)) {
    currentStreak += 1;
    currentDay -= 1;
  }
  return { currentStreak, longestStreak };
}

export function readTopicStatuses(value: string | null) {
  if (!value) return {} satisfies Record<string, TopicState>;
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
      return {} satisfies Record<string, TopicState>;
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, TopicState] =>
          entry[1] === "Not started" ||
          entry[1] === "Learning" ||
          entry[1] === "Done" ||
          entry[1] === "Skipped",
      ),
    ) as Record<string, TopicState>;
  } catch {
    return {} satisfies Record<string, TopicState>;
  }
}

export function useTopicStatuses() {
  return useSyncExternalStore(
    subscribeToCurrentTopic,
    getTopicStatusesSnapshot,
    () => null,
  );
}

export function setTopicStatus(topicId: string, status: TopicState) {
  const snapshot = getTopicStatusesSnapshot();
  const statuses = readTopicStatuses(snapshot);
  const completionDates = readTopicCompletionDates(snapshot);
  if (status === "Done") {
    if (!completionDates[topicId])
      completionDates[topicId] = getLocalDateKey(new Date());
  } else {
    delete completionDates[topicId];
  }
  const next = JSON.stringify({
    ...statuses,
    [topicId]: status,
    [completionDatesProperty]: completionDates,
  });
  let storageError: unknown;
  try {
    window.localStorage.setItem(topicStatusesKey, next);
    inMemoryTopicStatuses = null;
  } catch (error) {
    inMemoryTopicStatuses = next;
    storageError = error;
  }
  window.dispatchEvent(new Event(currentTopicEvent));
  if (storageError) throw storageError;
}

export function setCurrentTopicId(topicId: string) {
  let storageError: unknown;
  try {
    window.localStorage.setItem(currentTopicKey, topicId);
    inMemoryTopicId = null;
    hasInMemoryTopic = false;
  } catch (error) {
    inMemoryTopicId = topicId;
    hasInMemoryTopic = true;
    storageError = error;
  }
  window.dispatchEvent(new Event(currentTopicEvent));
  if (storageError) throw storageError;
}
