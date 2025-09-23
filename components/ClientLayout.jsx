"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import BackgroundContent from "@/components/BackgroundContent";
import Footer from "@/components/footer";
import LoadingComponent from "@/components/LoadingComponent";

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [contentVisible, setContentVisible] = useState(false); // for fade-in
  const pathname = usePathname();
  const isInitialMount = useRef(true);

  // Initial page load
  useEffect(() => {
    if (pathname === "/") {
      // homepage: fade out quickly
      const timer = setTimeout(() => {
        setFade(true);
        setTimeout(() => {
          setLoading(false);
          setContentVisible(true); // trigger fade-in
          isInitialMount.current = false;
        }, 500); // fade duration
      }, 500); // short visible time
      return () => clearTimeout(timer);
    } else {
      // other pages: custom 2s loader
      const timer = setTimeout(() => {
        setFade(true);
        setTimeout(() => {
          setLoading(false);
          setContentVisible(true); // trigger fade-in
          isInitialMount.current = false;
        }, 500);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Navigation loading (skip on homepage)
  useEffect(() => {
    if (loading || isInitialMount.current) return;
    if (pathname === "/") return; // disable nav loader for homepage

    setIsNavigating(true);
    setFade(false);
    setContentVisible(false); // hide content during navigation

    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        setIsNavigating(false);
        setContentVisible(true); // fade content back in
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname, loading]);

  if (loading || isNavigating) {
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
      <main
        className={`min-h-screen transition-opacity duration-700 ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
