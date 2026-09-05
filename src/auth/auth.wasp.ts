// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/auth/auth.wasp.ts — YOU DECLARE LOGIN/SIGNUP HERE
// ═══════════════════════════════════════════════════════════════════════════
// Wasp ships working email auth out of the box. This file is the declaration:
//
//   authConfig (exported, referenced from main.wasp.ts as `auth: authConfig`):
//     - userEntity: "User"        → which Prisma model represents a user
//     - methods: { email }        → WHICH login methods are active. Only the
//                                    `email` one is uncommented; google/gitHub/
//                                    discord/usernameAndPassword are defined
//                                    above as "demo" (note the @ts-expect-error
//                                    — they're placeholders, not wired up)
//     - onAuthSucceededRedirectTo → where users land after login/signup
//     - onAuthFailedRedirectTo    → where users land on a failed login
//
//   emailAuthMethod config:
//     - fromField  → the "From" address on auth emails
//     - emailVerification → sends a verification email using the function
//       getVerificationEmailContent (src/auth/email-and-pass/emails.ts)
//     - passwordReset → same, for password resets
//     - userSignupFields → HOW the new user's Prisma fields get filled at
//       signup (src/auth/userSignupFields.ts) — this is where isAdmin gets
//       set, and where YOU will set isOfficer for Eco Pulse!
//
//   authSpec: just routes + pages, same as every other feature's spec:
//     route("LoginRoute", "/login", page(LoginPage))
//     → URL /login renders the LoginPage component. Wasp builds react-router
//       routes from these declarations — you never write a <Route> yourself.
//
// 📌 ECO PULSE:
//   KEEP   — the email method + all five routes (you need signup/login).
//   CHANGE — onAuthSucceededRedirectTo: "/feed" → "/feed"
//            (your main page after login).
//   CHANGE — fromField. name: "Open SaaS App" → "Eco Pulse",
//            email: your real from-address later.
//   DELETE — the four commented demo auth methods (google/github/discord/
//            usernameAndPassword) + their imports from userSignupFields.
//   ADD    — isOfficer to userSignupFields (based on email or manual DB edit).
// ═══════════════════════════════════════════════════════════════════════════
import {
  page,
  route,
  type Auth,
  type AuthMethods,
  type Spec,
} from "@wasp.sh/spec";

// `with { type: "ref" }` = "Wasp, this component/function lives in this file — wire it up."
import { LoginPage } from "./LoginPage" with { type: "ref" };
import { SignupPage } from "./SignupPage" with { type: "ref" };
import { EmailVerificationPage } from "./email-and-pass/EmailVerificationPage" with { type: "ref" };
import { PasswordResetPage } from "./email-and-pass/PasswordResetPage" with { type: "ref" };
import { RequestPasswordResetPage } from "./email-and-pass/RequestPasswordResetPage" with { type: "ref" };
import {
  getPasswordResetEmailContent,
  getVerificationEmailContent,
} from "./email-and-pass/emails" with { type: "ref" };
import {
  // Only getEmailUserFields is actually used (see authConfig below):
  getDiscordAuthConfig,
  getDiscordUserFields,
  getEmailUserFields, // ← this one powers signup
  getGitHubAuthConfig,
  getGitHubUserFields,
  getGoogleAuthConfig,
  getGoogleUserFields,
} from "./userSignupFields" with { type: "ref" };

// The email-auth settings object:
const emailAuthMethod: NonNullable<AuthMethods["email"]> = {
  fromField: {
    name: "Open SaaS App", // 🔥 → "Eco Pulse"
    email: "me@example.com", // 🔥 → your real address later
  },
  emailVerification: {
    clientRoute: "EmailVerificationRoute", // the route the link in the email opens
    getEmailContentFn: getVerificationEmailContent, // builds the email's HTML/text
  },
  passwordReset: {
    clientRoute: "PasswordResetRoute",
    getEmailContentFn: getPasswordResetEmailContent,
  },
  userSignupFields: getEmailUserFields, // fills User fields at signup (see that file!)
};

// Plug the following authentication methods in the `authConfig` below to enable them.
// Do note that `email` and `usernameAndPassword` are mutually exclusive.
// @ts-expect-error Demo purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const usernameAndPasswordAuthMethod: NonNullable<
  AuthMethods["usernameAndPassword"]
> = {};
// @ts-expect-error Demo purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const googleAuthMethod: NonNullable<AuthMethods["google"]> = {
  userSignupFields: getGoogleUserFields,
  configFn: getGoogleAuthConfig,
};
// @ts-expect-error Demo purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const gitGubAuthMethod: NonNullable<AuthMethods["gitHub"]> = {
  userSignupFields: getGitHubUserFields,
  configFn: getGitHubAuthConfig,
};
// @ts-expect-error Demo purposes
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const discordAuthMethod: NonNullable<AuthMethods["discord"]> = {
  userSignupFields: getDiscordUserFields,
  configFn: getDiscordAuthConfig,
};

// 🔐 Auth out of the box! https://wasp.sh/docs/auth/overview
export const authConfig: Auth = {
  userEntity: "User", // the Prisma model that holds users
  methods: {
    // NOTE: If you decide to not use email auth, make sure to also delete the related routes below.
    //       (RequestPasswordResetRoute, PasswordResetRoute, EmailVerificationRoute)
    email: emailAuthMethod, // ← the ONLY active method (append new ones here)
    // usernameAndPassword: usernameAndPasswordAuthMethod,
    // google: googleAuthMethod,
    // gitHub: gitGubAuthMethod,
    // discord: discordAuthMethod,
  },
  onAuthFailedRedirectTo: "/login", // failed login → login page
  onAuthSucceededRedirectTo: "/feed", // 🔥 login/signup success → change to "/feed" for Eco Pulse
};

// The auth pages' URL ↔ component mapping:
export const authSpec: Spec = [
  route("LoginRoute", "/login", page(LoginPage)),
  route("SignupRoute", "/signup", page(SignupPage)),
  route(
    "RequestPasswordResetRoute",
    "/request-password-reset",
    page(RequestPasswordResetPage),
  ),
  route("PasswordResetRoute", "/password-reset", page(PasswordResetPage)),
  route(
    "EmailVerificationRoute",
    "/email-verification",
    page(EmailVerificationPage),
  ),
];