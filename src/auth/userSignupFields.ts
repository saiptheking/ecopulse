// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/auth/userSignupFields.ts — "WHAT DO I SAVE WHEN SOMEONE SIGNS UP?"
// ═══════════════════════════════════════════════════════════════════════════
// When a new user submits the signup form, Wasp creates a User row. This file
// decides WHAT GOES INTO EACH FIELD of that new row. It's the bridge between
// the signup form and your Prisma User model.
//
// HOW IT WORKS (read getEmailUserFields — the one that's ACTIVE):
//   defineUserSignupFields({ fieldName: (data) => value })  — for each field
//   of the User model, a function that computes its value from the signup
//   data. Here:
//     email    → parsed from the form
//     username → same email (User.username column gets filled with the email)
//     isAdmin  → true only if the email is in the ADMIN_EMAILS env var
//
//   The `data` parameter is provider-specific: for email auth it's the form
//   payload ({email, password}); for google/github/discord it's the
//   provider's profile object (see the schemas below).
//
//   🛡️ WHAT IS ZOD? `z.object({...}).parse(data)` VALIDATES data at runtime.
//   If the shape is wrong, it throws instead of silently corrupting your DB.
//   Every provider defines a "data schema" with zod — a TypeScript type +
//   runtime check in one.
//
// 📌 ECO PULSE:
//   THIS is the file where you add `isOfficer` to the User model wiring:
//     isOfficer: (data) => isOfficerEmail(...) // or default false
//   Also: opensaas sets username = email; you could make username the
//   student's display name later (e.g. through a custom signup form field).
//
//   DELETE the google/github/discord functions + schemas + the
//   getXAuthConfig fns when you cut those methods from auth.wasp.ts.
// ═══════════════════════════════════════════════════════════════════════════
import { defineUserSignupFields } from "wasp/auth/providers/types";
import { env } from "wasp/server"; // server-side env vars (.env.server)
import { z } from "zod";

// ADMIN_EMAILS is a comma-separated list in .env.server
function isAdminEmail(email: string): boolean {
  return env.ADMIN_EMAILS.includes(email);
}

// For email auth, the "data" is simply { email: string } from the form:
const emailDataSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => /@k12\.ipsd\.org$/i.test(value),
      "Only K12 IPSD emails are allowed."
    ),
});
const nameDataSchema = z.object({
  name: z.string(),
});
const gradeDataSchema = z.object({
  grade: z.coerce.number().int().min(9).max(12),
});

// ★ THE ACTIVE ONE — how every normal signup fills the User row:
export const getEmailUserFields = defineUserSignupFields({
  name: (data) => {
    const nameData = nameDataSchema.parse(data);
    return nameData.name;
  },
  grade: (data) => {
    const gradeData = gradeDataSchema.parse(data);
    return gradeData.grade;
  },
  email: (data) => {
    const emailData = emailDataSchema.parse(data); // validate first!
    return emailData.email;
  },
  username: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.email; // username column = the email (simplest approach)
  },
  
  isAdmin: (data) => {
    const emailData = emailDataSchema.parse(data);
    return isAdminEmail(emailData.email); // power users by env var
  },
  // 🔥 ADD FOR ECO PULSE:
  // isOfficer: () => false, // set true manually in DB for your club officers
});

// ── Everything below is for the OPTIONAL social login methods ──────────
// The "data" for GitHub/Google/Discord is the provider's profile object.
// Each has a zod schema describing what we expect from that provider.

const githubDataSchema = z.object({
  profile: z.object({
    emails: z
      .array(
        z.object({
          email: z.string(),
          verified: z.boolean(),
        }),
      )
      .min(
        1,
        "You need to have an email address associated with your GitHub account to sign up.",
      ),
    login: z.string(),
  }),
});

export const getGitHubUserFields = defineUserSignupFields({
  email: (data) => {
    const githubData = githubDataSchema.parse(data);
    return getGithubEmailInfo(githubData).email;
  },
  username: (data) => {
    const githubData = githubDataSchema.parse(data);
    return githubData.profile.login;
  },
  isAdmin: (data) => {
    const githubData = githubDataSchema.parse(data);
    const emailInfo = getGithubEmailInfo(githubData);
    if (!emailInfo.verified) {
      return false; // only verified emails can be admin
    }
    return isAdminEmail(emailInfo.email);
  },
});

// We are using the first email from the list of emails returned by GitHub.
// If you want to use a different email, you can modify this function.
function getGithubEmailInfo(githubData: z.infer<typeof githubDataSchema>) {
  return githubData.profile.emails[0];
}

// NOTE: if we don't want to access users' emails, we can use scope ["user:read"]
// instead of ["user"] and access args.profile.username instead
export function getGitHubAuthConfig() {
  return {
    scopes: ["user:email"], // OAuth permission scopes — what GitHub may share
  };
}

const googleDataSchema = z.object({
  profile: z.object({
    email: z.string(),
    email_verified: z.boolean(),
  }),
});

export const getGoogleUserFields = defineUserSignupFields({
  email: (data) => {
    const googleData = googleDataSchema.parse(data);
    return googleData.profile.email;
  },
  username: (data) => {
    const googleData = googleDataSchema.parse(data);
    return googleData.profile.email;
  },
  isAdmin: (data) => {
    const googleData = googleDataSchema.parse(data);
    if (!googleData.profile.email_verified) {
      return false;
    }
    return isAdminEmail(googleData.profile.email);
  },
});

export function getGoogleAuthConfig() {
  return {
    scopes: ["profile", "email"], // must include at least 'profile' for Google
  };
}

const discordDataSchema = z.object({
  profile: z.object({
    username: z.string(),
    email: z.string().email().nullable(), // Discord emails can be null
    verified: z.boolean().nullable(),
  }),
});

export const getDiscordUserFields = defineUserSignupFields({
  email: (data) => {
    const discordData = discordDataSchema.parse(data);
    // Users need to have an email for payment processing.
    if (!discordData.profile.email) {
      throw new Error(
        "You need to have an email address associated with your Discord account to sign up.",
      );
    }
    return discordData.profile.email;
  },
  username: (data) => {
    const discordData = discordDataSchema.parse(data);
    return discordData.profile.username;
  },
  isAdmin: (data) => {
    const discordData = discordDataSchema.parse(data);
    if (!discordData.profile.email || !discordData.profile.verified) {
      return false;
    }
    return isAdminEmail(discordData.profile.email);
  },
});

export function getDiscordAuthConfig() {
  return {
    scopes: ["identify", "email"],
  };
}