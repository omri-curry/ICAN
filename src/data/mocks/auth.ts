import "server-only";
import type { AuthorizedContact, FinancingOffice } from "@/lib/auth/types";

export const mockFinancingOffices: ReadonlyArray<FinancingOffice> = [
  {
    id: "office-ofek-001",
    name: "אופק פתרונות מימון",
    companyId: "515123456",
    active: true,
  },
];

export const mockAuthorizedContacts: ReadonlyArray<AuthorizedContact> = [
  {
    id: "contact-israel-001",
    officeId: "office-ofek-001",
    name: "ישראל ישראלי",
    mobile: "0501234567",
    active: true,
  },
];
