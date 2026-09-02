import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { NewDealFlow } from "@/components/deals/new-deal-flow";

export const metadata: Metadata = { title: "עסקה חדשה | פורטל משרדי המימון של ICAN" };

export default function NewDealPage() {
  return <AppShell activeSection="new"><NewDealFlow /></AppShell>;
}
