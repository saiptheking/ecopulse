import type { MiddlewareConfigFn } from "wasp/server";
import type { UploadFile } from "wasp/server/api";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

export const configureFileUploadMiddleware: MiddlewareConfigFn = (config) => {
  config.set("multer", upload.single("file"));
  return config;
};

export const uploadFile: UploadFile = (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const file = req.file!;
  return res.json({
    fileExists: !!file,
  });
};