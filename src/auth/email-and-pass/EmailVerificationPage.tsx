// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: EmailVerificationPage.tsx — "/email-verification"
// ═══════════════════════════════════════════════════════════════════════════
// Where the verification link in the email leads. <VerifyEmailForm /> is
// another Wasp-generated form (auth.wasp.ts → EmailVerificationRoute).
//
// In DEV you never see this page: SKIP_EMAIL_VERIFICATION_IN_DEV=true
// means signup succeeds without verification. In production, users land
// here after clicking their email link.
//
// ECO PULSE: keep, restyle with the others later.
// ═══════════════════════════════════════════════════════════════════════════
import { VerifyEmailForm } from "wasp/client/auth";
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { AuthPageLayout } from "../AuthPageLayout";

export function EmailVerificationPage() {
  return (
    <AuthPageLayout>
      <VerifyEmailForm />
      <br />
      <span className="text-sm font-medium text-gray-900">
        If everything is okay,{" "}
        <WaspRouterLink to={routes.LoginRoute.to} className="underline">
          go to login
        </WaspRouterLink>
      </span>
    </AuthPageLayout>
  );
}