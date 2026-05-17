import type { Metadata } from "next";
import { Newsreader } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getServerSession } from "next-auth";
import { AppSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { authOptions } from "@/lib/auth";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Syncora — Foundational Architecture",
  description: "Enterprise goal intelligence and operational cadence system.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`h-full antialiased ${newsreader.variable} ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text-main)] font-sans">
        <AppSessionProvider session={session}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
