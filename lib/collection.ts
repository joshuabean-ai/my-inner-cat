// Client-side "collection" persistence. A cat is collected when you draw it by
// finishing the quiz — not by browsing — so pulls are flagged on quiz completion
// (sessionStorage) and recorded on the matching result page (localStorage).

const KEY = "mic:collection:v1";
const PULL_KEY = "mic:pulled";
export const COLLECTION_EVENT = "mic:collection-change";

export function getCollected(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addCollected(id: string): void {
  if (typeof window === "undefined") return;
  const set = new Set(getCollected());
  if (set.has(id)) return;
  set.add(id);
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...set]));
    window.dispatchEvent(new Event(COLLECTION_EVENT));
  } catch {
    /* storage unavailable (private mode) — collection just won't persist */
  }
}

export function clearCollected(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(COLLECTION_EVENT));
  } catch {
    /* ignore */
  }
}

/** Raw snapshot string for useSyncExternalStore (stable until changed). */
export function collectedSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

/** Mark the cat just drawn by the quiz, to be recorded on the result page. */
export function flagPull(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PULL_KEY, id);
  } catch {
    /* ignore */
  }
}

/** Read and clear the just-drawn flag. Returns the cat id, or null. */
export function consumePullFlag(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.sessionStorage.getItem(PULL_KEY);
    if (v) window.sessionStorage.removeItem(PULL_KEY);
    return v;
  } catch {
    return null;
  }
}
