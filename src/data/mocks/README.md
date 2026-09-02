# Mock data

Keep development fixtures and clearly fictional portal data in this directory. Do not commit real ICAN, financing-office, customer, or transaction data.

## Mock authentication

- Company ID: `515123456`
- Authorized mobile: `0501234567`
- OTP: `123456`
- Expiration-state test code: `000000`

Authentication fixtures are imported only by the server-side mock auth service. The expiration code is a development-only shortcut for testing the expired-code UI without waiting for the five-minute challenge lifetime.
