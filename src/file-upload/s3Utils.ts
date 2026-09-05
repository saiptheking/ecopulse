// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/file-upload/s3Utils.ts
// WHAT THIS IS: All the direct AWS S3 talk lives in this one file. The page
//    (FileUploadPage.tsx) and the server actions (operations.ts) do NOT talk
//    to S3 themselves — they call these helper functions.
//
// BIG PICTURE OF S3 UPLOADS (read this — it's the "why"):
//    Your server never receives the actual file. Instead:
//      1. Server asks S3 for a "presigned POST" — basically a permission slip
//         the browser can use to upload directly to S3 for 1 hour.
//      2. Browser POSTs the file straight to S3 using that slip (no server
//         bandwidth used!). 
//      3. Server records just the file's S3 key in the database.
//    This is why the upload flow has three steps you saw in operations.ts.
//
// KEY CONCEPTS:
//    - s3Client: one shared S3 connection, built once with your credentials.
//    - "presigned" URL = a URL that includes a time-limited signature so the
//      client can act on S3 without your secret keys. The browser gets this,
//      NOT your credentials.
//    - getS3Key: builds a unique path for each file: `{userId}/{randomID}.ext`
//      — the userId folder keeps every user's files separated, and the random
//      UUID prevents two files from ever colliding.
//
// EACH FUNCTION:
//    - getUploadFileSignedURLFromS3 → returns the permission slip (url +
//      hidden fields + the key) for creating a new upload.
//    - getDownloadFileSignedURLFromS3 → returns a signed URL to fetch a file.
//    - deleteFileFromS3 → permanently removes an object from the bucket.
//    - checkFileExistsInS3 → returns true if the object exists (used to make
//      sure the user actually uploaded before we record it in the DB).
//
// ⚠️ RELEVANT FOR ECO PULSE? Only if you do photo-proof uploads. For the v1
//    demo loop you can ship text-only submissions and SKIP all of this.
//    If you keep it, you'll reuse checkFileExistsInS3 / upload helpers as-is;
//    you won't need to understand every @aws-sdk detail — just what each
//    exported function does.
// ═══════════════════════════════════════════════════════════════════════════
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
  S3ServiceException,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import * as path from "path";
import { env } from "wasp/server";
import { MAX_FILE_SIZE_BYTES } from "./validation";

export const s3Client = new S3Client({
  region: env.AWS_S3_REGION,
  credentials: {
    accessKeyId: env.AWS_S3_IAM_ACCESS_KEY,
    secretAccessKey: env.AWS_S3_IAM_SECRET_KEY,
  },
});

type S3Upload = {
  fileType: string;
  fileName: string;
  userId: string;
};

export const getUploadFileSignedURLFromS3 = async ({
  fileName,
  fileType,
  userId,
}: S3Upload) => {
  const s3Key = getS3Key(fileName, userId);

  const { url: s3UploadUrl, fields: s3UploadFields } =
    await createPresignedPost(s3Client, {
      Bucket: env.AWS_S3_FILES_BUCKET!,
      Key: s3Key,
      Conditions: [["content-length-range", 0, MAX_FILE_SIZE_BYTES]],
      Fields: {
        "Content-Type": fileType,
      },
      Expires: 3600,
    });

  return { s3UploadUrl, s3Key, s3UploadFields };
};

export const getDownloadFileSignedURLFromS3 = async ({
  s3Key,
}: {
  s3Key: string;
}) => {
  const command = new GetObjectCommand({
    Bucket: env.AWS_S3_FILES_BUCKET,
    Key: s3Key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const deleteFileFromS3 = async ({ s3Key }: { s3Key: string }) => {
  const command = new DeleteObjectCommand({
    Bucket: env.AWS_S3_FILES_BUCKET,
    Key: s3Key,
  });
  await s3Client.send(command);
};

export const checkFileExistsInS3 = async ({ s3Key }: { s3Key: string }) => {
  const command = new HeadObjectCommand({
    Bucket: env.AWS_S3_FILES_BUCKET,
    Key: s3Key,
  });
  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error instanceof S3ServiceException && error.name === "NotFound") {
      return false;
    }
    throw error;
  }
};

function getS3Key(fileName: string, userId: string) {
  const ext = path.extname(fileName).slice(1);
  return `${userId}/${randomUUID()}.${ext}`;
}
