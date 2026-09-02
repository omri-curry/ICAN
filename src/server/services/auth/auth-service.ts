import type { AuthLookupResult, AuthPrincipal, OtpChallenge, OtpVerificationResult } from "@/lib/auth/types";

export interface AuthService {
  findAuthorizedContact(companyId: string, mobile: string): Promise<AuthLookupResult>;
  findPrincipal(officeId: string, contactId: string): Promise<AuthPrincipal | null>;
  verifyOtp(code: string, challenge: OtpChallenge): Promise<OtpVerificationResult>;
}
