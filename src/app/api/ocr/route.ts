import type { OcrRequest } from "@/lib/ocr/types";
import { getAuthSession } from "@/server/auth/session";
import { mockOcrService } from "@/server/services/ocr/mock-ocr-service";

export async function POST(request: Request) {
  if (!await getAuthSession()) return Response.json({ error: "נדרשת התחברות לפורטל" }, { status: 401 });
  const payload = await request.json() as Partial<OcrRequest>;
  if (!payload.checkId || typeof payload.checkIndex !== "number" || !payload.frontFile || !payload.backFile) {
    return Response.json({ error: "בקשת OCR אינה תקינה" }, { status: 400 });
  }
  const result = await mockOcrService.readCheck(payload as OcrRequest);
  return Response.json(result);
}
