/**
 * LocalStorage read/write utilities.
 * Every function is safe to call when storage is unavailable
 * (private mode, quota exceeded, server rendering).
 */

function getStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

/**
 * Reads and parses a JSON value.
 * @returns {{ status: "ok" | "missing" | "invalid", value: unknown }}
 */
export function readStoredJSON(key) {
  const storage = getStorage();
  if (!storage) return { status: "missing", value: null };

  let raw;
  try {
    raw = storage.getItem(key);
  } catch {
    return { status: "missing", value: null };
  }

  if (raw === null || raw === "") return { status: "missing", value: null };

  try {
    return { status: "ok", value: JSON.parse(raw) };
  } catch {
    return { status: "invalid", value: null };
  }
}

/** Serialises and saves a value. Returns true when the write succeeded. */
export function writeStoredJSON(key, value) {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
