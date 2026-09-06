// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: main.wasp.ts — THE CONFIG FILE OF YOUR ENTIRE APP
// ═══════════════════════════════════════════════════════════════════════════
// Wasp is a "full-stack framework with a compiler." THIS file is the heart:
// you declare what your app IS here, and Wasp GENERATES all the boring glue
// code for you (Express server, React router, Prisma client, auth endpoints,
// TypeScript types). You never hand-write that glue — you only write:
//   1. this config file            (you are reading it now)
//   2. React components (pages)    (src/.../*Page.tsx)
//   3. server logic ("operations") (src/.../operations.ts) + .wasp.ts specs
//   4. the database schema         (schema.prisma)
//
// WHAT `app({...})` DOES — field by field:
//   name                       → project name (change to "EcoPulse"!)
//   wasp.version               → which Wasp CLI version this targets
//   title                      → the text shown in your browser tab
//   head                       → extra <head> HTML (SEO tags) — see src/client/head.wasp.ts
//   auth                       → login/signup configuration — see src/auth/auth.wasp.ts
//   db.seeds                   → functions that fill the DB with demo data (`wasp db seed`)
//   client.rootComponent       → a React component that wraps EVERY page —
//                                src/client/App.tsx holds global state (auth, theme)
//   server.envValidationSchema → zod schema validating .env.server at boot — see src/env.ts
//   emailSender                → which email provider sends verification/reset emails
//   spec: [...]                → THE FEATURE LIST: every route/query/action the app registers.
//                                Each `xxxSpec` is just a list of routes/queries/actions
//                                imported from one feature folder (e.g. src/auth/auth.wasp.ts).
//
// HOW THE IMPORTS WORK: `with { type: "ref" }` tells Wasp "this React component /
// function lives in THIS file — generate the plumbing that connects it."
//
// ┌─ WHAT'S RELEVANT FOR ECO PULSE ─────────────────────────────────────────┐
// │ KEEP:   authConfig, authSpec, userSpec, fileUploadSpec (photo proof!),  │
// │         adminSpec (your officer dashboard), LandingPageRoute (restyle), │
// │         emailSender, db.seeds (rewrite with Eco Pulse demo data)        │
// │ CHANGE: name → "EcoPulse", title → "Eco Pulse", and change              │
// │         onAuthSucceededRedirectTo (in auth.wasp.ts) → "/feed"           │
// │ DELETE: demoAiAppSpec, paymentSpec, analyticsSpec + their imports       │
// │         (lines 10, 13, 15 + spec entries) — monetization/demo features  │
// └─────────────────────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════════════════
import { app, page, route } from "@wasp.sh/spec";

// ── (ref) imports: Wasp reads these files, type-checks them, and wires them ──
import { App } from "./src/client/App" with { type: "ref" }; // wraps every page (auth state, theme)
import { NotFoundPage } from "./src/client/components/NotFoundPage" with { type: "ref" }; // 404 page
import { serverEnvValidationSchema } from "./src/env" with { type: "ref" }; // validates .env.server
import { LandingPage } from "./src/landing-page/LandingPage" with { type: "ref" }; // homepage
import { seedMockUsers } from "./src/server/scripts/dbSeeds" with { type: "ref" }; // demo-data seeder

// ── feature specs: pre-built bundles of routes/queries/actions ──
import { adminSpec } from "./src/admin/admin.wasp"; // admin dashboard (KEEP — officer view)
import { analyticsSpec } from "./src/analytics/analytics.wasp"; // 🔥 DELETE for Eco Pulse
import { authConfig, authSpec } from "./src/auth/auth.wasp"; // login/signup (KEEP)
import { head } from "./src/client/head.wasp"; // <head> HTML tags (SEO)
import { demoAiAppSpec } from "./src/feed/feed.wasp"; // 🔥 DELETE (demo AI chat)
import { leaderboardSpec } from "./src/leaderboard/leaderboard.wasp"; // leaderboard feature
import { fileUploadSpec } from "./src/file-upload/file-upload.wasp"; // KEEP (photo uploads!)
import { paymentSpec } from "./src/payment/payment.wasp"; // 🔥 DELETE (Stripe/Lemon Squeezy/Polar)
import { emailSender } from "./src/server/emailSender.wasp"; // email provider (dev: Dummy)
import { userSpec } from "./src/user/user.wasp"; // account page + admin-fields ops (KEEP)
import { api, apiNamespace} from "@wasp.sh/spec"
import { configureFileUploadMiddleware, uploadFile, approveSubmission } from "./src/apis" with { type: "ref" }

export default app({
  name: "EcoPulse", // → change to "EcoPulse"
  wasp: { version: "^0.25.0" },
  title: "EcoPulse", // → change to "Eco Pulse"
  head,
  auth: authConfig,
  db: {
    // Run `wasp db seed` to seed the database with the seed functions below:
    seeds: [
      // Populates the database with a bunch of fake users to work with during development.
      seedMockUsers, // → replace with your own seed (officer + students + challenges)
    ],
  },
  client: {
    // The React component that wraps every page (holds the auth state + theme).
    rootComponent: App,
  },
  server: {
    // Boot-time validation of your secret env vars (see src/env.ts).
    envValidationSchema: serverEnvValidationSchema,
  },
  emailSender,
  spec: [
    // Prerendering routes with static content creates HTML files at build time that are served immediately,
    // improving SEO, search engine/AI crawling, and performance: https://wasp.sh/docs/advanced/prerendering
    route("LandingPageRoute", "/", page(LandingPage), { prerender: true }), // homepage at /
    apiNamespace("/api/upload", { middlewareConfigFn: configureFileUploadMiddleware }),
    api("POST", "/api/upload", uploadFile, {
      entities: ["User", "Submission"],
    }),
    api(
      "GET",
      "/api/submissions/approve",
      approveSubmission,
      { entities: ["Submission", "User"] },
    ),
    route("NotFoundRoute", "*", page(NotFoundPage)), // catch-all 404
    authSpec,
    userSpec,
    // 🔥 These 3 lines are what you DELETE during surgery (they register
    // the demo-AI, payment, and analytics features). Keep them ACTIVE for
    // now so the template stays fully working while you learn it.
    demoAiAppSpec,
    leaderboardSpec,
    paymentSpec,
    fileUploadSpec,
    analyticsSpec,
    adminSpec,
    // ← ADD YOUR OWN SPECS HERE, e.g.: ecoSpec (challenges, submissions, leaderboard)
  ],
});
