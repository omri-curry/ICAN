import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { DealsList } from "@/components/deals/deals-list";
import { deals } from "@/data/mocks/deals";

export const metadata: Metadata = { title: "עסקאות | פורטל משרדי המימון של ICAN" };

export default function DealsPage() {
  return <AppShell activeSection="deals"><div className="deals-page"><section className="deals-page-heading"><p className="eyebrow">ניהול פעילות</p><h1>עסקאות</h1><p>כל העסקאות שלכם מול ICAN במקום אחד</p></section><DealsList deals={deals} /></div></AppShell>;
}
