import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { DealDetails } from "@/components/deals/deal-details";
import { deals, getDeal } from "@/data/mocks/deals";

export function generateStaticParams() {
  return deals.map((deal) => ({ id: deal.id }));
}

type DealPageProps = Readonly<{ params: Promise<{ id: string }> }>;

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const { id } = await params;
  const deal = getDeal(id);
  return { title: deal ? `עסקה ${deal.dealNumber} | ICAN` : "עסקה לא נמצאה | ICAN" };
}

export default async function DealPage({ params }: DealPageProps) {
  const { id } = await params;
  const deal = getDeal(id);
  if (!deal) notFound();
  return <AppShell activeSection="deals"><DealDetails deal={deal} /></AppShell>;
}
