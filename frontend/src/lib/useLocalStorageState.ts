import { useState } from 'react';

export function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;
    try {
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  });

  function set(next: T) {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch (error) {
      // Persistence can fail (e.g. QuotaExceededError). Keep the in-memory state
      // and warn rather than throwing out of the state setter and aborting the caller.
      console.warn(`useLocalStorageState: failed to persist "${key}"`, error);
    }
  }

  return [value, set] as const;
}
