export function normalizeCompanyId(value: string) {
  return value.replace(/\D/g, "").slice(0, 9);
}

export function isValidCompanyId(value: string) {
  return normalizeCompanyId(value).length === 9;
}

export function normalizeIsraeliMobile(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("972") && digits.length === 12) {
    return `0${digits.slice(3)}`;
  }

  return digits.slice(0, 10);
}

export function isValidIsraeliMobile(value: string) {
  return /^05\d{8}$/.test(normalizeIsraeliMobile(value));
}

export function formatIsraeliMobile(value: string) {
  const mobile = normalizeIsraeliMobile(value);
  if (mobile.length <= 3) return mobile;
  if (mobile.length <= 6) return `${mobile.slice(0, 3)}-${mobile.slice(3)}`;
  return `${mobile.slice(0, 3)}-${mobile.slice(3, 6)}-${mobile.slice(6)}`;
}

export function maskIsraeliMobile(value: string) {
  const mobile = normalizeIsraeliMobile(value);
  return `${mobile.slice(0, 3)}-***-${mobile.slice(-4)}`;
}
