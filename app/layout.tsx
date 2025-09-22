import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

export const metadata: Metadata = {
  title: "Ultra Band - Professional Live Music",
  description:
    "Professional live music band for weddings, corporate events, and special occasions. Book Ultra Band for unforgettable performances.",
  generator: "Oramzy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
            <main className="min-h-screen">{children}</main>
          </Suspense>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
