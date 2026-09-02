"use client";

import { FormEvent, KeyboardEvent, ClipboardEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BuildingIcon, KeyIcon, PhoneIcon, ShieldIcon } from "@/components/ui/icons";
import {
  formatIsraeliMobile,
  isValidCompanyId,
  isValidIsraeliMobile,
  normalizeCompanyId,
  normalizeIsraeliMobile,
} from "@/lib/auth/validation";

type LoginFlowProps = Readonly<{ returnTo: string }>;
type FlowStep = "credentials" | "verify";
type LoginErrors = Readonly<{
  companyId?: string;
  mobile?: string;
  general?: string;
}>;

type ApiError = Readonly<{
  code?: string;
  message?: string;
  fieldErrors?: Readonly<{ companyId?: string; mobile?: string }>;
}>;

function isApiError(value: unknown): value is ApiError {
  return Boolean(value && typeof value === "object");
}

async function readJson(response: Response): Promise<unknown> {
  return response.json().catch(() => null);
}

export function LoginFlow({ returnTo }: LoginFlowProps) {
  const router = useRouter();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [step, setStep] = useState<FlowStep>("credentials");
  const [companyId, setCompanyId] = useState("");
  const [mobile, setMobile] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (step === "verify") otpRefs.current[0]?.focus();
  }, [step]);

  async function sendOtp(isResend = false) {
    if (sending || resending) return;
    setErrors({});
    setNotice("");
    if (isResend) setResending(true);
    else setSending(true);

    try {
      const response = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, mobile: normalizeIsraeliMobile(mobile) }),
      });
      const result = await readJson(response);

      if (!response.ok) {
        const apiError = isApiError(result) ? result : {};
        setErrors({
          companyId: apiError.fieldErrors?.companyId,
          mobile: apiError.fieldErrors?.mobile,
          general: apiError.message ?? "לא ניתן לשלוח קוד אימות כעת. נסו שוב בעוד מספר רגעים.",
        });
        return;
      }

      if (!result || typeof result !== "object" || !("maskedMobile" in result) || typeof result.maskedMobile !== "string") {
        setErrors({ general: "לא ניתן לשלוח קוד אימות כעת. נסו שוב בעוד מספר רגעים." });
        return;
      }

      setMaskedMobile(result.maskedMobile);
      setOtp(["", "", "", "", "", ""]);
      setStep("verify");
      if (isResend) setNotice("קוד אימות חדש נשלח למספר הטלפון.");
    } catch {
      setErrors({ general: "לא ניתן להתחבר לשירות האימות. בדקו את החיבור ונסו שוב." });
    } finally {
      setSending(false);
      setResending(false);
    }
  }

  function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: LoginErrors = {
      ...(!isValidCompanyId(companyId) ? { companyId: "יש להזין ח.פ תקין" } : {}),
      ...(!isValidIsraeliMobile(mobile) ? { mobile: "יש להזין מספר טלפון נייד תקין" } : {}),
    };
    if (nextErrors.companyId || nextErrors.mobile) {
      setErrors(nextErrors);
      return;
    }
    void sendOtp();
  }

  function distributeOtp(value: string, startIndex = 0) {
    const digits = value.replace(/\D/g, "").slice(0, 6 - startIndex).split("");
    if (!digits.length) return;
    setOtp((current) => {
      const next = [...current];
      digits.forEach((digit, offset) => { next[startIndex + offset] = digit; });
      return next;
    });
    setErrors({});
    const nextIndex = Math.min(startIndex + digits.length, 5);
    otpRefs.current[nextIndex]?.focus();
  }

  function updateOtp(index: number, value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length > 1) {
      distributeOtp(digits, index);
      return;
    }
    setOtp((current) => current.map((digit, digitIndex) => digitIndex === index ? digits : digit));
    setErrors({});
    if (digits && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      setOtp((current) => current.map((digit, digitIndex) => digitIndex === index - 1 ? "" : digit));
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) otpRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    distributeOtp(event.clipboardData.getData("text"));
  }

  async function submitOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (verifying) return;
    const code = otp.join("");
    if (!/^\d{6}$/.test(code)) {
      setErrors({ general: "יש להזין קוד אימות בן 6 ספרות." });
      otpRefs.current[otp.findIndex((digit) => !digit) === -1 ? 0 : otp.findIndex((digit) => !digit)]?.focus();
      return;
    }

    setVerifying(true);
    setErrors({});
    setNotice("");
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const result = await readJson(response);
      if (!response.ok) {
        const apiError = isApiError(result) ? result : {};
        setErrors({ general: apiError.message ?? "לא ניתן להשלים את האימות כעת." });
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        return;
      }

      router.replace(returnTo);
      router.refresh();
    } catch {
      setErrors({ general: "לא ניתן להתחבר לשירות האימות. בדקו את החיבור ונסו שוב." });
    } finally {
      setVerifying(false);
    }
  }

  function changeCredentials() {
    setStep("credentials");
    setOtp(["", "", "", "", "", ""]);
    setErrors({});
    setNotice("");
  }

  if (step === "verify") {
    return (
      <div className="auth-flow auth-flow-otp">
        <div className="auth-step-mark"><KeyIcon /></div>
        <p className="auth-eyebrow">אימות דו־שלבי</p>
        <h1>אימות מספר טלפון</h1>
        <p className="auth-subtitle">שלחנו קוד אימות למספר הטלפון שהוזן.</p>
        <p className="masked-mobile" dir="ltr">{maskedMobile}</p>

        <form onSubmit={submitOtp} noValidate>
          <fieldset className="otp-fieldset" disabled={verifying || resending}>
            <legend className="sr-only">קוד אימות בן 6 ספרות</legend>
            <div className="otp-inputs" dir="ltr" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => { otpRefs.current[index] = element; }}
                  value={digit}
                  onChange={(event) => updateOtp(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={index === 0 ? 6 : 1}
                  aria-label={`ספרה ${index + 1} מתוך 6`}
                  aria-invalid={Boolean(errors.general)}
                />
              ))}
            </div>
          </fieldset>

          <div className="auth-feedback" aria-live="polite">
            {errors.general ? <p className="auth-error" role="alert">{errors.general}</p> : null}
            {notice ? <p className="auth-notice">{notice}</p> : null}
          </div>

          <button className="auth-primary-button" type="submit" disabled={verifying || resending}>
            {verifying ? <><span className="button-spinner" />מאמתים את הפרטים...</> : "אימות וכניסה"}
          </button>
        </form>

        <div className="auth-secondary-actions">
          <button type="button" onClick={() => void sendOtp(true)} disabled={verifying || resending}>
            {resending ? "שולחים קוד חדש..." : "שליחת קוד חדש"}
          </button>
          <span aria-hidden="true" />
          <button type="button" onClick={changeCredentials} disabled={verifying || resending}>שינוי פרטי התחברות</button>
        </div>
        <p className="otp-validity"><ShieldIcon /> הקוד תקף למשך 5 דקות ונועד לשימוש חד־פעמי.</p>
      </div>
    );
  }

  return (
    <div className="auth-flow">
      <p className="auth-eyebrow">גישה מאובטחת</p>
      <h1>כניסה לפורטל משרדי המימון</h1>
      <p className="auth-subtitle">הזינו את פרטי המשרד ואיש הקשר לצורך אימות וכניסה מאובטחת לפורטל.</p>

      <form onSubmit={submitCredentials} noValidate>
        <label className="auth-field" htmlFor="company-id">
          <span>ח.פ</span>
          <div className={errors.companyId ? "auth-input auth-input-error" : "auth-input"}>
            <BuildingIcon />
            <input
              id="company-id"
              name="companyId"
              value={companyId}
              onChange={(event) => { setCompanyId(normalizeCompanyId(event.target.value)); setErrors({}); }}
              placeholder="לדוגמה 515123456"
              inputMode="numeric"
              autoComplete="organization"
              disabled={sending}
              aria-invalid={Boolean(errors.companyId)}
              aria-describedby={errors.companyId ? "company-id-error" : undefined}
            />
          </div>
          {errors.companyId ? <small id="company-id-error" className="field-error">{errors.companyId}</small> : null}
        </label>

        <label className="auth-field" htmlFor="mobile">
          <span>מספר טלפון נייד</span>
          <div className={errors.mobile ? "auth-input auth-input-error" : "auth-input"}>
            <PhoneIcon />
            <input
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={(event) => { setMobile(formatIsraeliMobile(event.target.value)); setErrors({}); }}
              placeholder="05X-XXXXXXX"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              disabled={sending}
              aria-invalid={Boolean(errors.mobile)}
              aria-describedby={errors.mobile ? "mobile-error" : undefined}
            />
          </div>
          {errors.mobile ? <small id="mobile-error" className="field-error">{errors.mobile}</small> : null}
        </label>

        <div className="auth-feedback" aria-live="polite">
          {errors.general ? <p className="auth-error" role="alert">{errors.general}</p> : null}
        </div>

        <button className="auth-primary-button" type="submit" disabled={sending}>
          {sending ? <><span className="button-spinner" />שולחים קוד אימות...</> : "שליחת קוד אימות"}
        </button>
      </form>

      <div className="auth-security-note">
        <ShieldIcon />
        <p><strong>הכניסה לפורטל מיועדת לאנשי קשר מורשים בלבד.</strong><span>מטעמי אבטחה, הגישה מתאפשרת רק לאנשי קשר שהוגדרו מראש על ידי ICAN.</span></p>
      </div>
      <p className="auth-support">נתקלתם בבעיה בהתחברות? <strong>צרו קשר עם צוות ICAN.</strong></p>
    </div>
  );
}
