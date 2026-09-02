import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AUTH_CHALLENGE_COOKIE,
  AUTH_CHALLENGE_TTL_SECONDS,
  AUTH_SESSION_COOKIE,
  AUTH_SESSION_TTL_SECONDS,
} from "@/lib/auth/constants";
import type { AuthPrincipal, AuthSession, OtpChallenge } from "@/lib/auth/types";
import { sealPayload, unsealPayload } from "@/server/auth/seal";

type SessionToken = AuthSession & Readonly<{ kind: "session" }>;
type ChallengeToken = OtpChallenge & Readonly<{ kind: "otp-challenge" }>;

const sharedCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  priority: "high" as const,
};

function isSessionToken(value: SessionToken | null): value is SessionToken {
  return Boolean(
    value &&
      value.kind === "session" &&
      typeof value.officeId === "string" &&
      typeof value.officeName === "string" &&
      typeof value.contactId === "string" &&
      typeof value.contactName === "string" &&
      typeof value.issuedAt === "number" &&
      typeof value.expiresAt === "number" &&
      value.expiresAt > Date.now(),
  );
}

function isChallengeToken(value: ChallengeToken | null): value is ChallengeToken {
  return Boolean(
    value &&
      value.kind === "otp-challenge" &&
      typeof value.officeId === "string" &&
      typeof value.contactId === "string" &&
      typeof value.mobile === "string" &&
      typeof value.issuedAt === "number" &&
      typeof value.expiresAt === "number",
  );
}

export async function createOtpChallenge(principal: AuthPrincipal) {
  const issuedAt = Date.now();
  const challenge: ChallengeToken = {
    kind: "otp-challenge",
    officeId: principal.office.id,
    contactId: principal.contact.id,
    mobile: principal.contact.mobile,
    issuedAt,
    expiresAt: issuedAt + AUTH_CHALLENGE_TTL_SECONDS * 1000,
  };
  const cookieStore = await cookies();
  cookieStore.set(AUTH_CHALLENGE_COOKIE, sealPayload(challenge), {
    ...sharedCookieOptions,
    maxAge: AUTH_CHALLENGE_TTL_SECONDS,
  });
  return challenge;
}

export async function getOtpChallenge() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_CHALLENGE_COOKIE)?.value;
  if (!token) return { status: "missing" as const };

  const challenge = unsealPayload<ChallengeToken>(token);
  if (!isChallengeToken(challenge)) return { status: "missing" as const };
  if (challenge.expiresAt <= Date.now()) return { status: "expired" as const };
  return { status: "valid" as const, challenge };
}

export async function createAuthSession(principal: AuthPrincipal) {
  const issuedAt = Date.now();
  const session: SessionToken = {
    kind: "session",
    officeId: principal.office.id,
    officeName: principal.office.name,
    contactId: principal.contact.id,
    contactName: principal.contact.name,
    issuedAt,
    expiresAt: issuedAt + AUTH_SESSION_TTL_SECONDS * 1000,
  };
  const cookieStore = await cookies();
  cookieStore.set(AUTH_SESSION_COOKIE, sealPayload(session), {
    ...sharedCookieOptions,
    maxAge: AUTH_SESSION_TTL_SECONDS,
  });
  cookieStore.delete(AUTH_CHALLENGE_COOKIE);
  return session satisfies AuthSession;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = unsealPayload<SessionToken>(token);
  return isSessionToken(session) ? session : null;
}

export async function requireAuthSession() {
  const session = await getAuthSession();
  if (!session) redirect("/login");
  return session;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_SESSION_COOKIE);
  cookieStore.delete(AUTH_CHALLENGE_COOKIE);
}
