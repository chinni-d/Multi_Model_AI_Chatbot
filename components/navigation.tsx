"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();

  // Close mobile menu when path changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, isMobile]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Chat", path: "/chat" },
    { name: "About", path: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo (left on desktop, centered on mobile) */}
        <div
          className={cn(
            "flex items-center",
            isMobile ? "absolute left-1/2 -translate-x-1/2" : ""
          )}
        >
          <Link href="/" className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="font-bold">AI Chatbot</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="z-20"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        )}

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="mx-auto flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* Theme toggle (right side) */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>

        {/* Mobile navigation overlay */}
        {isMobile && (
          <div
            className={cn(
              "fixed inset-0 z-10 transform bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out dark:bg-background/95",
              isOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex h-full w-full flex-col pt-20 md:w-1/2 ">
              <nav className="flex flex-col space-y-6 px-6 bg-white dark:bg-[#020817]">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname === item.path
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
