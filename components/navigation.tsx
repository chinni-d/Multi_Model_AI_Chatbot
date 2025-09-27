"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Info,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

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
      {/* Desktop Header */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-30 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto grid h-full max-w-7xl grid-cols-3 items-center px-6">
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="AI Chatbot logo" width={42} height={42} className="dark:brightness-0 dark:invert" />
              <span className="font-bold">AI Chatbot</span>
            </Link>
          </div>
          <nav className="flex items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative text-sm font-bold transition-colors hover:text-primary px-2 py-1 h-16 flex items-center",
                  pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.name}
                {pathname === item.path && (
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-end gap-4">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
        )}
        <aside
          className={cn(
            "fixed top-0 left-0 z-40 h-full w-1/2 max-w-xs flex flex-col bg-background border-r transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="AI Chatbot logo" width={34} height={34} className="dark:brightness-0 dark:invert" />
              <span className="font-bold">Chatbot</span>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
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
        <header className="fixed top-0 left-0 right-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.png" alt="AI Chatbot logo" width={34} height={34} className="dark:brightness-0 dark:invert" />
            <span className="text-lg font-bold">Chatbot</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
      </div>
    </>
  );
};

export default Navigation;
