import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const authRuntime = globalThis as typeof globalThis & {
  icanDevelopmentAuthSecret?: string;
};

function getSigningSecret() {
  const configuredSecret = process.env.AUTH_SESSION_SECRET;
  if (configuredSecret) return configuredSecret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET must be configured in production.");
  }

  authRuntime.icanDevelopmentAuthSecret ??= randomBytes(32).toString("base64url");
  return authRuntime.icanDevelopmentAuthSecret;
}

function sign(value: string) {
  return createHmac("sha256", getSigningSecret()).update(value).digest("base64url");
}

export function sealPayload<T>(payload: T) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

export function unsealPayload<T>(token: string): T | null {
  const [body, signature, ...rest] = token.split(".");
  if (!body || !signature || rest.length) return null;

  const expectedSignature = sign(body);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}
