import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  display: "swap",
  variable: "--font-assistant",
});

export const metadata: Metadata = {
  title: "ראשי | פורטל משרדי המימון של ICAN",
  description: "פורטל עבודה למשרדי מימון העובדים עם ICAN",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} h-full`}>
      <body>{children}</body>
    </html>
  );
}
