import { useSyncExternalStore } from "react";

const currentTopicKey = "asgard.current-learning-topic";
const currentTopicEvent = "asgard:current-learning-topic-change";
let inMemoryTopicId: string | null = null;
let hasInMemoryTopic = false;

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
