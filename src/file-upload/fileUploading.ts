// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/file-upload/fileUploading.ts
// WHAT THIS IS: The CLIENT-side file upload mechanics — the code that runs in
//    the browser and actually POSTs the chosen file up to S3 with a progress
//    bar. (Compare with s3Utils.ts / operations.ts which run on the server.)
//
// KEY POINT — the split:
//    - Server (operations.ts + s3Utils.ts): decides the rules, mints the
//      permission slip, records the result in the DB.
//    - Client (this file): the "hands" that physically move the bytes.
//
// EACH FUNCTION:
//    - validateFile(file): checks the chosen file BEFORE uploading — size
//      under the limit AND type in the allowed list. Throws a plain Error
//      with a human message if not; the page catches it and shows a toast.
//      Returns the file "narrowed" to a type that TypeScript can prove is
//      valid (FileWithValidType).
//    - isFileWithAllowedFileType(file): the actual type check. The
//      `file is FileWithValidType` return declaration is a TS "type guard" —
//      after this returns true, TS treats the file as the narrower type.
//    - uploadFileWithProgress({...}): does the upload. Builds a FormData of
//      the hidden S3 fields + the file, then POSTs it with `ky` (a fetch
//      wrapper). `onUploadProgress` receives progress events and updates the
//      percent via the callback the page passed in — that's what fills the
//      progress bar.
//    - getFileUploadFormData(...): private helper that assembles the FormData
//      (the S3 permission-slip fields first, then the file itself as "file").
//
// ⚠️ RELEVANT FOR ECO PULSE? Only for photo-proof uploads. For v1 (text-only
//    submissions) you can delete this whole module. If you keep photos, this
//    file is the part you'd point at a submission photo instead of a generic
//    file — the shape (validate → get slip → upload with progress) carries
//    over almost exactly.
// ═══════════════════════════════════════════════════════════════════════════
import ky from "ky";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "./validation";

type AllowedFileTypes = (typeof ALLOWED_FILE_TYPES)[number];
export type FileWithValidType = File & { type: AllowedFileTypes };

export async function uploadFileWithProgress({
  file,
  s3UploadUrl,
  s3UploadFields,
  setUploadProgressPercent,
}: {
  file: FileWithValidType;
  s3UploadUrl: string;
  s3UploadFields: Record<string, string>;
  setUploadProgressPercent: (percentage: number) => void;
}) {
  const formData = getFileUploadFormData(file, s3UploadFields);

  return ky.post(s3UploadUrl, {
    body: formData,
    onUploadProgress: (progress) => {
      const percentage = Math.round(progress.percent * 100);
      setUploadProgressPercent(percentage);
    },
  });
}

function getFileUploadFormData(
  file: File,
  s3UploadFields: Record<string, string>,
) {
  const formData = new FormData();
  Object.entries(s3UploadFields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);
  return formData;
}

export function validateFile(file: File): FileWithValidType {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size exceeds ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB limit.`,
    );
  }

  if (!isFileWithAllowedFileType(file)) {
    throw new Error(`File type '${file.type}' is not supported.`);
  }

  return file;
}

function isFileWithAllowedFileType(file: File): file is FileWithValidType {
  return ALLOWED_FILE_TYPES.includes(file.type as AllowedFileTypes);
}
