// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: useIsLandingPage.ts — "ARE WE ON THE LANDING PAGE RIGHT NOW?"
// ═══════════════════════════════════════════════════════════════════════════
// Tiny custom hook: returns true when the current URL is "/" (the landing
// page route). Components use it to change their look on the homepage.
//
// PATTERNS ON DISPLAY:
//   useLocation()  → React Router: re-renders on every navigation
//   useMemo(...)   → only recompute when location changes (perf nicety)
//   routes.LandingPageRoute.to → Wasp-generated constant for "/" (type-safe)
//
// For Eco Pulse you might extend this idea: useIsAppPage (true inside /feed,
// /submit, /leaderboard) to show the app navbar vs. the landing navbar.
// ═══════════════════════════════════════════════════════════════════════════
import { useMemo } from "react";
import { useLocation } from "react-router";
import { routes } from "wasp/client/router";

export const useIsLandingPage = () => {
  const location = useLocation();

  return useMemo(() => {
    return location.pathname === routes.LandingPageRoute.to;
  }, [location]);
};