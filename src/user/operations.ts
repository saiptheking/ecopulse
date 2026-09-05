// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/user/operations.ts — THE "OPERATIONS" PATTERN (READ THIS FILE)
// ═══════════════════════════════════════════════════════════════════════════
// This is THE canonical example of a Wasp query/action implementation.
// Every backend operation in this template follows the exact same shape —
// and YOUR Eco Pulse operations will too. The recipe:
//
//   1. INPUT SCHEMA — a zod object describing the args the client sends:
//        z.object({ id: z.string().nonempty(), isAdmin: z.boolean() })
//      Then `ensureArgsSchemaOrThrowHttpError(schema, args)` validates and
//      throws HTTP 400 with a clean message if the shape is wrong.
//
//   2. AUTH CHECK — who is allowed to call this?
//        if (!context.user)            → throw new HttpError(401, ...)  // not logged in
//        if (!context.user.isAdmin)    → throw new HttpError(403, ...)  // logged in, no permission
//      (401 = unauthenticated, 403 = unauthorized. Different things!)
//
//   3. DO THE THING — use context.entities.<Entity>.findMany/update/...  —
//      Prisma with type-safety + auto-invalidation tied to the entity list
//      you declared in the .wasp.ts spec.
//
// TYPE NOTES:
//   UpdateIsUserAdminById<Input, Output> — the generated operation type:
//   first param the input type, second the return type. Wasp enforces both.
//   `Pick<User, ...>` — pick a few fields from the User model for the return.
//
// DEPENDENCY ALERT: this file imports SubscriptionStatus from
// ../payment/plans (line 9). When you delete the payment module, you must
// also strip these fields from the queries/outputs, or this file breaks.
//
// 📌 ECO PULSE: model your reviewSubmission on updateIsUserAdminById
//   EXACTLY: zod input → 401 if !user → 403 if !user.isOfficer →
//   context.entities.Submission.update({ ... }). That's the whole trick.
// ═══════════════════════════════════════════════════════════════════════════
import { type Prisma } from "@prisma/client";
import { type User } from "wasp/entities";
import { HttpError, prisma } from "wasp/server";
import {
  type GetPaginatedUsers,
  type UpdateIsUserAdminById,
} from "wasp/server/operations";
import * as z from "zod";
import { SubscriptionStatus } from "../payment/plans"; // 🔥 remove when payment is deleted
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";

// ── STEP 1: input validation schema (step 1 of the recipe) ────────────────
const updateUserAdminByIdInputSchema = z.object({
  id: z.string().nonempty(),
  isAdmin: z.boolean(),
});

// Derive the TypeScript type from the schema — one source of truth:
type UpdateUserAdminByIdInput = z.infer<typeof updateUserAdminByIdInputSchema>;

// ── STEP 2+3: auth check, then write ───────────────────────────────────────
export const updateIsUserAdminById: UpdateIsUserAdminById<
  UpdateUserAdminByIdInput,
  User
> = async (rawArgs, context) => {
  const { id, isAdmin } = ensureArgsSchemaOrThrowHttpError( // ← input gate
    updateUserAdminByIdInputSchema,
    rawArgs,
  );

  if (!context.user) {
    // ← not logged in at all
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    // ← logged in but not an admin
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  return context.entities.User.update({
    where: { id },
    data: { isAdmin },
  });
};

// ── A READ-ONLY query with PAGINATION (admin dashboard's user table) ───────
type GetPaginatedUsersOutput = {
  users: Pick<
    User,
    | "id"
    | "email"
    | "username"
    | "subscriptionStatus" // 🔥 payment fields — strip when payment is deleted
    | "paymentProcessorUserId" // 🔥 same
    | "isAdmin"
  >[];
  totalPages: number;
};

const getPaginatorArgsSchema = z.object({
  skipPages: z.number(),
  filter: z.object({
    emailContains: z.string().nonempty().optional(),
    isAdmin: z.boolean().optional(),
    subscriptionStatusIn: z
      .array(z.nativeEnum(SubscriptionStatus).nullable())
      .optional(),
  }),
});

type GetPaginatedUsersInput = z.infer<typeof getPaginatorArgsSchema>;

export const getPaginatedUsers: GetPaginatedUsers<
  GetPaginatedUsersInput,
  GetPaginatedUsersOutput
> = async (rawArgs, context) => {
  // Same two gates as above (query is admin-only):
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  const {
    skipPages,
    filter: {
      subscriptionStatusIn: subscriptionStatus, // rename: fits the query shape
      emailContains,
      isAdmin,
    },
  } = ensureArgsSchemaOrThrowHttpError(getPaginatorArgsSchema, rawArgs);

  // Payment nuance: a "null" subscriptionStatus (never subscribed) is a
  // legitimate filter value, so handle it separately from real statuses:
  const includeUnsubscribedUsers = !!subscriptionStatus?.some(
    (status) => status === null,
  );
  const desiredSubscriptionStatuses = subscriptionStatus?.filter(
    (status) => status !== null,
  );

  const pageSize = 10; // 10 users per page

  // Build the FULL Prisma query as an object first (gives you type-checking
  // on the whole `where` before it hits the DB):
  const userPageQuery: Prisma.UserFindManyArgs = {
    skip: skipPages * pageSize,
    take: pageSize,
    where: {
      AND: [
        {
          email: {
            contains: emailContains, // partial match
            mode: "insensitive", // case-insensitive (SQL ILIKE)
          },
          isAdmin,
        },
        {
          OR: [
            {
              subscriptionStatus: {
                in: desiredSubscriptionStatuses,
              },
            },
            {
              subscriptionStatus: includeUnsubscribedUsers ? null : undefined,
            },
          ],
        },
      ],
    },
    select: {
      // ONLY these columns return (never send more than needed):
      id: true,
      email: true,
      username: true,
      isAdmin: true,
      subscriptionStatus: true, // 🔥 payment
      paymentProcessorUserId: true, // 🔥 payment
    },
    orderBy: {
      username: "asc", // alphabetical
    },
  };

  // A DB TRANSACTION: run both queries atomically. If either fails, both roll
  // back. Count + page in one round-trip = consistent numbers under writes.
  const [pageOfUsers, totalUsers] = await prisma.$transaction([
    context.entities.User.findMany(userPageQuery),
    context.entities.User.count({ where: userPageQuery.where }),
  ]);
  const totalPages = Math.ceil(totalUsers / pageSize); // how many page buttons

  return {
    users: pageOfUsers,
    totalPages,
  };
};