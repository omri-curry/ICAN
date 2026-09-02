import { clearAuthCookies } from "@/server/auth/session";

export async function POST() {
  await clearAuthCookies();
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
