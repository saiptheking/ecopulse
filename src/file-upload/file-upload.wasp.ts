// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: file-upload/file-upload.wasp.ts — REGISTERING A FEATURE MODULE
// ═══════════════════════════════════════════════════════════════════════════
// This file "publishes" the file-upload feature to the rest of the app.
// The `fileUploadSpec` array is what main.wasp.ts imports into its `spec`.
// Anything you want Eco Pulse to use must be registered here (or in the
// feature's own spec file):
//
//   route("Name", "/url", page(Component, { authRequired: true }))
//       → a URL path that shows a React page. authRequired: true means
//         Wasp PROTECTS it — unlogged visitors get sent to /login, and
//         the page receives `{ user }` as a prop.
//   query(fn, { entities: ["User", "File"] })
//       → a database read (GET). `fn` lives in ./operations.
//   action(fn, { entities: ["User", "File"] })
//       → a database write (POST/PUT/DELETE).
//
//   entities: [...]  → which Prisma models the operation touches. Wasp uses
//       this to (1) generate type-safe ctx.entities access, and (2)
//       AUTO-REFRESH any page querying those entities after the op runs.
//
// 📌 ECO PULSE: clone this file as `challenge.wasp.ts` with:
//   route   → "/feed"  (main feed), "/submit" (submit an action)
//   query   → getAllChallenges, getLeaderboard
//   action  → createSubmission, updateSubmissionStatus (officer approval!)
// This is the exact template for your whole data layer.
// ═══════════════════════════════════════════════════════════════════════════
import { action, page, query, route, type Spec } from "@wasp.sh/spec";

import { FileUploadPage } from "./FileUploadPage" with { type: "ref" };
import {
  addFileToDb,
  createFileUploadUrl,
  deleteFile,
  getAllFilesByUser,
  getDownloadFileSignedURL,
} from "./operations" with { type: "ref" };

export const fileUploadSpec: Spec = [
  route(
    "FileUploadRoute",
    "/file-upload",
    page(FileUploadPage, { authRequired: true }), // ← login needed to use
  ),
  query(getAllFilesByUser, { entities: ["User", "File"] }),
  query(getDownloadFileSignedURL, { entities: ["User", "File"] }),
  action(addFileToDb, { entities: ["User", "File"] }),
  action(createFileUploadUrl, { entities: ["User", "File"] }),
  action(deleteFile, { entities: ["User", "File"] }),
];