import React from "react";
import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster"
import BackgroundContent from '@/components/BackgroundContent'
import "./globals.css";
import LoadingComponent from "@/components/LoadingComponent";
import Footer from "@/components/footer"

export const metadata = {
  title: "Ultra Band - Professional Live Music",
  description:
    "Professional live music band for weddings, corporate events, and special occasions. Book Ultra Band for unforgettable performances.",
  generator: "Oramzy",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<LoadingComponent />}>
          <BackgroundContent />
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </Suspense>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
