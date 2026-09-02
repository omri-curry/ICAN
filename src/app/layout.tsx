import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ראשי | פורטל משרדי המימון של ICAN",
  description: "פורטל עבודה למשרדי מימון העובדים עם ICAN",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full">
      <body>{children}</body>
    </html>
  );
}
