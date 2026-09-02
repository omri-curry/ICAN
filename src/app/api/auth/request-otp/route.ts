import { isValidCompanyId, isValidIsraeliMobile, maskIsraeliMobile, normalizeCompanyId, normalizeIsraeliMobile } from "@/lib/auth/validation";
import { createOtpChallenge } from "@/server/auth/session";
import { mockAuthService } from "@/server/services/auth/mock-auth-service";

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as unknown;
  const companyId =
    payload && typeof payload === "object" && "companyId" in payload && typeof payload.companyId === "string"
      ? normalizeCompanyId(payload.companyId)
      : "";
  const mobile =
    payload && typeof payload === "object" && "mobile" in payload && typeof payload.mobile === "string"
      ? normalizeIsraeliMobile(payload.mobile)
      : "";

  const fieldErrors = {
    ...(!isValidCompanyId(companyId) ? { companyId: "יש להזין ח.פ תקין" } : {}),
    ...(!isValidIsraeliMobile(mobile) ? { mobile: "יש להזין מספר טלפון נייד תקין" } : {}),
  };
  if (Object.keys(fieldErrors).length) {
    return Response.json({ code: "INVALID_INPUT", fieldErrors }, { status: 400, headers: noStoreHeaders });
  }

  const lookup = await mockAuthService.findAuthorizedContact(companyId, mobile);
  if (!lookup.ok) {
    return Response.json(
      { code: "UNAUTHORIZED_CONTACT", message: "לא נמצאה התאמה בין פרטי המשרד לאיש הקשר." },
      { status: 401, headers: noStoreHeaders },
    );
  }

  const challenge = await createOtpChallenge(lookup.principal);
  return Response.json(
    {
      maskedMobile: maskIsraeliMobile(lookup.principal.contact.mobile),
      expiresAt: challenge.expiresAt,
    },
    { headers: noStoreHeaders },
  );
}
