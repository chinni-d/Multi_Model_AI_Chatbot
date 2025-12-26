"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Info, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
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
  const { user } = useUser();

  // Check if user is admin
  const isAdmin =
    user?.emailAddresses?.[0]?.emailAddress?.includes("admin") ||
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "super_admin";

  // Add admin link if user is admin
  const navigationItems = isAdmin
    ? [
        ...navItems.slice(0, 2),
        { name: "Admin", path: "/admin", icon: Shield },
        ...navItems.slice(2),
      ]
    : navItems;

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
              <Image
                src="/favicon.ico"
                alt="AI Chatbot logo"
                width={36}
                height={36}
                className="invert dark:invert-0"
              />
              <span className="font-bold">AI Chatbot</span>
            </Link>
          </div>
          <nav className="flex items-center justify-center gap-5">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative h-16 flex items-center px-1 group",
                  pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <span className="relative px-3 py-1.5 rounded-md text-sm font-bold transition-colors group-hover:bg-muted/50">
                  {pathname === item.path && (
                    <motion.span
                      className="absolute inset-0 bg-muted rounded-md -z-10"
                      layoutId="navbar-box"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.name}
                </span>
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
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
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
            "fixed top-0 left-0 z-40 h-full w-[60%] flex flex-col bg-background shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col gap-4 p-4 pb-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-primary/10 p-1">
                  <Image
                    src="/favicon.ico"
                    alt="Logo"
                    fill
                    className="object-contain invert dark:invert-0"
                  />
                </div>
                <span className="font-bold text-lg tracking-tight">Chatbot</span>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 py-2">
             <div className="mb-1 px-1 text-[10px] font-bold text-muted-foreground uppercase opacity-70">
              Menu
            </div>
            <div className="mb-2 h-px bg-border/50" />
            <nav className="flex flex-col gap-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn(
                      "h-[18px] w-[18px]",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-2 h-px bg-border/50" />
            
            <div className="flex flex-col gap-1 mt-2">
               <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
               </div>
               
               <div className="px-3 py-1">
                 <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm" className="h-8 text-xs px-4">
                      Sign In
                    </Button>
                  </SignInButton>
                 </SignedOut>

                 <SignedIn>
                    <div className="flex items-center gap-3">
                      <UserButton />
                      <span className="text-sm font-medium">
                        {user?.fullName || user?.username || "User"}
                      </span>
                    </div>
                 </SignedIn>
               </div>
            </div>
          </div>
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
            <Image
              src="/favicon.ico"
              alt="AI Chatbot logo"
              width={34}
              height={34}
              className="invert dark:invert-0"
            />
            <span className="text-lg font-bold">Chatbot</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
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
