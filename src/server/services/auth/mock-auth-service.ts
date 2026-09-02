import "server-only";
import { mockAuthorizedContacts, mockFinancingOffices } from "@/data/mocks/auth";
import type { OtpChallenge } from "@/lib/auth/types";
import type { AuthService } from "@/server/services/auth/auth-service";

const MOCK_OTP = "123456";
const MOCK_EXPIRED_OTP = "000000";
const MOCK_LATENCY_MS = 420;

function waitForMockProvider() {
  return new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
}

export const mockAuthService: AuthService = {
  async findAuthorizedContact(companyId, mobile) {
    await waitForMockProvider();

    const office = mockFinancingOffices.find(
      (candidate) => candidate.active && candidate.companyId === companyId,
    );
    const contact = office
      ? mockAuthorizedContacts.find(
          (candidate) =>
            candidate.active &&
            candidate.officeId === office.id &&
            candidate.mobile === mobile,
        )
      : undefined;

    return office && contact
      ? { ok: true, principal: { office, contact } }
      : { ok: false };
  },

  async findPrincipal(officeId, contactId) {
    const office = mockFinancingOffices.find(
      (candidate) => candidate.active && candidate.id === officeId,
    );
    const contact = mockAuthorizedContacts.find(
      (candidate) =>
        candidate.active &&
        candidate.id === contactId &&
        candidate.officeId === officeId,
    );

    return office && contact ? { office, contact } : null;
  },

  async verifyOtp(code, challenge: OtpChallenge) {
    await waitForMockProvider();

    // Development-only shortcut used to exercise the expiration UX without waiting five minutes.
    if (code === MOCK_EXPIRED_OTP || challenge.expiresAt <= Date.now()) return "expired";
    return code === MOCK_OTP ? "valid" : "invalid";
  },
};
