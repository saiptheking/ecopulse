// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: useDebounce.ts — WAIT UNTIL THE USER STOPS TYPING
// ═══════════════════════════════════════════════════════════════════════════
// "Debounce" = delay an action until input goes quiet for a moment.
// Example: a search box fires a query on EVERY keystroke unless you debounce.
// This hook returns a value that lags `value` by `delay` ms: type "eco" and
// the debounced value only updates after you pause — so you fetch once,
// not 3 times.
//
// THE MACHINERY (classic useEffect pattern — memorize it):
//   1. local state debouncedValue starts as the current value
//   2. useEffect schedules a timer: "in `delay` ms, set debouncedValue = value"
//   3. The cleanup function (return clearTimeout) cancels the previous timer
//      if the effect re-runs first — i.e. if the value changed again.
//   Net effect: only the LAST value survives the delay. ⏱️
//
// <T> is TypeScript generics: "works with any type" (string, number, ...).
// Eco Pulse: use this for a live leaderboard search box later.
// ═══════════════════════════════════════════════════════════════════════════
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer); // cancel previous timer if value/delay changed
  }, [value, delay]);

  return debouncedValue;
}