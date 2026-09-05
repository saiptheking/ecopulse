// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/auth/LoginPage.tsx — THE LOGIN PAGE (deceptively small)
// ═══════════════════════════════════════════════════════════════════════════
// Almost all the logic is Wasp-generated: `<LoginForm />` from
// "wasp/client/auth" is a ready-made email+password form (Wasp built it from
// your authConfig). This page just:
//   1. calls useRedirectIfLoggedIn() → if you're ALREADY logged in, bounce
//      to the app instead of showing the login form
//   2. wraps the form in AuthPageLayout (centered card, white box)
//   3. adds "Don't have an account?" / "Forgot password?" links using
//      Wasp's generated route constants (routes.SignupRoute.to, etc.)
//
// HOW TO CUSTOMIZE: Wasp lets you replace LoginForm with your OWN component
// that calls the `login()` function from wasp/client/auth — see the docs
// chapter "Customizing auth UI". (The Figma-style dark form you designed can
// slot in here! Our memory #56 says exactly this: keep Wasp's auth logic,
// replace the generated form UI.)
//
// ECO PULSE: keep as-is for now; restyle later to match your dark theme.
// ═══════════════════════════════════════════════════════════════════════════
import { LoginForm } from "wasp/client/auth"; // the auto-generated form component
import { Link as WaspRouterLink, routes } from "wasp/client/router"; // type-safe links
import { AuthPageLayout } from "./AuthPageLayout";
import { useRedirectIfLoggedIn } from "./hooks/useRedirectIfLoggedIn";

export function LoginPage() {
  useRedirectIfLoggedIn(); // already logged in? → skip this page

  return (
    <AuthPageLayout>
      <LoginForm />
      <br />
      <span className="text-sm font-medium text-gray-900 dark:text-gray-900">
        Don't have an account yet?{" "}
        <WaspRouterLink to={routes.SignupRoute.to} className="underline">
          Go to signup
        </WaspRouterLink>
        .
      </span>
      <br />
      <span className="text-sm font-medium text-gray-900">
        Forgot your password?{" "}
        <WaspRouterLink
          to={routes.RequestPasswordResetRoute.to}
          className="underline"
        >
          Reset it
        </WaspRouterLink>
        .
      </span>
    </AuthPageLayout>
  );
}