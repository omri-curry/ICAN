import { AppShell } from "@/components/layout/app-shell";

export default function Home() {
  return (
    <AppShell>
      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center px-5 py-16 sm:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-semibold text-brand">ICAN</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            פורטל המימון
          </h1>
          <p className="mt-5 text-base leading-8 text-muted sm:text-lg">
            התשתית מוכנה. סביבת העבודה למשרדי המימון תיבנה כאן בהמשך.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
