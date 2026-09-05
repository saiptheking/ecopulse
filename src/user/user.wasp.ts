// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/user/user.wasp.ts — THE SMALLEST, MOST POWERFUL FILE
// ═══════════════════════════════════════════════════════════════════════════
// Three declarations that teach you ALL of Wasp's backend vocabulary:
//
//   1. route("AccountRoute", "/account", page(AccountPage, { authRequired: true }))
//      → URL /account shows AccountPage, AND Wasp auto-protects it:
//        { authRequired: true } means "404 unless logged in". Wasp ALSO
//        passes the logged-in user as a prop to the page (see AccountPage's
//        `{ user }: { user: User }` — it just appears!).
//
//   2. query(getPaginatedUsers, { entities: ["User"] })
//      → exposes the function getPaginatedUsers (operations.ts) as a GET-able
//        API endpoint. `entities: ["User"]` tells Wasp: this query reads the
//        User entity — so when any User changes, Wasp auto-refetches queries
//        and invalidates caches. (Declared in main.wasp.ts's userSpec.)
//
//   3. action(updateIsUserAdminById, { entities: ["User"] })
//      → the same, but for WRITES (POST). Actions are for mutations; queries
//        are for reads. Both get context + auto-invalidation.
//
// 📌 ECO PULSE MIRROR — your first Eco Pulse spec file will look like:
//   query(getChallenges,    { entities: ["Challenge"] })
//   query(getSubmissions,   { entities: ["Submission"] })
//   query(getLeaderboard,   { entities: ["Submission", "User"] })
//   action(submitAction,    { entities: ["Challenge", "Submission"] })
//   action(reviewSubmission,{ entities: ["Submission"] })
// ═══════════════════════════════════════════════════════════════════════════
import { action, page, query, route, type Spec } from "@wasp.sh/spec";

import { AccountPage } from "./AccountPage" with { type: "ref" };
import {
  getPaginatedUsers, // admin-only user list (admin dashboard)
  updateIsUserAdminById, // admin-only: flip someone's isAdmin flag
} from "./operations" with { type: "ref" };

export const userSpec: Spec = [
  route("AccountRoute", "/account", page(AccountPage, { authRequired: true })),
  query(getPaginatedUsers, { entities: ["User"] }),
  action(updateIsUserAdminById, { entities: ["User"] }),
];