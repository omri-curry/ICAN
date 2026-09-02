"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { DraftCheck, OcrCheckData, OcrFieldName, OcrRequest, OcrResponse, UploadedFileInfo } from "@/lib/ocr/types";
import { emptyOcrData, requiredOcrFields } from "@/lib/ocr/types";
import { formatCurrency, formatDate } from "@/data/mocks/deals";
import { UploadIcon } from "@/components/ui/icons";

type FlowStep = "upload" | "processing" | "verify" | "summary" | "submitting" | "success";
type FileSide = "frontFile" | "backFile";

const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
const fields: ReadonlyArray<{ key: OcrFieldName; label: string; type?: string }> = [
  { key: "checkNumber", label: "מספר צ׳ק" }, { key: "amount", label: "סכום", type: "number" },
  { key: "dueDate", label: "תאריך פירעון", type: "date" }, { key: "drawerName", label: "שם מושך" },
  { key: "accountNumber", label: "מספר חשבון" }, { key: "bankNumber", label: "מספר בנק" }, { key: "branchNumber", label: "מספר סניף" },
];

function createDraftCheck(index: number, id = `draft-${index}`): DraftCheck {
  return { id, frontFile: null, backFile: null, ocrStatus: "pending", verificationStatus: "unverified", ocrData: null, confidence: null, errors: [], attempt: 0, expanded: index === 0 };
}

function toFileInfo(file: File): UploadedFileInfo {
  return { name: file.name, size: file.size, type: file.type, previewUrl: URL.createObjectURL(file) };
}

function hasRequiredData(data: OcrCheckData | null) {
  return Boolean(data && requiredOcrFields.every((field) => data[field].trim()));
}

function ConfidenceHint({ confidence }: Readonly<{ confidence: number | undefined }>) {
  if (confidence === undefined || confidence >= .9) return null;
  return confidence < .7 ? <span className="confidence-hint confidence-low">מומלץ לבדוק את הנתון</span> : <span className="confidence-hint">כדאי לוודא</span>;
}

function FilePreview({ file, label }: Readonly<{ file: UploadedFileInfo | null; label: string }>) {
  if (!file) return <div className="file-preview-empty">לא צורף קובץ</div>;
  return <div className="file-preview">{file.type.startsWith("image/") && file.previewUrl ? <Image src={file.previewUrl} alt={`תצוגה מקדימה — ${label}`} width={152} height={124} unoptimized /> : <div className="pdf-preview">PDF</div>}<span title={file.name}>{file.name}</span></div>;
}

