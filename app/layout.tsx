import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FitAI — Nutrition Chatbot",
  description:
    "Tell FitAI what you ate and get instant macros. أخبر FitAI بما تناولته واحصل على تحليل فوري.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
