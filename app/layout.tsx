"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "MoneyWise",
  description: "Your personal finance tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SpeedInsights/>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnimatePresence mode="wait">
            <main key={pathname}>{children}</main>
          </AnimatePresence>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
