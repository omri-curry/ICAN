import type { OcrCheckData } from "@/lib/ocr/types";
import { submitMockDeal } from "@/server/services/deals/mock-submission-service";

export async function POST(request: Request) {
  const payload = await request.json() as { checks?: ReadonlyArray<OcrCheckData> };
  if (!payload.checks?.length) return Response.json({ error: "לא צורפו צ׳קים לעסקה" }, { status: 400 });
  if (payload.checks.some((check) => Object.values(check).some((value) => !value.trim()))) {
    return Response.json({ error: "חסרים נתוני חובה" }, { status: 400 });
  }
  return Response.json(await submitMockDeal({ checks: payload.checks }));
}
