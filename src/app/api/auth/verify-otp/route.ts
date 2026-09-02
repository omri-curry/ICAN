import { createAuthSession, getOtpChallenge } from "@/server/auth/session";
import { mockAuthService } from "@/server/services/auth/mock-auth-service";

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as unknown;
  const code =
    payload && typeof payload === "object" && "code" in payload && typeof payload.code === "string"
      ? payload.code.replace(/\D/g, "")
      : "";

  if (!/^\d{6}$/.test(code)) {
    return Response.json(
      { code: "INVALID_OTP", message: "קוד האימות שהוזן אינו תקין." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const challengeResult = await getOtpChallenge();
  if (challengeResult.status !== "valid") {
    return Response.json(
      { code: "OTP_EXPIRED", message: "קוד האימות פג תוקף. ניתן לשלוח קוד חדש." },
      { status: 410, headers: noStoreHeaders },
    );
  }

  const verification = await mockAuthService.verifyOtp(code, challengeResult.challenge);
  if (verification === "expired") {
    return Response.json(
      { code: "OTP_EXPIRED", message: "קוד האימות פג תוקף. ניתן לשלוח קוד חדש." },
      { status: 410, headers: noStoreHeaders },
    );
  }
  if (verification === "invalid") {
    return Response.json(
      { code: "INVALID_OTP", message: "קוד האימות שהוזן אינו תקין." },
      { status: 401, headers: noStoreHeaders },
    );
  }

  const principal = await mockAuthService.findPrincipal(
    challengeResult.challenge.officeId,
    challengeResult.challenge.contactId,
  );
  if (!principal) {
    return Response.json(
      { code: "AUTH_FAILED", message: "לא ניתן להשלים את ההתחברות כעת." },
      { status: 401, headers: noStoreHeaders },
    );
  }

  await createAuthSession(principal);
  return Response.json({ ok: true }, { headers: noStoreHeaders });
}
