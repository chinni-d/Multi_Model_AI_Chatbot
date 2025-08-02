"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Component,
  Move,
  Server,
  Router,
  Bot,
  Lock,
  Code,
  Orbit,
  Palette,
  Mail,
  Github,
  Database,
  Cpu,
  Globe,
  MessageSquare,
  Lightbulb,
  Zap,
  Clock,
  Shield,
  Star,
  Users,
  Target,
  Brain,
} from "lucide-react";
import { motion } from "framer-motion";
import { SparklesText } from "@/components/sparkles-text";

const revealVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutPage() {
  return (
    <div className="container py-4">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mt-6">
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
          <Card className="bg-transparent border border-border shadow-none text-muted-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                What is AI Chatbot?
              </CardTitle>
              <CardDescription>
                An overview of our intelligent assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 ">
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
          <Card className="bg-transparent border border-border shadow-none text-muted-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Features & Capabilities
              </CardTitle>
              <CardDescription>
                What our AI assistant can do for you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-4 h-4 text-blue-500" />
                    <span>Answer questions on a wide range of topics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-green-500" />
                    <span>Provide explanations and clarifications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Brain className="w-4 h-4 text-purple-500" />
                    <span>Offer suggestions and recommendations</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-orange-500" />
                    <span>Engage in natural, flowing conversations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-teal-500" />
                    <span>Available anytime, with instant responses</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>Maintains context throughout conversations</span>
                  </div>
                </div>
              </div>
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
          <Card className="bg-transparent border border-border shadow-none text-muted-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Our Technology
              </CardTitle>
              <CardDescription>The science behind AI Chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>
                Our AI Chatbot is a multi-modal system powered by advanced language models, integrated through a robust API. It understands context and generates human-like responses in real time, delivering natural and engaging conversations.
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
          <Card className="bg-transparent border border-border shadow-none text-muted-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Tech Stack
              </CardTitle>
              <CardDescription>
                Technologies used in this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Frontend</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Code size={14} /> Next.js
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Orbit size={14} /> React
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Code size={14} /> TypeScript
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Palette size={14} /> Tailwind CSS
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Component size={14} /> Shadcn UI
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 md:border-l md:pl-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Server className="w-4 h-4 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Backend & AI</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Database size={14} /> Python/Uvicorn
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Bot size={14} /> GPT-4.1
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Bot size={14} /> GPT-4o-mini
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Bot size={14} /> DeepSeek AI
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Bot size={14} /> Gemini AI
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 md:border-l md:pl-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Lock className="w-4 h-4 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold">Authentication</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Lock size={14} /> Clerk
                    </Badge>
                  </div>
                </div>
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
          <Card className="bg-transparent border border-border shadow-none text-muted-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Meet the Developer
              </CardTitle>
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
                    Hi! I'm <span className="font-semibold text-primary">Manikanta Darapureddy</span>, the developer behind this AI
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
                  
                      <Button variant="default" asChild className="gap-2">
                        <a
                          href="https://www.dmanikanta.me"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Portfolio 
                          <ExternalLink size={16} />
                          
                        </a>
                      </Button>
                 
                  
                      <Button variant="outline" asChild className="gap-2">
                        <a
                          href="https://github.com/chinni-d"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github size={16} />
                          GitHub 
                        </a>
                      </Button>

                      <Button variant="outline" asChild className="gap-2">
                        <a
                          href="mailto:darapureddymanikanta8@gmail.com"
                          rel="noopener noreferrer"
                        >
                          <Mail size={16} />
                         
                        </a>
                      </Button>
                 
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
              <CardTitle className="flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Have any questions?
              </CardTitle>
              <CardDescription>
                Start a conversation with our chatbot for more help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="gap-2 px-6 py-3">
                <a href="/chat">
                  <Zap size={16} />
                  Chat Now
                </a>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
