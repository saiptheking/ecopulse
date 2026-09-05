// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: RequestPasswordResetPage.tsx — "/request-password-reset"
// ═══════════════════════════════════════════════════════════════════════════
// The "Forgot your password?" page (linked from LoginPage). The generated
// <ForgotPasswordForm /> asks for the email and triggers the reset email.
//
// ECO PULSE: keep as-is.
// ═══════════════════════════════════════════════════════════════════════════
import { ForgotPasswordForm } from "wasp/client/auth";
import { AuthPageLayout } from "../AuthPageLayout";

export function RequestPasswordResetPage() {
  return (
    <AuthPageLayout>
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}