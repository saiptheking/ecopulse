// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/server/emailSender.wasp.ts — WHO SENDS YOUR EMAILS
// ═══════════════════════════════════════════════════════════════════════════
// Wasp needs to send emails for two built-in flows:
//   1. Email verification after signup (a link you must click)
//   2. Password reset
//
// provider: "Dummy"  → NO real emails are sent. The email "content" is
//                      printed in the SERVER LOG instead. This is perfect for
//                      development: sign up, then read the log to copy the link.
//                      (This is why .env.server sets
//                      SKIP_EMAIL_VERIFICATION_IN_DEV=true — so you don't even
//                      need to click the verification link while developing.)
//
// defaultFrom: the "From" address emails would show. Only matters once you
// switch to a real provider (SendGrid/Mailgun) for production — do NOT use
// your real email with "Dummy".
//
// ┌─ ECO PULSE ROADMAP ─────────────────────────────────────────────────────┐
// │ KEEP as-is for development. When Demo Day is close and you want real    │
// │ verification emails, swap provider to e.g. "SMTP" with a real service.  │
// └──────────────────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════════════
import { type EmailSender } from "@wasp.sh/spec";

export const emailSender: EmailSender = {
  // NOTE: "Dummy" provider is just for local development purposes.
  //   Make sure to check the server logs for the email confirmation url (it will not be sent to an address)!
  //   Once you are ready for production, switch to e.g. "SendGrid" or "Mailgun" providers. Check out https://docs.opensaas.sh/guides/email-sending/ .
  provider: "Dummy",
  defaultFrom: {
    name: "Open SaaS App", // → "Eco Pulse"
    // When using a real provider, e.g. SendGrid, you must use the same email address that you configured your account to send out emails with!
    email: "me@example.com", // → an address you control, once you go live
  },
};