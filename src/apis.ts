import type { MiddlewareConfigFn } from "wasp/server";
import type { UploadFile, ApproveSubmission } from "wasp/server/api";
import multer from "multer";
import crypto from "node:crypto";
import { emailSender } from "wasp/server/email";
import OneSignal from "react-onesignal";
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
  const dbUser = await context.entities.User.findUnique({
    where: { id: user.id },
  });
  if (!dbUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setUTCHours(0, 0, 0, 0);
  yesterday.setDate(yesterday.getUTCDate() - 1);
  const lastStreakDay = dbUser.lastStreakDate ? new Date(dbUser.lastStreakDate) : null;
  lastStreakDay?.setUTCHours(0, 0, 0, 0);
  let newStreak = 0;
  if (!dbUser.lastStreakDate) {
    newStreak = 1;
  } else {
    if (dbUser.lastStreakDate.getTime() !== today.getTime()) {
      newStreak = lastStreakDay?.getTime() === yesterday.getTime() ? dbUser.streak + 1 : 1;
    }
  }
  await context.entities.User.update({
      where: { id: dbUser.id },
      data: { lastStreakDate: today, 
      streak: newStreak === 0 ? dbUser.streak : newStreak
     }
  });
  await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Key ${process.env.ONESIGNAL_REST_API_KEY}`
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
    include_aliases: {
      external_id: [String(user.id)],
    },
      target_channel: "push",
      contents: { en: "Your submission has been received!" }
    })
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
    data: { points: { increment: 100 }, impactCo2: { increment: 5 } }, // Award 100 points and 5 kg CO2 for approved submission
  });
  await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Key ${process.env.ONESIGNAL_REST_API_KEY}`
    },
    body: JSON.stringify({
      app_id: process.env.ONESIGNAL_APP_ID,
    include_aliases: {
      external_id: [String(submission.userId)],
    },
      target_channel: "push",
      contents: { en: "Your submission has been approved!" }
    })
    })
  res.send("Submission approved and user points updated.");
}