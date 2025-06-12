"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  MessageSquare,
  Home,
  Info,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Chat", path: "/chat", icon: MessageCircle },
  { name: "About", path: "/about", icon: Info },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isMobile = useMobile();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  // Swipe-to-close effect
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        setIsOpen(false); // Swiped left
      }
    };

    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile]);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay for mobile nav */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-84 flex flex-col bg-background border-r transition-transform duration-300 ease-in-out",
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : ""
        )}
         style={isMobile ? { width: "50vw" } : undefined} 
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="font-bold">AI Chatbot</span>
            </Link>
            {/* ThemeToggle and Sign In button for desktop */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              <ThemeToggle />
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" asChild>
                    <button>Sign In</button>
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                 
                />
              </SignedIn>
            </div>
          </div>

          {isMobile && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="ml-auto"
            >
              <X className="h-8 w-8 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-md" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
                pathname === item.path
                  ? "bg-muted text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div className="ml-0 transition-all md:ml-64">
        {/* Top bar (for mobile) */}
        {isMobile && (
          <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <Button
              className="bg-black/10 hover:bg-black/20 w-8 h-8 dark:bg-white/10 dark:hover:bg-white/20"
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <span className="text-lg font-bold">AI Chatbot</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" asChild>
                    <button>Sign In</button>
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                 
                />
              </SignedIn>
            </div>
          </header>
        )}

        {/* Page content */}
        <main className={cn("p-4", isMobile ? "pt-20" : "")}>
          {/* Your content */}
        </main>
      </div>
    </>
  );
};

export default Navigation;
