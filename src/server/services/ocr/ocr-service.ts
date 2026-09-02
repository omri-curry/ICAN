import type { OcrRequest, OcrResponse } from "@/lib/ocr/types";

export interface OcrService {
  readCheck(request: OcrRequest): Promise<OcrResponse>;
}
