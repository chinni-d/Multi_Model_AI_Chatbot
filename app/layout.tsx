import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AnimatedGridPattern } from "@/components/animated-grid-pattern";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Chatbot",
  description: "A responsive AI chatbot interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className, "overflow-x-hidden")}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative min-h-screen flex flex-col">
              {/* Background Pattern */}
             <div className="fixed inset-0 z-0">
  <AnimatedGridPattern
    numSquares={30}
    maxOpacity={0.1}
    duration={3}
    repeatDelay={1}
    className={cn(
      "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
      "w-full h-full skew-y-6"
    )}
  />
</div>

              {/* Foreground content */}
              <div className="relative z-10 flex flex-col min-h-screen">
                <Navigation />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
