// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/file-upload/validation.ts
// WHAT THIS IS: The single place that decides WHAT you're allowed to upload.
//    It's small on purpose — you change one line here and the whole module
//    (client + server) picks up the new rule.
//
// RELEVANT FOR ECO PULSE? Directly. This is your "photo proof" gatekeeper.
//    Challenge submissions will let a student attach a photo; these two
//    constants are exactly where you'd tune what counts as an acceptable
//    proof (size limit + file types).
//
// HOW TO USE:
//    - MAX_FILE_SIZE_BYTES: the biggest allowed file in bytes.
//      5 * 1024 * 1024 = 5 MB. Raise or lower by editing the math.
//    - ALLOWED_FILE_TYPES: an array of MIME types. `text/*` is a wildcard
//      covering any text MIME. `as const` makes the array read-only AND
//      lets TypeScript infer an exact list of allowed literal strings —
//      that literal list is reused all over the module (e.g. env.ts and
//      operations.ts use `z.enum(ALLOWED_FILE_TYPES)`).
//
// WHAT TO KEEP / DELETE: Absent, always keep. If you drop S3 uploads, delete
//    this file with the whole file-upload module.
// ═══════════════════════════════════════════════════════════════════════════
// Set this to the max file size you want to allow (currently 5MB).
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "text/*",
  "video/quicktime",
  "video/mp4",
] as const;
