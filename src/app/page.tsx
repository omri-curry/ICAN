import { AppShell } from "@/components/layout/app-shell";
import { Dashboard } from "@/components/dashboard/dashboard";
import { requireAuthSession } from "@/server/auth/session";

export default async function Home() {
  const session = await requireAuthSession();
  return (
    <AppShell>
      <Dashboard officeName={session.officeName} />
    </AppShell>
  );
}
