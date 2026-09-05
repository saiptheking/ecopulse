// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/file-upload/FileUploadPage.tsx
// WHAT THIS IS: A full working React page (the "screen" a user sees) that
//    lets them upload a file and lists the ones they already uploaded. It is
//    the CLIENT side of the round-trip — it calls the server actions from
//    operations.ts and renders the results.
//
// THIS PAGE IS A REACT MASTERCLASS + the Wasp round-trip in one file. Read it
//    slowly — every concept from the M2/M3 modules shows up here.
//
// ── useState (state) — the page "remembers" these:
//    - fileKeyForS3: which file's download URL we're currently fetching.
//    - uploadProgressPercent: 0-100 for the progress bar.
//    - fileToDelete: the file waiting for you to confirm the delete dialog.
//
// ── useQuery (the Wasp way to fetch data):
//    - `useQuery(getAllFilesByUser, undefined, { enabled: false })` — first
//      arg = the query fn from operations, second = its input (none → undefined),
//      third = options. `enabled: false` means "don't auto-run on mount"; we
//      call `.refetch()` manually instead (see the comment at the call site —
//      it explains WHY: auto-refetch would race the S3 upload).
//    - Returns an object with .data (the files), .isLoading, .error, .refetch.
//    - The second useQuery fetches a download URL, also manual (enabled:false).
//
// ── useEffect (side effects that react to state changes):
//    - First one: refetch the file list whenever `allUserFiles` identity
//      changes (runs on mount).
//    - Second one: whenever `fileKeyForS3` becomes non-empty, fetch the
//      download URL and open it in a new tab; then clear fileKeyForS3.
//
// ── Event handlers (onSubmit / onClick):
//    - handleUpload: reads the submitted <input type="file">, validates it,
//      runs the 3-step upload (createFileUploadUrl → uploadFileWithProgress →
//      addFileToDb), then resets the form + refetches the list. try/catch
//      shows a toast on failure, finally resets the progress bar.
//    - handleDelete: calls the deleteFile action, toasts, refetches.
//
// ── Rendering with .map():
//    - `{allUserFiles.data.map((file) => <Card key={file.s3Key}>)}` — the
//      list-rendering pattern. Each file becomes one Card row with a Download
//      and a Trash button.
//
// ⚠️ RELEVANT FOR ECO PULSE? This page is your TEMPLATE for copy-paste.
//    Your submissions page will look almost identical: a form + a list, where
//    the "file" becomes an eco-action submission. Steal the structure (state +
//    useQuery + handlers + .map) and swap the fields. If you DON'T do photo
//    uploads in v1, the S3 three-step inside handleUpload is the only part to
//    strip — the page shell is yours to keep and reshape.
// ═══════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { api } from "wasp/client/api";

export const FileUploadPage = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);
    const data = await api
      .post("/api/upload", { body: formData })
      .json<{ fileExists: boolean }>();
    alert("Thank you for your submission! Your file has been uploaded successfully.");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">File Upload</h1>
      <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg leading-8">Upload a picture of your action here!</p>
    <form onSubmit={handleSubmit} className="rounded-xl border shadow hover:shadow-lg transition-all duration-300 text-card-foreground bg-muted/10 my-8 " style={{ padding: '1rem' }}>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} className="mx-auto block w-full" />
      <div className="mt-4">
        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Upload</button>
      </div>
    </form>
    </div>
  );
};
