export type FinancingOffice = Readonly<{
  id: string;
  name: string;
  companyId: string;
  active: boolean;
}>;

export type AuthorizedContact = Readonly<{
  id: string;
  officeId: string;
  name: string;
  mobile: string;
  active: boolean;
}>;

export type AuthSession = Readonly<{
  officeId: string;
  officeName: string;
  contactId: string;
  contactName: string;
  issuedAt: number;
  expiresAt: number;
}>;

export type OtpChallenge = Readonly<{
  officeId: string;
  contactId: string;
  mobile: string;
  issuedAt: number;
  expiresAt: number;
}>;

export type AuthPrincipal = Readonly<{
  office: FinancingOffice;
  contact: AuthorizedContact;
}>;

export type AuthLookupResult =
  | Readonly<{ ok: true; principal: AuthPrincipal }>
  | Readonly<{ ok: false }>;

export type OtpVerificationResult = "valid" | "invalid" | "expired";
