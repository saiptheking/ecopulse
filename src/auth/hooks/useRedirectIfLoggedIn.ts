// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/auth/hooks/useRedirectIfLoggedIn.ts — YOUR FIRST CUSTOM HOOK
// ═══════════════════════════════════════════════════════════════════════════
// A custom hook = a normal function that uses other hooks and bundles a
// behavior. Naming rule: MUST start with "use" (that's how React knows it's
// a hook). Here:
//
//   1. useAuth() from "wasp/client/auth" — returns the logged-in user
//      (or null). It's reactive: the component re-renders when login state
//      changes.
//   2. useNavigate() from react-router — a function to change the URL.
//   3. useEffect runs AFTER render: if there's a user, navigate away.
//
// Usage pattern on auth pages: "if you're logged in, don't show me the
// login form — send me to the app."
//
// ECO PULSE: this is the same idea as a GUARD. For pages only officers can
// see (the approval screen), you'll write a similar hook: if user isn't
// officer → navigate to /feed (or show "you don't have access").
// ═══════════════════════════════════════════════════════════════════════════
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "wasp/client/auth";

export function useRedirectIfLoggedIn(redirectTo = "/feed") {
  // 🔥 Eco Pulse: change the default to "/feed"
  const { data: user } = useAuth(); // who's logged in (or null)
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(redirectTo); // bounce to the app
    }
  }, [user, navigate, redirectTo]); // re-run when any of these change
}