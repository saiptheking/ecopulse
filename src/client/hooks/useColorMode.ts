// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: useColorMode.ts — CUSTOM HOOK: "LIGHT OR DARK MODE?"
// ═══════════════════════════════════════════════════════════════════════════
// A "custom hook" = a normal function that uses React hooks (useState,
// useEffect, ...) so multiple components can share the same logic.
// Convention: names start with "use".
//
// HOW IT WORKS:
//   1. useLocalStorage("color-theme", "light") → reads the saved mode from
//      the browser's localStorage on first render; returns [value, setter].
//   2. useEffect runs AFTER every render where [colorMode] changed: it adds
//      the CSS class "dark" to <body> (or removes it). In this template,
//      all dark-mode styles are gated behind body.dark (see Main.css).
//
// WHY USE EFFECT? Because touching document.body is a "side effect" — React
// forbids it during rendering, so it must happen in useEffect.
//
// HOW TO USE IT: const [mode, setMode] = useColorMode();
//   setMode("dark") → persists + applies instantly.
// Echo it: this is the same shape as Wasp's useQuery/useAuth hooks.
// ═══════════════════════════════════════════════════════════════════════════
import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export function useColorMode() {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    if (colorMode === "dark") {
      bodyClass.add(className); // body.dark → dark styles kick in
    } else {
      bodyClass.remove(className);
    }
  }, [colorMode]); // re-run only when colorMode changes

  return [colorMode, setColorMode]; // API identical to useState
}