// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: PasswordResetPage.tsx — "/password-reset"
// ═══════════════════════════════════════════════════════════════════════════
// Where the password-reset link leads. <ResetPasswordForm /> takes the new
// password and submits it to Wasp's generated reset action.
//
// ECO PULSE: keep as-is (part of standard auth).
// ═══════════════════════════════════════════════════════════════════════════
import { ResetPasswordForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "../AuthPageLayout";

export function PasswordResetPage() {
  return (
    <AuthPageLayout>
      <ResetPasswordForm />
      <br />
      <span className="text-sm font-medium text-gray-900">
        If everything is okay,{" "}
        <WaspRouterLink to={routes.LoginRoute.to}>go to login</WaspRouterLink>
      </span>
    </AuthPageLayout>
  );
}