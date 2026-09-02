import type { OcrCheckData } from "@/lib/ocr/types";

export type MockDealSubmission = Readonly<{ checks: ReadonlyArray<OcrCheckData> }>;

export async function submitMockDeal(submission: MockDealSubmission) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { dealNumber: "#10301", receivedChecks: submission.checks.length, submittedAt: new Date().toISOString() };
}
