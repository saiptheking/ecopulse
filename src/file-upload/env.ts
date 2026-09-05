// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/file-upload/env.ts
// WHAT THIS IS: The list of environment variables this module needs to exist.
//
// Wasp's OpenSaaS template validates env vars in small per-module "schema"
// files like this one, then combines them all in src/env.ts (which you
// already read in M1). If one of these is missing, Wasp refuses to start —
// that's WHY a module you're not even using yet can block the whole app.
//
// HOW IT WORKS: This uses `zod` (a validation library). `z.object({...})`
// says "the environment must provide an object with at least these keys".
// Each `z.string({ error: "..." })` means "this must be a string, and if it's
// missing, show this error message."
//
// ⚠️ RELEVANT FOR ECO PULSE? Only if you use S3 photo uploads.
//    All four keys are AWS S3 credentials — they power the file-upload module.
//    For the v1 demo loop you can SKIP S3 entirely (text-only submissions),
//    which means you can DELETE this whole file-upload module later (see
//    FileUploadPage.tsx) to remove these four required keys.
//
// HOW TO USE: If you keep S3, put real values in .env.server. If you drop
//    S3, remove this file AND its registration in src/env.ts so Wasp stops
//    demanding the keys.
// ═══════════════════════════════════════════════════════════════════════════
import * as z from "zod";

export const fileUploadEnvSchema = z.object({
  AWS_S3_REGION: z.string({
    error: "AWS_S3_REGION is required for file uploads",
  }),
  AWS_S3_IAM_ACCESS_KEY: z.string({
    error: "AWS_S3_IAM_ACCESS_KEY is required for file uploads",
  }),
  AWS_S3_IAM_SECRET_KEY: z.string({
    error: "AWS_S3_IAM_SECRET_KEY is required for file uploads",
  }),
  AWS_S3_FILES_BUCKET: z.string({
    error: "AWS_S3_FILES_BUCKET is required for file uploads",
  }),
});
