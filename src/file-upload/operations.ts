// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/file-upload/operations.ts
// WHAT THIS IS: The SERVER-side actions for the file-upload module. This is
//    the single most important file to study in the whole template, because
//    it is THE full example of the Wasp "round-trip" pattern you'll reuse for
//    EVERY Eco Pulse action (submitAction, reviewSubmission, getChallenges...).
//
// THE WASP ROUND-TRIP (memorize this — it's the core skill):
//    1. PRISMA MODEL (schema.prisma) defines the data shape (here: File).
//    2. This file exports a plain async function per action. Each one takes
//       (rawArgs, context). context.user = who's calling (null if not logged
//       in); context.entities = your Prisma models, ready to query.
//    3. A matching declaration in .wasp.ts (here file-upload.wasp.ts) names
//       these functions as queries/actions and their input/output types.
//    4. Wasp auto-generates the HTTP API + typed client code.
//    5. The client calls them via useQuery/useAction imported from
//       "wasp/client/operations".
//
// NOTABLE PATTERNS TO COPY:
//    - Auth guard: `if (!context.user) throw new HttpError(401);` → reject
//      unauthenticated calls. Throw 401/403/404 with a message to signal
//      errors instead of returning weird data.
//    - zod validation: every action defines an input schema and passes
//      rawArgs through ensureArgsSchemaOrThrowHttpError(...). This guarantees
//      the inputs match the shape you expect BEFORE any real logic runs.
//    - Operation naming convention: `createFileUploadUrl`, `addFileToDb`,
//      `getAllFilesByUser`, `getDownloadFileSignedURL`, `deleteFile`. Verbs
//      first; the query/action type is imported from "wasp/server/operations".
//
// EACH ACTION:
//    - createFileUploadUrl: step 1 of upload. Returns the S3 permission slip.
//    - addFileToDb: step 3 of upload. After the browser uploaded to S3, this
//      records the File row (name, s3Key, type, owner) in the DB. It first
//      checks the file truly exists in S3 (404 if not).
//    - getAllFilesByUser: returns THIS user's files, newest first.
//    - getDownloadFileSignedURL: returns a signed URL to download one file.
//    - deleteFile: removes the DB row, then tries to delete from S3 too
//      (logs + moves on if S3 fails, so a partial failure doesn't crash).
//
// ⚠️ RELEVANT FOR ECO PULSE? Conceptually YES — copy this structure for every
//    Eco Pulse action (the auth guard + zod + context.entities pattern). The
//    S3 specifics here are only relevant if you do photo uploads; otherwise
//    replace these five with your challenge/submission/leaderboard actions
//    using the same skeleton.
// ═══════════════════════════════════════════════════════════════════════════
import { type File } from "wasp/entities";
import { HttpError } from "wasp/server";
import {
  type AddFileToDb,
  type CreateFileUploadUrl,
  type DeleteFile,
  type GetAllFilesByUser,
  type GetDownloadFileSignedURL,
} from "wasp/server/operations";

import * as z from "zod";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
import {
  checkFileExistsInS3,
  deleteFileFromS3,
  getDownloadFileSignedURLFromS3,
  getUploadFileSignedURLFromS3,
} from "./s3Utils";
import { ALLOWED_FILE_TYPES } from "./validation";

const createFileInputSchema = z.object({
  fileType: z.enum(ALLOWED_FILE_TYPES),
  fileName: z.string().nonempty(),
});

type CreateFileInput = z.infer<typeof createFileInputSchema>;

export const createFileUploadUrl: CreateFileUploadUrl<
  CreateFileInput,
  {
    s3UploadUrl: string;
    s3UploadFields: Record<string, string>;
    s3Key: string;
  }
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { fileType, fileName } = ensureArgsSchemaOrThrowHttpError(
    createFileInputSchema,
    rawArgs,
  );

  return await getUploadFileSignedURLFromS3({
    fileType,
    fileName,
    userId: context.user.id,
  });
};

const addFileToDbInputSchema = z.object({
  s3Key: z.string(),
  fileType: z.enum(ALLOWED_FILE_TYPES),
  fileName: z.string(),
});

type AddFileToDbInput = z.infer<typeof addFileToDbInputSchema>;

export const addFileToDb: AddFileToDb<AddFileToDbInput, File> = async (
  rawArgs,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const args = ensureArgsSchemaOrThrowHttpError(
    addFileToDbInputSchema,
    rawArgs,
  );

  const fileExists = await checkFileExistsInS3({ s3Key: args.s3Key });
  if (!fileExists) {
    throw new HttpError(404, "File not found in S3.");
  }

  return context.entities.File.create({
    data: {
      name: args.fileName,
      s3Key: args.s3Key,
      type: args.fileType,
      user: { connect: { id: context.user.id } },
    },
  });
};

export const getAllFilesByUser: GetAllFilesByUser<void, File[]> = async (
  _args,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.File.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getDownloadFileSignedURLInputSchema = z.object({
  s3Key: z.string().nonempty(),
});

type GetDownloadFileSignedURLInput = z.infer<
  typeof getDownloadFileSignedURLInputSchema
>;

export const getDownloadFileSignedURL: GetDownloadFileSignedURL<
  GetDownloadFileSignedURLInput,
  string
> = async (rawArgs) => {
  const { s3Key } = ensureArgsSchemaOrThrowHttpError(
    getDownloadFileSignedURLInputSchema,
    rawArgs,
  );
  return await getDownloadFileSignedURLFromS3({ s3Key });
};

const deleteFileInputSchema = z.object({
  id: z.string(),
});

type DeleteFileInput = z.infer<typeof deleteFileInputSchema>;

export const deleteFile: DeleteFile<DeleteFileInput, File> = async (
  rawArgs,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const args = ensureArgsSchemaOrThrowHttpError(deleteFileInputSchema, rawArgs);

  const deletedFile = await context.entities.File.delete({
    where: {
      id: args.id,
      user: {
        id: context.user.id,
      },
    },
  });

  try {
    await deleteFileFromS3({ s3Key: deletedFile.s3Key });
  } catch (error) {
    console.error(
      `S3 deletion failed. Orphaned file s3Key: ${deletedFile.s3Key}`,
      error,
    );
  }

  return deletedFile;
};
