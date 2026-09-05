// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/auth/env.ts — AUTH'S ENVIRONMENT-VARIABLE VALIDATION
// ═══════════════════════════════════════════════════════════════════════════
// Wasp's server boots with env validation: any *envSchema you export is
// checked against .env.server at startup (registered via main.wasp.ts →
// server.envValidationSchema). If a required var is missing, the app fails
// loudly instead of running broken.
//
// THIS FILE'S TRICK — the .transform():
//   .env.server has:   ADMIN_EMAILS=alice@x.com,bob@y.com   (plain string)
//   after parsing you get:  ["alice@x.com", "bob@y.com"]    (array!)
//   Zod validates → transforms → the code sees the CLEAN shape.
//
// HOW TO ADD YOUR OWN ENV VAR (e.g. OFFICER_EMAILS for Eco Pulse):
//   1. add it to this shape (or your own src/env.ts)
//   2. put the value in .env.server
//   3. read it anywhere server-side as env.OFFICER_EMAILS
// ═══════════════════════════════════════════════════════════════════════════
import * as z from "zod";

export const authEnvSchema = z.object({
  ADMIN_EMAILS: z
    .string()
    .default("") // empty string if not provided
    .transform((val) =>
      val
        .split(",") // "a,b" → ["a","b"]
        .map((email) => email.trim()) // remove spaces around emails
        .filter(Boolean), // drop empty entries
    ),
});