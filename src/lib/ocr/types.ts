export type OcrFieldName = "checkNumber" | "amount" | "dueDate" | "drawerName" | "accountNumber" | "bankNumber" | "branchNumber";

export type OcrCheckData = Record<OcrFieldName, string>;
export type OcrConfidence = Record<OcrFieldName, number>;

export type OcrStatus = "pending" | "processing" | "completed" | "partial" | "failed";
export type VerificationStatus = "unverified" | "verified" | "needs_reverification";

export type UploadedFileInfo = Readonly<{
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}>;

export type OcrRequest = Readonly<{
  checkId: string;
  checkIndex: number;
  attempt: number;
  frontFile: UploadedFileInfo;
  backFile: UploadedFileInfo;
}>;

export type OcrResponse = Readonly<{
  status: Extract<OcrStatus, "completed" | "partial" | "failed">;
  data: OcrCheckData;
  confidence: OcrConfidence;
  errors: ReadonlyArray<string>;
}>;

export type DraftCheck = Readonly<{
  id: string;
  frontFile: UploadedFileInfo | null;
  backFile: UploadedFileInfo | null;
  ocrStatus: OcrStatus;
  verificationStatus: VerificationStatus;
  ocrData: OcrCheckData | null;
  confidence: OcrConfidence | null;
  errors: ReadonlyArray<string>;
  attempt: number;
  expanded: boolean;
}>;

export const emptyOcrData: OcrCheckData = {
  checkNumber: "",
  amount: "",
  dueDate: "",
  drawerName: "",
  accountNumber: "",
  bankNumber: "",
  branchNumber: "",
};

export const requiredOcrFields: ReadonlyArray<OcrFieldName> = ["checkNumber", "amount", "dueDate", "drawerName", "accountNumber", "bankNumber", "branchNumber"];
