import type { MiddlewareConfigFn } from "wasp/server";
import type { UploadFile, ApproveSubmission } from "wasp/server/api";
import multer from "multer";
import crypto from "node:crypto";
import { emailSender } from "wasp/server/email";
const upload = multer({ 
  storage: multer.memoryStorage()
 });

export const configureFileUploadMiddleware: MiddlewareConfigFn = (config) => {
  config.set("multer", upload.single("file"));
  return config;
};

export const uploadFile: UploadFile = async (req, res, context) => {
  console.log(req.body);
  console.log(req.file);
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  const file = req.file!;
  const user = context.user!;
  const imageDataUrl =
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const approvalUrl = `${process.env.WASP_SERVER_URL}/api/submissions/approve/?token=${rawToken}`;
  await context.entities.Submission.create({
    data: {
      userId: user.id,
      fileName: file.originalname,
      approvalTokenHash: tokenHash,
    }
  })
  await emailSender.send({
    to: process.env.ADMIN_EMAILS!,
    subject: "New Submission Awaiting Approval",
    text: `A new submission has been uploaded by ${user.email}.\nFile Name: ${file.originalname}\nTo approve this submission, click the link below:\n${approvalUrl}`,
    html: `
      <p>A new submission has been uploaded by ${user.email}.</p>
      <p>File Name: ${file.originalname}</p>
      <img
      src="${imageDataUrl}"
      alt="Eco action submission"
      style="max-width: 600px; height: auto;"
      />
      <p>To approve this submission, click the link below:</p>
      <a href="${approvalUrl}">Approve Submission</a>
    `,
  })
  return res.json({
    fileExists: !!file,
    tokenHash,
    imageDataUrl,
  });
};

export const approveSubmission: ApproveSubmission = async (req, res, context) => {
  const token = String(req.query.token!);
  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const submission = await context.entities.Submission.findFirst({
    where: { approvalTokenHash: tokenHash, status: "PENDING" },
  });
  if (!submission) {
    return res.status(404).json({ error: "Submission not found" });
  }
  await context.entities.Submission.update({
    where: { id: submission.id },
    data: { status: "APPROVED" },
  });
  await context.entities.User.update({
    where: { id: submission.userId },
    data: { points: { increment: 100 } }, // Award 100 points for approved submission
  });
  res.send("Submission approved and user points updated.");
}