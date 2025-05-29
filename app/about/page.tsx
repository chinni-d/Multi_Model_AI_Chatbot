"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { SparklesText } from "@/components/sparkles-text";

const revealVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutPage() {
  return (
    <div className="container py-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            <SparklesText text=" About AI Chatbot" />
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Learn more about our AI assistant and how it can help you.
          </p>
        </div>

        {/* What is AI Chatbot */}
        <motion.div
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-transparent border border-border shadow-none">
            <CardHeader>
              <CardTitle>What is AI Chatbot?</CardTitle>
              <CardDescription>
                An overview of our intelligent assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                AI Chatbot is an advanced artificial intelligence assistant
                designed to provide helpful, accurate, and friendly responses to
                your questions and requests. Built using cutting-edge natural
                language processing technology, our chatbot understands context
                and can engage in meaningful conversations.
              </p>
              <p>
                Whether you need information, assistance with tasks, or just
                someone to chat with, AI Chatbot is here to help 24/7. Our
                system continuously learns and improves from interactions to
                provide better responses over time.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-transparent border border-border shadow-none">
            <CardHeader>
              <CardTitle>Features & Capabilities</CardTitle>
              <CardDescription>
                What our AI assistant can do for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2">
                <li>Answer questions on a wide range of topics</li>
                <li>Provide explanations and clarifications</li>
                <li>Offer suggestions and recommendations</li>
                <li>Engage in natural, flowing conversations</li>
                <li>Available anytime, with instant responses</li>
                <li>Maintains context throughout conversations</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Our Technology */}
        <motion.div
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-transparent border border-border shadow-none">
            <CardHeader>
              <CardTitle>Our Technology</CardTitle>
              <CardDescription>The science behind AI Chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
               Our AI Chatbot is a multi-modal system powered by advanced models like GPT-3.5 and DeepSeek, integrated through the OpenRouter API. It understands context and generates human-like responses in real time, delivering natural and engaging conversations.
              </p>
              <p>
              The chatbot supports flexible interactions across various input types and is optimized for speed, accuracy, and reliability. Designed with user needs in mind, it ensures a seamless and responsive experience. Continuous updates are made to enhance performance and maintain a safe, user-friendly environment.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-transparent border border-border shadow-none">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
              <CardDescription>
                Technologies used in this project
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-muted-foreground">
              <div>
                <strong>Frontend:</strong> React, Tailwind CSS, ShadCN UI
              </div>
              <div>
                <strong>Backend:</strong> OpenAI API (via SDK), Next.js API
                Routes
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Developer Profile */}
        <motion.div
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-transparent border border-border shadow-none">
            <CardHeader>
              <CardTitle>Meet the Developer</CardTitle>
              <CardDescription>The creator behind the chatbot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                  src="/img1.png"
                  alt="Developer"
                  className="w-32 h-32 rounded-full object-cover shadow-md"
                />
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <p className="text-muted-foreground">
                    Hi! I'm Manikanta Darapureddy, the developer behind this AI
                    Chatbot interface. I'm passionate about creating intelligent
                    applications that are useful, user-friendly, and impactful.
                  </p>
                  <p className="text-muted-foreground">
                    With experience in web development, AI and machine learning,
                    I enjoy building smart systems that make life easier. This
                    chatbot project reflects my commitment to combining
                    cutting-edge tech with seamless design.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button variant="default" asChild className="gap-2">
                        <a
                          href="https://www.dmanikanta.me"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Portfolio <ExternalLink size={16} />
                        </a>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button variant="outline" asChild className="gap-2">
                        <a
                          href="https://github.com/chinni-d"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub <ExternalLink size={16} />
                        </a>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Prompt Section */}
        <motion.div
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="text-center bg-transparent border border-border shadow-none">
            <CardHeader>
              <CardTitle>Have any questions?</CardTitle>
              <CardDescription>
                Start a conversation with our chatbot for more help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="/chat"
                className="inline-block rounded-md bg-primary px-6 py-2 text-base font-medium text-white shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Chat Now
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
