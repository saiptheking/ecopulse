import cors from "cors";
import { config, type MiddlewareConfigFn } from "wasp/server";

export const getGlobalMiddleware: MiddlewareConfigFn = (middlewareConfig) => {
  const allowedOrigins = [
    ...config.allowedCORSOrigins,
    "https://ecopulse-dev.vercel.app",
    "https://ecopulse.dev",
  ];

  middlewareConfig.set(
    "cors",
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  return middlewareConfig;
};