// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/auth/SignupPage.tsx — THE SIGNUP PAGE
// ═══════════════════════════════════════════════════════════════════════════
// Mirror of LoginPage: Wasp's `<SignupForm />` handles email+password,
// then the auto-generated backend creates Auth → User rows using the
// userSignupFields you configured (see src/auth/userSignupFields.ts — that's
// where isAdmin/isOfficer get set).
//
// NOTE: with SKIP_EMAIL_VERIFICATION_IN_DEV=true in .env.server, signup
// succeeds immediately in dev (no email needed). In production the user gets
// a verification link first.
//
// ECO PULSE: keep as-is. Later you can add an "I'm an officer" toggle or
// collect a display name by building a custom signup form (same approach as
// LoginPage's customization).
// ═══════════════════════════════════════════════════════════════════════════
import { SignupForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "./AuthPageLayout";
import { useRedirectIfLoggedIn } from "./hooks/useRedirectIfLoggedIn";

export function SignupPage() {
  useRedirectIfLoggedIn();

  return (
    <AuthPageLayout>
      <SignupForm 
        additionalFields={[
          {
            name: "name",
            label: "Full Name",
            type: "input",
            validations: { required: "Full name is required" },
        }, {
            name: "grade",
            label: "Grade",
            type: "input",
            validations: { 
              required: "Grade is required",
              min: { value: 9, message: "Grade must be at least 9" },
              max: { value: 12, message: "Grade must be at most 12" }
            }
        }]}
      />
      <br />
      <span className="text-sm font-medium text-gray-900">
        I already have an account (
        <WaspRouterLink to={routes.LoginRoute.to} className="underline">
          go to login
        </WaspRouterLink>
        ).
      </span>
      <br />
    </AuthPageLayout>
  );
}