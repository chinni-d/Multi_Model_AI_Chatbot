"use client";

import React, { useState, useRef, useEffect } from "react";

// Feature options (keep at top level)
const FEATURE_OPTIONS = [
  { label: "Basic", value: "basic" },
  { label: "Pro", value: "pro" },
];
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useUser, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

// Message type definition
type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

export default function ChatPage() {
  const { user } = useUser();
  // Feature selection state (must be inside the component)
  const [feature, setFeature] = useState("basic");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const lowerInput = input.toLowerCase();

    const identityKeywords = [
      "who",
      "person",
      "name",
      "developer",
      "creator",
      "made",
      "built",
      "created",
      "developed",
      "founder",
      "engineer",
    ];
    const subjectKeywords = [
      "you",
      "this",
      "chatbot",
      "ai",
      "assistant",
      "bot",
    ];

    const matchesIdentity = identityKeywords.some((word) =>
      lowerInput.includes(word)
    );
    const matchesSubject = subjectKeywords.some((word) =>
      lowerInput.includes(word)
    );

    if (matchesIdentity && matchesSubject) {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `
I was developed by Manikanta Darapureddy. 

👋 Let me tell you a bit more about him:

💡 Manikanta is passionate about creating intelligent applications that are useful, user-friendly, and impactful.

🌐 With expertise in web development, AI, and machine learning, he enjoys building smart systems that make life easier.

🤖 This chatbot project is a reflection of his commitment to combining cutting-edge technology with seamless design.

✨ You can explore his work and portfolio here: https://dmanikanta.site
`.trim(),
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl =
        feature === "pro"
          ? "https://chatbot-ss-api-2.vercel.app/api/chat"
          : "https://chatbot-ss-api-1.vercel.app/api/chat";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("API error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Something went wrong. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] max-w-5xl flex-col px-4 py-6">
      <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">Chat with AI</h1>
          <SignedIn>
            <p className="text-sm text-muted-foreground">
              Select a model to start chatting.
            </p>
          </SignedIn>
        </div>
        <SignedIn>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-muted-foreground">Model:</p>
            <Select
              value={feature}
              onValueChange={(value) => {
                if (value) setFeature(value);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {FEATURE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SignedIn>
      </div>

      {/* Show only when logged in */}
      <SignedIn>
        <div className="flex flex-1 flex-col">
          <div
            ref={chatContainerRef}
            className="rounded-lg p-4 custom-scrollbar-hide flex-1"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-fade-in items-start space-x-3 max-w-[80%]",
                    message.role === "user"
                      ? "ml-auto justify-end"
                      : "mr-auto justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "flex flex-col gap-1",
                      message.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg p-3",
                        message.role === "user"
                          ? "bg-foreground text-background min-w-16"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm sm:text-[15px] whitespace-pre-line text-left sm:text-justify">
                        {message.content}
                      </p>
                    </div>
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {message.role === "user" && user && (
                    <Avatar className="h-8 w-8 shrink-0 border">
                      <AvatarImage src={user.imageUrl} alt="User avatar" />
                      <AvatarFallback>
                        <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium text-muted-foreground">
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </div>
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="mr-auto flex max-w-[80%] animate-fade-in items-start space-x-3">
                  <Avatar className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </Avatar>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="flex items-center space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <Card className="mt-4 w-full">
            <form onSubmit={handleSubmit} className="flex items-center p-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="ml-2"
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </SignedIn>

      {/* Show only when logged out */}
      <SignedOut>
        <div className="flex justify-center items-center h-full">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
    </div>
  );
}
