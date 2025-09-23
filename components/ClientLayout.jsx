"use client";

import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import BackgroundContent from "@/components/BackgroundContent";
import Footer from "@/components/footer";
import LoadingComponent from "@/components/LoadingComponent";

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => setLoading(false), 500); // match fade duration
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className={`transition-all duration-500 flex justify-center items-center h-screen w-screen
          ${fade ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
      >
        <LoadingComponent />
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <BackgroundContent />
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </ThemeProvider>
  );
}
