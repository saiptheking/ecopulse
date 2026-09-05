// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: NavBar/constants.ts — THE NAVBAR'S MENU (data, not markup)
// ═══════════════════════════════════════════════════════════════════════════
// Nav links live here as plain DATA (arrays of {name, to}), not as JSX.
// NavBar.tsx renders whatever list you hand it. Two menus exist:
//
//   marketingNavigationItems → shown on the landing/pricing pages
//                              ("Features" scrolls to the #features section)
//   demoNavigationitems      → shown inside the app after login
//
// PATTERNS:
//   as const          → makes the array read-only + literal types (safety)
//   routes.X.to       → Wasp-generated URL constant for a route
//   "/#features"      → fragment link: "/" page + scroll to element #features
//
// ┌─ ECO PULSE ROADMAP ─────────────────────────────────────────────────────┐
// │ Rewrite these two arrays:                                               │
// │   marketing: Features, Challenges (→ /#challenges), Sign Up (→ /signup) │
// │   app:        Feed (routes.FeedRoute.to), Submit, Leaderboard, Account  │
// └──────────────────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════════════
import { routes } from "wasp/client/router";
import { BlogUrl, DocsUrl } from "../../../shared/common";
import type { NavigationItem } from "./NavBar";

// Links shown on every navbar (until you delete the blog/docs links)
export const staticNavigationItems: NavigationItem[] = [
  { name: "Home", to: routes.FeedRoute.to },
  { name: "Feed", to: routes.FeedRoute.to },
  { name: "Leaderboard", to: routes.LeaderboardRoute.to },
];  
