import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ricardo Zuluaga | Senior Solutions Architect & AI Automation Expert",
  description:
    "Senior Solutions Architect with 10+ years building scalable infrastructure, AI agent orchestration and high-availability systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 font-sans">{children}</body>
    </html>
  );
}
