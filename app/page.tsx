"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MorphingText } from "@/components/morphing-text";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const texts = ["Welcome", "to", "AI", "Chatbot"];

export default function Home() {
  // Hero section ref and inView detection
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });

  // Cards container ref and inView detection
  const cardsRef = useRef(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="flex flex-col items-center md:ml-64">
      {/* Hero section with scroll reveal */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeInUp}
        className="w-full py-12 md:py-24 lg:py-32"
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                <MorphingText texts={texts} />
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Experience intelligent conversations with our advanced AI
                assistant. Get answers, ideas, and help with just a message.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/chat">
                <Button className="group">
                  Start Chat
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features section with scroll reveal */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div
            ref={cardsRef}
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
      </section>
    </div>
  );
}
