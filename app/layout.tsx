import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { getServerSession } from "next-auth";
import { AppSessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { authOptions } from "@/lib/auth";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Syncora — Enterprise Goal Alignment Platform",
  description: "An enterprise-grade platform for goal planning, quarterly reviews, approvals, audit visibility, and performance governance.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`h-full antialiased ${instrumentSerif.variable} ${inter.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-(--color-bg) text-(--color-text-main) font-sans selection:bg-(--color-accent-primary) selection:text-white">
        <AppSessionProvider session={session}>
          <ThemeProvider>
            <SmoothScrollProvider>
              {children}
            </SmoothScrollProvider>
          </ThemeProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}