type UploadSlotProps = Readonly<{ checkId: string; side: FileSide; label: string; file: UploadedFileInfo | null; onFile: (checkId: string, side: FileSide, file: File) => void }>;
function UploadSlot({ checkId, side, label, file, onFile }: UploadSlotProps) {
  const inputId = `${checkId}-${side}`;
  function acceptFile(candidate: File | undefined) { if (candidate) onFile(checkId, side, candidate); }
  return <div className={`upload-slot${file ? " has-file" : ""}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); acceptFile(event.dataTransfer.files[0]); }}><div className="upload-side-label">{label}</div>{file ? <><FilePreview file={file} label={label} /><label htmlFor={inputId} className="replace-file">החלפת קובץ</label></> : <label htmlFor={inputId} className="upload-prompt"><span className="upload-icon"><UploadIcon /></span><strong>גררו קובץ לכאן</strong><small>או לחצו לבחירה · JPG, PNG, PDF</small></label>}<input id={inputId} className="file-input" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={(event) => acceptFile(event.target.files?.[0])} /></div>;
}

export function NewDealFlow() {
  const [step, setStep] = useState<FlowStep>("upload");
  const [checks, setChecks] = useState<ReadonlyArray<DraftCheck>>([createDraftCheck(0)]);
  const [message, setMessage] = useState("");
  const [submittedDealNumber, setSubmittedDealNumber] = useState("#10301");

  const stepNumber = step === "upload" || step === "processing" ? 1 : step === "verify" ? 2 : step === "summary" ? 3 : 4;
  const everyFileReady = checks.every((check) => check.frontFile && check.backFile);
  const everyVerified = checks.every((check) => check.verificationStatus === "verified" && hasRequiredData(check.ocrData));
  const totalAmount = useMemo(() => checks.reduce((total, check) => total + Number(check.ocrData?.amount || 0), 0), [checks]);
  const dueDates = checks.map((check) => check.ocrData?.dueDate).filter((value): value is string => Boolean(value)).sort();

  function addCheck() { setChecks((current) => [...current, createDraftCheck(current.length, `draft-${Date.now()}-${current.length}`)]); }
  function removeCheck(id: string) { setChecks((current) => current.filter((check) => check.id !== id)); }
  function setFile(checkId: string, side: FileSide, file: File) {
    if (!acceptedTypes.includes(file.type)) { setMessage("סוג הקובץ אינו נתמך. ניתן לצרף JPG, PNG או PDF בלבד."); return; }
    setMessage("");
    setChecks((current) => current.map((check) => check.id === checkId ? { ...check, [side]: toFileInfo(file), ocrStatus: check.ocrData ? "pending" : check.ocrStatus, verificationStatus: check.verificationStatus === "verified" ? "needs_reverification" : check.verificationStatus, errors: check.ocrData ? ["הקובץ הוחלף. יש לבצע קריאה חוזרת."] : check.errors } : check));
  }

  async function readOneCheck(check: DraftCheck, checkIndex: number, attempt: number) {
    if (!check.frontFile || !check.backFile) throw new Error("missing files");
    const payload: OcrRequest = { checkId: check.id, checkIndex, attempt, frontFile: check.frontFile, backFile: check.backFile };
    const response = await fetch("/api/ocr", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error("OCR request failed");
    return await response.json() as OcrResponse;
  }

  async function processChecks() {
    if (!everyFileReady) return;
    setStep("processing"); setMessage("");
    for (let index = 0; index < checks.length; index += 1) {
      const check = checks[index];
      setChecks((current) => current.map((item) => item.id === check.id ? { ...item, ocrStatus: "processing" } : item));
      try {
        const result = await readOneCheck(check, index, check.attempt);
        setChecks((current) => current.map((item) => item.id === check.id ? { ...item, ocrStatus: result.status, ocrData: result.data, confidence: result.confidence, errors: result.errors, verificationStatus: "unverified" } : item));
      } catch {
        setChecks((current) => current.map((item) => item.id === check.id ? { ...item, ocrStatus: "failed", ocrData: { ...emptyOcrData }, confidence: null, errors: ["לא הצלחנו לקרוא את תמונות הצ׳ק."] } : item));
      }
    }
    setChecks((current) => current.map((check, index) => ({ ...check, expanded: index === 0 })));
    setStep("verify");
  }

  async function retryOcr(checkId: string) {
    const index = checks.findIndex((check) => check.id === checkId);
    const check = checks[index];
    if (!check?.frontFile || !check.backFile) return;
    const attempt = check.attempt + 1;
    setChecks((current) => current.map((item) => item.id === checkId ? { ...item, ocrStatus: "processing", attempt } : item));
    try {
      const result = await readOneCheck(check, index, attempt);
      setChecks((current) => current.map((item) => item.id === checkId ? { ...item, ocrStatus: result.status, ocrData: result.data, confidence: result.confidence, errors: result.errors, verificationStatus: "unverified", attempt } : item));
    } catch { setChecks((current) => current.map((item) => item.id === checkId ? { ...item, ocrStatus: "failed", errors: ["הקריאה החוזרת לא הצליחה. ניתן להזין את הנתונים ידנית."] } : item)); }
  }

  function changeField(checkId: string, field: OcrFieldName, value: string) {
    setChecks((current) => current.map((check) => check.id === checkId ? { ...check, ocrData: { ...(check.ocrData ?? emptyOcrData), [field]: value }, verificationStatus: check.verificationStatus === "verified" ? "needs_reverification" : check.verificationStatus } : check));
  }
  function toggleCheck(checkId: string) { setChecks((current) => current.map((check) => ({ ...check, expanded: check.id === checkId ? !check.expanded : false }))); }
  function verifyCheck(checkId: string) {
    const check = checks.find((item) => item.id === checkId);
    if (!check || !hasRequiredData(check.ocrData)) { setMessage("יש להשלים את כל שדות החובה לפני אישור הצ׳ק."); return; }
    setMessage("");
    setChecks((current) => current.map((item) => item.id === checkId ? { ...item, verificationStatus: "verified", expanded: false } : item));
  }

  async function submitDeal() {
    if (!everyVerified) { setMessage("יש לאמת את כל הצ׳קים לפני שליחת העסקה."); return; }
    setStep("submitting"); setMessage("");
    const response = await fetch("/api/deals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checks: checks.map((check) => check.ocrData) }) });
    if (!response.ok) { setStep("summary"); setMessage("שליחת העסקה לא הצליחה. ניתן לנסות שוב."); return; }
    const result = await response.json() as { dealNumber: string };
    setSubmittedDealNumber(result.dealNumber); setStep("success");
  }

  if (step === "success") return <div className="new-deal-page"><StepIndicator current={4} complete /><section className="submission-success"><div className="success-mark">✓</div><p className="eyebrow">השליחה הושלמה</p><h1>העסקה נשלחה בהצלחה</h1><p>העסקה התקבלה ב־ICAN והועברה לטיפול.</p><div className="submitted-number"><span>מספר עסקה</span><strong dir="ltr">{submittedDealNumber}</strong></div><div className="success-actions"><Link href="/deals/10301">צפייה בעסקה</Link><Link href="/">חזרה לדשבורד</Link></div></section></div>;

  return <div className="new-deal-page"><section className="new-deal-heading"><p className="eyebrow">יצירת עסקה</p><h1>{step === "verify" ? "אימות נתוני הצ׳קים" : step === "summary" || step === "submitting" ? "סיכום העסקה" : "עסקה חדשה"}</h1><p>{step === "verify" ? "עברו על הנתונים שנקראו מהצ׳קים ואשרו שהם נכונים לפני שליחת העסקה." : step === "summary" || step === "submitting" ? "בדקו את פרטי העסקה לפני השליחה ל־ICAN." : "העלאת צ׳קים ליצירת עסקה חדשה"}</p></section><StepIndicator current={stepNumber} />
    {message ? <div className="flow-message" role="alert">{message}</div> : null}
    {step === "upload" ? <><section className="upload-checks">{checks.map((check, index) => <article className="upload-check-card" key={check.id}><div className="upload-card-head"><div><span>צ׳ק</span><strong>{index + 1}</strong></div><button type="button" onClick={() => removeCheck(check.id)} disabled={checks.length === 1}>הסרת צ׳ק</button></div><div className="upload-sides"><UploadSlot checkId={check.id} side="frontFile" label="צד קדמי" file={check.frontFile} onFile={setFile} /><UploadSlot checkId={check.id} side="backFile" label="צד אחורי" file={check.backFile} onFile={setFile} /></div></article>)}</section><button type="button" className="add-check-button" onClick={addCheck}>＋ הוספת צ׳ק נוסף</button><FlowFooter count={checks.length}><button type="button" className="primary-flow-button" onClick={processChecks} disabled={!everyFileReady}>המשך לקריאת הצ׳קים</button></FlowFooter></> : null}
    {step === "processing" ? <section className="ocr-processing"><div className="processing-icon"><span /></div><h2>קוראים את נתוני הצ׳קים...</h2><p>בודקים את התמונות ומחלצים את פרטי הצ׳קים.</p><div className="processing-list">{checks.map((check, index) => <div key={check.id}><strong>צ׳ק {index + 1}</strong><span className={`ocr-state ocr-${check.ocrStatus}`}>{check.ocrStatus === "completed" || check.ocrStatus === "partial" ? "הושלם" : check.ocrStatus === "processing" ? "בעיבוד" : "ממתין"}</span></div>)}</div></section> : null}
    {step === "verify" ? <><section className="verification-list">{checks.map((check, index) => <article className={`verification-card verification-${check.verificationStatus}`} key={check.id}><button type="button" className="verification-card-head" onClick={() => toggleCheck(check.id)} aria-expanded={check.expanded}><div className="check-index">{index + 1}</div><div><span>צ׳ק {index + 1}</span><strong dir="ltr">{check.ocrData?.amount ? formatCurrency(Number(check.ocrData.amount)) : "סכום לא זוהה"}</strong></div><div className="verify-card-date"><span>תאריך פירעון</span><strong dir="ltr">{check.ocrData?.dueDate ? formatDate(check.ocrData.dueDate) : "חסר"}</strong></div><span className="verification-badge">{check.verificationStatus === "verified" ? "אומת" : check.verificationStatus === "needs_reverification" ? "נדרש אימות מחדש" : "ממתין לאימות"}</span><i>{check.expanded ? "−" : "+"}</i></button>{check.expanded ? <div className="verification-body">{check.errors.length ? <div className="ocr-warning"><strong>לא הצלחנו לקרוא חלק מהנתונים.</strong><p>ניתן להזין את הנתונים ידנית או להחליף את הקובץ.</p><ul>{check.errors.map((error) => <li key={error}>{error}</li>)}</ul><button type="button" onClick={() => retryOcr(check.id)} disabled={check.ocrStatus === "processing"}>{check.ocrStatus === "processing" ? "קוראים מחדש..." : "ניסיון קריאה חוזר"}</button></div> : null}<div className="verify-layout"><div className="verify-previews"><UploadSlot checkId={check.id} side="frontFile" label="צד קדמי" file={check.frontFile} onFile={setFile} /><UploadSlot checkId={check.id} side="backFile" label="צד אחורי" file={check.backFile} onFile={setFile} /></div><div className="ocr-fields">{fields.map((field) => { const confidence = check.confidence?.[field.key]; return <label className={confidence !== undefined && confidence < .7 ? "field-low-confidence" : confidence !== undefined && confidence < .9 ? "field-medium-confidence" : ""} key={field.key}><span>{field.label}</span><input type={field.type ?? "text"} value={check.ocrData?.[field.key] ?? ""} onChange={(event) => changeField(check.id, field.key, event.target.value)} required /><ConfidenceHint confidence={confidence} /></label>; })}</div></div><div className="verify-actions"><span>{hasRequiredData(check.ocrData) ? "כל שדות החובה מלאים" : "נותרו שדות חובה להשלמה"}</span><button type="button" onClick={() => verifyCheck(check.id)} disabled={!hasRequiredData(check.ocrData)}>אישור נתוני הצ׳ק</button></div></div> : null}</article>)}</section><FlowFooter count={checks.length}><button type="button" className="secondary-flow-button" onClick={() => setStep("upload")}>חזרה להעלאה</button><button type="button" className="primary-flow-button" onClick={() => setStep("summary")} disabled={!everyVerified}>המשך לסיכום העסקה</button></FlowFooter></> : null}
    {step === "summary" || step === "submitting" ? <><section className="deal-draft-summary"><div className="summary-metrics"><article><span>מספר צ׳קים</span><strong>{checks.length}</strong></article><article className="summary-total"><span>סה״כ עסקה</span><strong dir="ltr">{formatCurrency(totalAmount)}</strong></article><article><span>מועד קרוב</span><strong dir="ltr">{dueDates[0] ? formatDate(dueDates[0]) : "—"}</strong></article><article><span>מועד רחוק</span><strong dir="ltr">{dueDates.at(-1) ? formatDate(dueDates.at(-1)!) : "—"}</strong></article></div><div className="summary-check-list">{checks.map((check, index) => <article key={check.id}><div><span>צ׳ק</span><strong>{index + 1}</strong></div><dl><div><dt>מספר צ׳ק</dt><dd dir="ltr">{check.ocrData?.checkNumber}</dd></div><div><dt>סכום</dt><dd dir="ltr">{formatCurrency(Number(check.ocrData?.amount))}</dd></div><div><dt>תאריך פירעון</dt><dd dir="ltr">{formatDate(check.ocrData?.dueDate ?? "")}</dd></div><div><dt>שם מושך</dt><dd>{check.ocrData?.drawerName}</dd></div></dl><span className="summary-verified">✓ אומת</span></article>)}</div><div className="summary-grand-total"><span>סה״כ עסקה</span><strong dir="ltr">{formatCurrency(totalAmount)}</strong></div></section><FlowFooter count={checks.length}><button type="button" className="secondary-flow-button" onClick={() => setStep("verify")} disabled={step === "submitting"}>חזרה לאימות</button><button type="button" className="primary-flow-button" onClick={submitDeal} disabled={step === "submitting"}>{step === "submitting" ? "שולחים את העסקה..." : "שליחת העסקה ל-ICAN"}</button></FlowFooter></> : null}
  </div>;
}

function StepIndicator({ current, complete = false }: Readonly<{ current: number; complete?: boolean }>) {
  return <ol className="flow-steps" aria-label="שלבי יצירת עסקה">{["העלאת צ׳קים", "אימות נתונים", "סיכום", "שליחה"].map((label, index) => { const number = index + 1; const state = complete || number < current ? "complete" : number === current ? "current" : "future"; return <li className={state} aria-current={state === "current" ? "step" : undefined} key={label}><span>{state === "complete" ? "✓" : number}</span><strong>{label}</strong></li>; })}</ol>;
}

function FlowFooter({ count, children }: Readonly<{ count: number; children: React.ReactNode }>) {
  return <footer className="flow-footer"><div><span>מספר צ׳קים</span><strong>{count}</strong></div><div>{children}</div></footer>;
}
