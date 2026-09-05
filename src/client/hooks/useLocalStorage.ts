// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: useLocalStorage.ts — useState THAT REMEMBERS ITSELF
// ═══════════════════════════════════════════════════════════════════════════
// A drop-in upgrade to useState: the value is saved to the browser's
// localStorage (keyed by `key`) so it survives page refreshes AND browser
// restarts. useColorMode and useToast build on this.
//
// HOW IT WORKS:
//   - Lazy init: useState(() => {...}) runs the initializer ONCE. It reads
//     localStorage; if a saved value exists, parse it, else use initialValue.
//   - Persist: a useEffect writes the state to localStorage whenever it
//     changes. localStorage stores strings, so JSON.stringify/parse.
//   - Safety: wrapped in try/catch (localStorage can throw in private mode)
//     and guards `typeof window === "undefined"` (server-side rendering).
//
// NOTE the type: the setter accepts either a plain value OR an updater
// function — mirroring useState's real API:
//   setValue("dark")         ← plain
//   setValue(prev => ...)    ← function of previous value
// ═══════════════════════════════════════════════════════════════════════════
import { useEffect, useState } from "react";

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  // State to store our value
  // Pass  initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // useEffect to update local storage when the state changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue;
      // Save state
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}