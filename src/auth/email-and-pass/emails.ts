// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: email-and-pass/emails.ts — THE CONTENT OF AUTH EMAILS
// ═══════════════════════════════════════════════════════════════════════════
// These two functions build the emails Wasp sends (referenced from
// auth.wasp.ts: emailVerification.getEmailContentFn + passwordReset...).
//
// Type signatures: GetVerificationEmailContentFn expects ({ verificationLink })
// and returns { subject, text, html }. Wasp fills in the link for you.
//
//   verificationLink → the URL that opens EmailVerificationRoute
//   passwordResetLink → URL that opens PasswordResetRoute
//
// ECO PULSE: keep. Rephrase the copy to sound like Eco Pulse when you
// rebrand ("Welcome to Eco Pulse!"). The html-only-on-button version is
// fine; some email clients block html — check your sender later.
// ═══════════════════════════════════════════════════════════════════════════
import {
  type GetPasswordResetEmailContentFn,
  type GetVerificationEmailContentFn,
} from "wasp/server/auth";

export const getVerificationEmailContent: GetVerificationEmailContentFn = ({
  verificationLink, // ← Wasp passes this in
}) => ({
  subject: "Verify your email",
  text: `Click the link below to verify your email: ${verificationLink}`,
  html: `
        <p>Click the link below to verify your email</p>
        <a href="${verificationLink}">Verify email</a>
    `,
});

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = ({
  passwordResetLink,
}) => ({
  subject: "Password reset",
  text: `Click the link below to reset your password: ${passwordResetLink}`,
  html: `
        <p>Click the link below to reset your password</p>
        <a href="${passwordResetLink}">Reset password</a>
    `,
});