import { useSyncExternalStore } from "react";
import type { TopicState } from "@/components/shared";

const currentTopicKey = "asgard.current-learning-topic";
const topicStatusesKey = "asgard.topic-statuses";
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
  function onStorageChange() {
    hasInMemoryTopic = false;
    inMemoryTopicId = null;
    inMemoryTopicStatuses = null;
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
  try {
    return window.localStorage.getItem(topicStatusesKey) ?? inMemoryTopicStatuses;
  } catch {
    return inMemoryTopicStatuses;
  }
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
  const statuses = readTopicStatuses(getTopicStatusesSnapshot());
  const next = JSON.stringify({ ...statuses, [topicId]: status });
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
