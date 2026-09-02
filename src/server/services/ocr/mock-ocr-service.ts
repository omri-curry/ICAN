import type { OcrCheckData, OcrConfidence } from "@/lib/ocr/types";
import type { OcrService } from "./ocr-service";

const mockChecks: ReadonlyArray<OcrCheckData> = [
  { checkNumber: "184520", amount: "45000", dueDate: "2026-10-15", drawerName: "חברת א.ב בע״מ", accountNumber: "00124789", bankNumber: "12", branchNumber: "431" },
  { checkNumber: "552018", amount: "62000", dueDate: "2026-10-30", drawerName: "אלון מסחר בע״מ", accountNumber: "00481225", bankNumber: "10", branchNumber: "921" },
  { checkNumber: "774103", amount: "38000", dueDate: "2026-11-15", drawerName: "חברת גמא בע״מ", accountNumber: "00771402", bankNumber: "", branchNumber: "128" },
  { checkNumber: "310781", amount: "55000", dueDate: "2026-11-30", drawerName: "פסגה פתרונות בע״מ", accountNumber: "00651288", bankNumber: "20", branchNumber: "644" },
  { checkNumber: "921407", amount: "", dueDate: "2026-12-15", drawerName: "נגב תעשיות בע״מ", accountNumber: "00889910", bankNumber: "11", branchNumber: "752" },
];

const highConfidence: OcrConfidence = { checkNumber: .96, amount: .98, dueDate: .95, drawerName: .91, accountNumber: .94, bankNumber: .95, branchNumber: .93 };

export const mockOcrService: OcrService = {
  async readCheck(request) {
    await new Promise((resolve) => setTimeout(resolve, 240));
    const source = mockChecks[request.checkIndex % mockChecks.length];
    const lowConfidence = request.checkIndex % mockChecks.length === 2;
    const firstFailure = request.checkIndex % mockChecks.length === 4 && request.attempt === 0;
    const data = { ...source };
    const confidence = { ...highConfidence };

    if (lowConfidence) confidence.bankNumber = .58;
    if (firstFailure) {
      confidence.amount = .2;
      return { status: "partial", data, confidence, errors: ["לא הצלחנו לזהות את סכום הצ׳ק.", "איכות התמונה נמוכה בחלק התחתון של הצ׳ק."] };
    }
    if (request.attempt > 0 && !data.amount) data.amount = "47000";
    return { status: lowConfidence ? "partial" : "completed", data, confidence, errors: lowConfidence ? ["מומלץ לבדוק את מספר הבנק."] : [] };
  },
};
