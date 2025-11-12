"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChevronDown, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/bookings", label: "Bookings" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact Us" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState();
  const [isAdmin, setIsAdmin] = useState(false);

  const scrollToFaq = () => {
    const faqEl = document.getElementById("faq");
    if (faqEl) faqEl.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    const faqEl = document.getElementById("contact");
    if (faqEl) faqEl.scrollIntoView({ behavior: "smooth" });
  };

  // Handle clicks on FAQ in nav
  const handleNavClick = async (e, href) => {
    if (href === "#faq") {
      e.preventDefault();

      // If already on the current page
      if (pathname === "/") {
        scrollToFaq();
      } else {
        // Delay a bit for component mount
        setTimeout(scrollToFaq, 400);
      }
    }
  };
  const handleContactClick = async (e, href) => {
    if (href === "#contact") {
      e.preventDefault();

      // If already on the current page
      if (pathname === "/") {
        scrollToContact();
      } else {
        // Delay a bit for component mount
        setTimeout(scrollToContact, 400);
      }
    }
  };

  useEffect(() => {
    setMounted(true);

    // Auto dark mode based on time+
    const hour = new Date().getHours();
    if (hour >= 18 || hour <= 6) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [setTheme]);

  useEffect(() => {
    // Check admin session
    const checkAdminSession = async () => {
      try {
        const response = await fetch("/api/admin/session");
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.authenticated);
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
        setIsAdmin(false);
      }
    };

    checkAdminSession();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (!mounted) return null;

  if (loading) {
    <div className="border w-2 h-2 text-primary animate-spin"></div>;
  }

  return (
    <nav className="sticky top-0 z-50 h-24 w-full border-b supports-[backdrop-filter]:bg-background/60 border-border/40 backdrop-blur items-center justify-center flex">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 animate-pulse">
            <Image
              alt="Ulta Band"
              loading="lazy"
              height={80}
              width={80}
              src={"/logo.png"}
            />
              <div>
                  <span className=" text-xs sm:text-xl uppercase text-white font-light">UltraBand Entertainment</span>
              </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  handleNavClick(e, item.href);
                  handleContactClick(e, item.href)

                }}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary flex items-center",
                  pathname.startsWith("/admin")
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
            )}

            <DropdownMenu open={open} modal={false}>
              <DropdownMenuTrigger
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
              >
                <div className="text-sm flex items-center font-medium text-muted-foreground hover:text-primary">
                  Services <ChevronDown className="ml-1 h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className="w-56"
              >
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : services.length > 0 ? (
                  services.map((service) => (
                    <DropdownMenuItem
                      className="border-b border-gray-500 rounded-sm p-2 cursor-pointer text-muted-foreground hover:text-primary"
                      key={service.id}
                      asChild
                    >
                      <Link href={`/services/${service.slug}`}>
                        {service.title}
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="py-2 text-sm text-muted-foreground text-center">
                    No services available
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 px-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button> */}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 px-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button> */}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 px-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-10 ps-5">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setIsOpen(false);
                        handleNavClick(e, item.href);
                        handleContactClick(e, item.href)
                      }}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === item.href
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                    {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary flex items-center",
                        pathname.startsWith("/admin")
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="services">
                      <AccordionTrigger className="text-lg font-medium text-muted-foreground hover:text-primary mt-[-1rem]">
                        Services
                      </AccordionTrigger>
                      <AccordionContent>
                        {loading ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : services.length > 0 ? (
                          <div className="flex flex-col px-2">
                            {services.map((service) => (
                              <Link
                                key={service.id}
                                href={`/services/${service.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="text-sm text-muted-foreground hover:text-primary border-b border-gray-500 rounded-sm p-1"
                              >
                                {service.title}
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="py-2 text-sm text-muted-foreground text-center">
                            No services available
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
