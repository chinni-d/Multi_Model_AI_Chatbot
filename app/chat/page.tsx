"use client";

import React, { useState, useRef, useEffect } from "react";

// Feature options (keep at top level)
const FEATURE_OPTIONS = [
  { label: "GPT-4.1", value: "gpt-4.1" },
  { label: "GPT-4o-mini", value: "gpt-4o-mini" },
  { label: "Gemini-2.0 Pro", value: "gemini-2.0-pro" },
  { label: "DeepSeek V3", value: "deepseek-r1" },
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

// Function to format message content with proper styling
const formatMessageContent = (content: string) => {
  // First, handle code blocks to prevent them from being processed
  const codeBlockPlaceholders: string[] = [];
  let processedContent = content.replace(/```([\s\S]*?)```/g, (match, code) => {
    const placeholder = `__CODEBLOCK_${codeBlockPlaceholders.length}__`;
    codeBlockPlaceholders.push(`<pre style="background-color: #f3f4f6; color: #1f2937; padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0 4px 0; border: 1px solid #d1d5db; width: 100%; max-width: 100%; font-size: 13px; line-height: 1.4;" class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg overflow-x-auto my-2 border w-full max-w-full text-sm"><code style="font-family: 'Courier New', Consolas, Monaco, monospace; font-size: 13px; white-space: pre-wrap; word-break: break-word; color: #1f2937; display: block;" class="font-mono text-sm whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">${code.trim()}</code></pre>`);
    return placeholder;
  });

  // Handle inline code
  const inlineCodePlaceholders: string[] = [];
  processedContent = processedContent.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `__INLINECODE_${inlineCodePlaceholders.length}__`;
    inlineCodePlaceholders.push(`<code style="background-color: #f3f4f6; color: #1f2937; padding: 4px 8px; border-radius: 4px; font-family: 'Courier New', Consolas, Monaco, monospace; font-size: 14px; word-break: break-word; border: 1px solid #d1d5db;" class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono break-words text-gray-800 dark:text-gray-200">${code}</code>`);
    return placeholder;
  });

  // Apply bold and italic formatting to the entire content first
  processedContent = processedContent
    .replace(/\*\*([^\*]+)\*\*/g, '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>')
    .replace(/\*([^\*]+)\*/g, '<em class="italic">$1</em>');

  // Split into lines for processing
  const lines = processedContent.split('\n');
  const formattedLines: string[] = [];
  let inList = false;
  let listType = '';
  let inTable = false;
  let tableHeaders: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (!line) {
      if (inList) {
        formattedLines.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      formattedLines.push('<br>');
      continue;
    }

    // Headers
    if (line.startsWith('###')) {
      if (inList) {
        formattedLines.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      line = line.replace(/^###\s*(.+)$/, '<h3 class="text-lg font-semibold mt-2 mb-1 text-blue-600 dark:text-blue-400">$1</h3>');
    } else if (line.startsWith('##')) {
      if (inList) {
        formattedLines.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      line = line.replace(/^##\s*(.+)$/, '<h2 class="text-xl font-bold mt-4 mb-2 text-blue-700 dark:text-blue-300">$1</h2>');
    } else if (line.startsWith('#')) {
      if (inList) {
        formattedLines.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      line = line.replace(/^#\s*(.+)$/, '<h1 class="text-2xl font-bold mt-4 mb-2 text-blue-800 dark:text-blue-200">$1</h1>');
    }
    // Table detection
    else if (line.includes('|') && (line.match(/\|/g) || []).length >= 2) {
      // Check if this is a table header
      const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
      const isTableHeader = nextLine.match(/^\|?[\s\-\|:]+\|?$/);
      
      if (!inTable && isTableHeader) {
        // Start of table
        if (inList) {
          formattedLines.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        inTable = true;
        tableHeaders = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        formattedLines.push('<div class="overflow-x-auto my-4">');
        formattedLines.push('<table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600">');
        formattedLines.push('<thead class="bg-gray-50 dark:bg-gray-700">');
        formattedLines.push('<tr>');
        tableHeaders.forEach(header => {
          formattedLines.push(`<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-medium text-gray-900 dark:text-gray-100">${header}</th>`);
        });
        formattedLines.push('</tr>');
        formattedLines.push('</thead>');
        formattedLines.push('<tbody>');
        // Skip the separator line
        i++;
        continue;
      } else if (inTable && line.includes('|')) {
        // Table row
        const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (cells.length > 0) {
          formattedLines.push('<tr class="even:bg-gray-50 dark:even:bg-gray-800">');
          cells.forEach(cell => {
            formattedLines.push(`<td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100">${cell}</td>`);
          });
          formattedLines.push('</tr>');
        }
        continue;
      } else if (inTable && !line.includes('|')) {
        // End of table
        formattedLines.push('</tbody>');
        formattedLines.push('</table>');
        formattedLines.push('</div>');
        inTable = false;
        tableHeaders = [];
        // Process this line normally
      }
    }
    // Bullet points
    else if (line.match(/^[\*\-\+•]\s+/)) {
      if (!inList || listType !== 'ul') {
        if (inList) formattedLines.push(`</${listType}>`);
        formattedLines.push('<ul class="list-none space-y-1 my-2">');
        inList = true;
        listType = 'ul';
      }
      line = line.replace(/^[\*\-\+•]\s+(.+)$/, '<li class="flex items-start mb-1"><span class="text-blue-500 mr-2 mt-0.5">•</span><span>$1</span></li>');
    }
    // Numbered lists
    else if (line.match(/^\d+\.\s+/)) {
      if (!inList || listType !== 'ol') {
        if (inList) formattedLines.push(`</${listType}>`);
        formattedLines.push('<ol class="list-decimal list-inside space-y-1 my-2 ml-4">');
        inList = true;
        listType = 'ol';
      }
      line = line.replace(/^\d+\.\s+(.+)$/, '<li class="mb-1">$1</li>');
    }
    // Regular paragraphs
    else {
      if (inList) {
        formattedLines.push(`</${listType}>`);
        inList = false;
        listType = '';
      }
      
      line = `<p class="mb-1">${line}</p>`;
    }

    formattedLines.push(line);
  }

  if (inList) {
    formattedLines.push(`</${listType}>`);
  }

  if (inTable) {
    formattedLines.push('</tbody>');
    formattedLines.push('</table>');
    formattedLines.push('</div>');
  }

  let result = formattedLines.join('\n');

  // Restore code blocks
  codeBlockPlaceholders.forEach((code, index) => {
    result = result.replace(`__CODEBLOCK_${index}__`, code);
  });

  // Restore inline code
  inlineCodePlaceholders.forEach((code, index) => {
    result = result.replace(`__INLINECODE_${index}__`, code);
  });

  return result;
};

export default function ChatPage() {
  const { user } = useUser();
  // Feature selection state (must be inside the component)
  const [feature, setFeature] = useState("gpt-4.1");
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
        feature === "gpt-4o-mini"
          ? "https://chatbot-ss-api-1.vercel.app/api/chat"
          : feature === "gemini-2.0-pro"
          ? "https://chatbot-ss-api-3.vercel.app/api/chat"
          : feature === "deepseek-r1"
          ? "https://chatbot-ss-api-4.vercel.app/api/chat"
          : "https://chatbot-ss-api-2.vercel.app/api/chat";

      // Build conversation history for the API
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: history,
        }),
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
          content: "Sorry, something went wrong. Please try again or select a different model.",
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
          
          <SignedIn>
            <h1 className="text-2xl font-bold">Chat with AI</h1>
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
                if (value) {
                  setFeature(value);
                  // Clear conversation history when model changes
                  setMessages([
                    {
                      id: "1",
                      content: "Hello! How can I help you today?",
                      role: "assistant",
                      timestamp: new Date(),
                    },
                  ]);
                }
              }}
            >
              <SelectTrigger className="w-[160px]">
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
                    "flex animate-fade-in items-start space-x-3 max-w-[95%] sm:max-w-[80%]",
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
                        "rounded-lg p-3 max-w-full overflow-hidden",
                        message.role === "user"
                          ? "bg-foreground text-background min-w-16"
                          : "bg-muted"
                      )}
                    >
                      <div className="text-sm sm:text-[15px] text-left sm:text-justify overflow-hidden break-words">
                        <div dangerouslySetInnerHTML={{ 
                          __html: formatMessageContent(message.content)
                        }} />
                      </div>
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
                <div className="mr-auto flex max-w-[95%] sm:max-w-[80%] animate-fade-in items-start space-x-3">
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
        <div className="flex flex-1 items-center justify-center min-h-[300px]">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
    </div>
  );
}
