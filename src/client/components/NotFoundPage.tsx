// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: NotFoundPage.tsx — THE 404 PAGE (any URL that matches no route)
// ═══════════════════════════════════════════════════════════════════════════
// Registered in main.wasp.ts as: route("NotFoundRoute", "*", page(NotFoundPage))
//   → the "*" pattern = "catch anything unmatched."
//
// TEACHES YOU TWO WASP-ISMS:
//   useAuth() from "wasp/client/auth"
//     → Wasp-generated hook. Returns { data: user } where user is the logged-in
//       User (or null). The page re-renders automatically when auth changes.
//   routes.X.to from "wasp/client/router"
//     → type-safe link targets generated from your route names. Using these
//       means a typo in a URL string breaks at compile time, not in production.
//       (routes.FeedRoute.to → "/feed", routes.LandingPageRoute.to → "/")
//
// HOW TO READ THE JSX: this is one styled <div> with a heading, a paragraph,
// and a link button. className values are Tailwind utility classes.
// For Eco Pulse: keep this page, just point logged-in users to "/feed"
// instead of the demo app route.
// ═══════════════════════════════════════════════════════════════════════════
import { useAuth } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";

export function NotFoundPage() {
  const { data: user } = useAuth(); // null when logged out, User object when logged in

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <p className="text-bodydark mb-8 text-lg">
          Oops! The page you're looking for doesn't exist.
        </p>
        <WaspRouterLink
          // Send logged-in users to the app, everyone else to the landing page
          to={user ? routes.FeedRoute.to : routes.LandingPageRoute.to}
          className="text-accent-foreground bg-accent hover:bg-accent/90 inline-block rounded-lg px-8 py-3 font-semibold transition duration-300"
        >
          Go Back Home
        </WaspRouterLink>
      </div>
    </div>
  );
}