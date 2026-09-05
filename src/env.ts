// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/env.ts — VALIDATES YOUR SECRET ENV VARS AT SERVER BOOT
// ═══════════════════════════════════════════════════════════════════════════
// Every app has secrets: database URLs, API keys... Wasp keeps them in
// `.env.server` (never committed to git!). This file says WHICH env vars must
// exist and WHAT FORMAT they must be, using zod (a validation library).
//
// At boot, Wasp runs this schema against your .env.server. Missing/wrong
// vars = clear error instead of a mystery crash later.
//
// HOW TO READ THE CODE:
//   import { defineEnvValidationSchema } from "wasp/env";  → Wasp's helper
//   z.object({ ... })                                      → "an object with these keys"
//   ...stripeEnvSchema.shape                               → merge another schema's
//                                                            fields in ("shape" =
//                                                            the object's field defs)
//
// HOW TO USE IT:
//   You never call this directly. Wasp does (see main.wasp.ts →
//   server.envValidationSchema). To READ a validated var in server code:
//       import { env } from "wasp/server";
//       env.ADMIN_EMAILS   // typed, validated — safer than process.env
//
// ┌─ ECO PULSE ROADMAP ─────────────────────────────────────────────────────┐
// │ When you DELETE a feature folder (payment, analytics, feed),     │
// │ you MUST also delete its import here + its `...shape` spread below,     │
// │ or Wasp will demand env vars that no longer matter. Keep only:          │
// │   authEnvSchema + fileUploadEnvSchema (+ your own, e.g. nothing yet).   │
// └──────────────────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════════════
import { defineEnvValidationSchema } from "wasp/env";

import * as z from "zod";
// ── feature env schemas (each feature folder declares its own required vars) ──
import { googleAnalyticsEnvSchema, plausibleEnvSchema } from "./analytics/env"; // 🔥 DELETE
import { authEnvSchema } from "./auth/env"; // KEEP — ADMIN_EMAILS
import { demoAiAppEnvSchema } from "./feed/env"; // 🔥 DELETE
import { fileUploadEnvSchema } from "./file-upload/env"; // KEEP — S3 vars (photo proof)
import { lemonSqueezyEnvSchema } from "./payment/lemonSqueezy/env"; // 🔥 DELETE
import { polarEnvSchema } from "./payment/polar/env"; // 🔥 DELETE
import { stripeEnvSchema } from "./payment/stripe/env"; // 🔥 DELETE

// Wasp merges this schema with its built-in env var validations and uses it
// to validate `process.env` at server startup. Access the validated env vars
// with `import { env } from 'wasp/server'` instead of using `process.env` directly.
// https://wasp.sh/docs/project/env-vars#custom-env-var-validations
//
// If you remove a feature (e.g. an analytics or payment provider), make sure
// to also remove its env schema import and `...schema.shape` below.
export const serverEnvValidationSchema = defineEnvValidationSchema(
  z.object({
    ...authEnvSchema.shape, // KEEP
    ...stripeEnvSchema.shape, // 🔥 DELETE
    ...lemonSqueezyEnvSchema.shape, // 🔥 DELETE
    ...polarEnvSchema.shape, // 🔥 DELETE
    ...demoAiAppEnvSchema.shape, // 🔥 DELETE
    ...fileUploadEnvSchema.shape, // KEEP
    ...plausibleEnvSchema.shape, // 🔥 DELETE
    ...googleAnalyticsEnvSchema.shape, // 🔥 DELETE
  }),
);