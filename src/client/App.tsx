// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/client/App.tsx — THE "SHELL" THAT WRAPS EVERY PAGE
// ═══════════════════════════════════════════════════════════════════════════
// This is `client.rootComponent` from main.wasp.ts. Whatever this component
// renders is shown on EVERY route. Think of it as the layout frame:
//
//   <App>          ← you are here — decides navbar/toaster/cookies
//     <Outlet />   ← Wasp swaps THIS for whatever page matches the URL
//   </App>
//
// KEY CONCEPTS IT DEMONSTRATES:
//   useLocation()  → React Router hook: "what URL are we on right now?"
//   useMemo()      → compute a value once and only recompute when [deps] change
//   <Outlet />     → React Router: renders the child route (the current page)
//   routes.X.to    → Wasp-generated route constants (type-safe URLs!)
//   {cond && <X/>} → JSX trick: render <X/> only when cond is true
//
// WHY THE NAVBAR VARIES: marketing pages (landing/pricing) get one set of
// nav links, logged-in app pages get another. Log-in/sign-up pages and the
// admin dashboard get NO navbar at all. For Eco Pulse you'll simplify this:
// probably one navbar everywhere (or topbar for app, none for landing).
// ═══════════════════════════════════════════════════════════════════════════
import { useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import { routes } from "wasp/client/router";
import { Toaster } from "../client/components/ui/toaster";
import "./Main.css"; // global CSS (Tailwind + custom styles)
import { NavBar } from "./components/NavBar/NavBar";
import {
  staticNavigationItems,
} from "./components/NavBar/constants";
import { CookieConsentBanner } from "./components/cookie-consent/Banner";

/**
 * use this component to wrap all child components
 * this is useful for templates, themes, and context
 */
export function App() {
  const location = useLocation(); // current URL (updates on every navigation)
  // True when we're on a public "marketing" page (landing or pricing)
  const isMarketingPage = useMemo(() => {
    return (
      location.pathname === routes.LandingPageRoute.to ||
      location.pathname === routes.PricingPageRoute.to
    );
  }, [location]);

  // Pick which nav links to show based on page type
  const navigationItems = staticNavigationItems;

  // Hide the navbar entirely on the login/signup pages (cleaner look)
  const shouldDisplayAppNavBar = useMemo(() => {
    return (
      location.pathname !== routes.LoginRoute.build() &&
      location.pathname !== routes.SignupRoute.build()
    );
  }, [location]);

  // The admin dashboard has its OWN sidebar layout, so skip the navbar there
  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith(routes.AdminRoute.to);
  }, [location]);

  // Nice touch: if the URL has a #hash (e.g. /#features), scroll to that
  // element. That's how the landing page "Features" nav link works.
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location]);

  return (
    <>
      <div className="bg-background text-foreground min-h-screen">
        {isAdminDashboard ? (
          // Admin pages: no navbar — just render the page (admin has its own Sidebar)
          <Outlet />
        ) : (
          <>
            {shouldDisplayAppNavBar && (
              <NavBar navigationItems={navigationItems} />
            )}
            <div className="max-w-(--breakpoint-2xl) mx-auto">
              <Outlet />
            </div>
          </>
        )}
      </div>
      {/* Pop-up notifications (success/error toasts) — rendered app-wide */}
      <Toaster position="bottom-right" />
      {/* GDPR-style cookie consent banner */}
      <CookieConsentBanner />
    </>
  );
}