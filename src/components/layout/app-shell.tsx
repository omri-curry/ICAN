import type { ReactNode } from "react";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-5 sm:px-8">
          <span className="text-lg font-bold tracking-wide text-brand">ICAN</span>
        </div>
      </header>
      <main className="flex flex-1">{children}</main>
    </div>
  );
}
