"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MorphingText } from "@/components/morphing-text";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

// Mobile detection hook (SSR safe)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const texts = ["Welcome", "to", "AI", "Chatbot"];

export default function Home() {
  const isMobile = useIsMobile();
  // Hero section ref and inView detection
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

  // Cards container ref and inView detection
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: isMobile ? 8 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: isMobile ? 0.25 : 0.6, ease: "easeOut" },
    },
  };

  // Staggered container for cards
  const cardsContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.25,
      },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: isMobile ? 8 : 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * (isMobile ? 0.05 : 0.2),
        duration: isMobile ? 0.18 : 0.5,
        ease: "easeOut"
      },
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center md:ml-64"
    >
      {/* Hero section with scroll reveal */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center"
            initial={{ opacity: 0, y: isMobile ? 8 : 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 8 : 40 }}
            transition={{ duration: isMobile ? 0.18 : 0.7, ease: "easeOut" }}
          >
            <div className="space-y-2">
              <motion.h2
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, y: isMobile ? 6 : 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 6 : 30 }}
                transition={{ duration: isMobile ? 0.16 : 0.7, delay: 0.2 }}
              >
                <MorphingText texts={texts} />
              </motion.h2>
              <motion.p
                className="mx-auto max-w-[700px] text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: isMobile ? 6 : 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 6 : 30 }}
                transition={{ duration: isMobile ? 0.16 : 0.7, delay: 0.4 }}
              >
                Experience intelligent conversations with our advanced AI
                assistant. Get answers, ideas, and help with just a message.
              </motion.p>
            </div>
            <motion.div
              className="space-x-4"
              initial={{ opacity: 0, y: isMobile ? 6 : 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 6 : 30 }}
              transition={{ duration: isMobile ? 0.16 : 0.7, delay: 0.6 }}
            >
              <Link href="/chat">
                <Button className="group">
                  Start Chat
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features section with scroll reveal */}
      <motion.section
        className="w-full py-6 md:py-12 lg:py-16"
        ref={cardsRef}
        initial="hidden"
        animate={cardsInView ? "visible" : "hidden"}
        variants={cardsContainer}
      >
        <div className="container px-4 md:px-6">
          <div
            className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-3"
          >
            {[
              {
                title: "Instant Responses",
                desc: "Get immediate answers to your questions with our chatbot.",
              },
              {
                title: "24/7 Availability",
                desc: "Our chatbot is always available to assist you, day or night.",
              },
              {
                title: "Smart Learning",
                desc: "Our AI continuously improves to provide better responses over time.",
              },
            ].map(({ title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                animate={cardsInView ? "visible" : "hidden"}
                variants={cardVariant}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col items-start justify-start space-y-4 rounded-lg border bg-background p-6 shadow-sm"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
