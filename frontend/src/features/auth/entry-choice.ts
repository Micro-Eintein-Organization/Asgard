const choiceKey = (userId: string) => `asgard.entry-choice.v1.${userId}`;

export function rememberEntryChoice(userId: string) {
  try { localStorage.setItem(choiceKey(userId), "chosen"); } catch { /* Navigation still works without browser storage. */ }
}

export function hasEntryChoice(userId: string) {
  try { return localStorage.getItem(choiceKey(userId)) === "chosen"; } catch { return false; }
}
