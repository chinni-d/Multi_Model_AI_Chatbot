"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMessageTracking } from "@/hooks/use-message-tracking";

// Feature options (keep at top level)
const FEATURE_OPTIONS = [
  { label: "GPT-4.1", value: "gpt-4.1" },
  { label: "GPT-4o-mini", value: "gpt-4o-mini" },
  { label: "Gemini-2.0 Pro", value: "gemini-2.0-pro" },
  { label: "DeepSeek V3", value: "deepseek-r1" },
];
import { Send, Bot, Copy, Check } from "lucide-react";
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

// Copy button component
const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors z-10"
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      )}
    </button>
  );
};

// Message content component with copy functionality
const MessageContent = ({ content }: { content: string }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: formatMessageContent(content) }} />
  );
};

// Function to format message content with proper styling
const formatMessageContent = (content: string) => {
  // Handle undefined, null, or empty content
  if (!content || typeof content !== 'string') {
    return '<p class="text-gray-500">No content available</p>';
  }

  // First, handle code blocks to prevent them from being processed
  const codeBlockPlaceholders: string[] = [];
  let processedContent = content.replace(/```([\s\S]*?)```/g, (match: string, code: string) => {
    const placeholder = `__CODEBLOCK_${codeBlockPlaceholders.length}__`;
    
    // Split the code to separate language from actual code
    const lines = code.split('\n');
    const language = lines[0].trim(); // First line is usually the language
    const actualCode = lines.slice(1).join('\n').trim(); // Rest is the actual code
    
    // If the first line looks like a language identifier, use actualCode, otherwise use the full code
    const isLanguageIdentifier = language.length < 20 && /^[a-zA-Z0-9+#-]*$/.test(language);
    const codeToUse = isLanguageIdentifier && actualCode ? actualCode : code.trim();
    
    // Simple escaping for HTML attributes - only escape quotes and backslashes
    const escapedCode = codeToUse
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    
    codeBlockPlaceholders.push(`<div style="position: relative; border-radius: 8px; margin: 8px 0 4px 0; border: 1px solid #d1d5db; width: 100%; max-width: 100%;" class="bg-white dark:bg-white rounded-lg my-2 border dark:border-gray-300 w-full max-w-full relative group"><button data-code="${escapedCode}" onclick="window.copyCodeBlock(this)" class="absolute top-2 right-2 p-1.5 rounded-md transition-colors z-10 copy-btn" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; min-width: 32px; min-height: 32px; background-color: transparent;" title="Copy code"><svg class="h-4 w-4" style="width: 16px; height: 16px; flex-shrink: 0; color: #6b7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button><pre style="padding: 12px; overflow-x: auto; font-size: 13px; line-height: 1.4; margin: 0;" class="p-3 overflow-x-auto text-sm m-0"><code style="font-family: 'Courier New', Consolas, Monaco, monospace; font-size: 13px; white-space: pre-wrap; word-break: break-word; display: block;" class="font-mono text-sm whitespace-pre-wrap break-words text-black dark:text-black">${codeToUse}</code></pre></div>`);
    return placeholder;
  });

  // Handle inline code
  const inlineCodePlaceholders: string[] = [];
  processedContent = processedContent.replace(/`([^`]+)`/g, (match: string, code: string) => {
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
      const isTableHeader = nextLine.match(/^\|?[\s\-:]+(\|[\s\-:]+)*\|?$/);
      
      if (!inTable && isTableHeader) {
        // Start of table
        if (inList) {
          formattedLines.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        inTable = true;
        tableHeaders = line.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
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
        const cells = line.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell);
        if (cells.length > 0) {
          formattedLines.push('<tr class="even:bg-gray-50 dark:even:bg-gray-800">');
          cells.forEach((cell: string) => {
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
    // Handle standalone separator lines (---)
    else if (line.match(/^-{3,}$/)) {
      formattedLines.push('<hr class="my-4 border-t border-gray-300 dark:border-gray-600" />');
      continue;
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
        formattedLines.push('<ol class="space-y-1 my-2 ml-4" style="list-style: none;">');
        inList = true;
        listType = 'ol';
      }
      line = line.replace(/^(\d+)\.\s+(.+)$/, '<li class="mb-1">$1. $2</li>');
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
  const { trackMessage } = useMessageTracking();
  // Feature selection state (must be inside the component)
  const [feature, setFeature] = useState("gpt-4.1");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize the global copy function early
  useEffect(() => {
    // Add global copy function to window with fallback for mobile/older browsers
    (window as any).copyCodeBlock = async (button: HTMLElement) => {
      try {
        const code = button.getAttribute('data-code');
        if (!code) return;
        
        // Unescape the code (simpler unescaping since we use simpler escaping)
        const unescapedCode = code
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/\\\\/g, '\\');
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(unescapedCode);
        } else {
          // Fallback method for older browsers/mobile
          const textArea = document.createElement('textarea');
          textArea.value = unescapedCode;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
          } catch (err) {
            console.error('Fallback copy failed:', err);
            // If all else fails, show an alert with the code
            alert('Copy failed. Here is the code:\n\n' + unescapedCode);
            return;
          } finally {
            document.body.removeChild(textArea);
          }
        }
        
        // Show success feedback
        const originalIcon = button.innerHTML;
        button.innerHTML = `<svg class="h-4 w-4" style="width: 16px; height: 16px; flex-shrink: 0; color: #10b981;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
        button.title = "Copied!";
        setTimeout(() => {
          button.innerHTML = originalIcon;
          button.title = "Copy code";
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        // Show error feedback
        const originalIcon = button.innerHTML;
        button.innerHTML = `<svg class="h-4 w-4" style="width: 16px; height: 16px; flex-shrink: 0; color: #ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
        button.title = "Copy failed";
        setTimeout(() => {
          button.innerHTML = originalIcon;
          button.title = "Copy code";
        }, 2000);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (!input && textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: trimmedInput,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Track user request
    try {
      await trackMessage('request');
    } catch (error) {
      console.error('Failed to track request:', error);
    }

    // Reset textarea height to original single line using ref
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }

    const lowerInput = trimmedInput.toLowerCase();

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
      
      // Track assistant response
      try {
        await trackMessage('response');
      } catch (error) {
        console.error('Failed to track response:', error);
      }
      
      return;
    }

    try {
      // Get API URL from environment variables based on selected feature
      const getApiUrl = (selectedFeature: string): string => {
        switch (selectedFeature) {
          case "gpt-4.1":
            return process.env.NEXT_PUBLIC_GPT_4_1_API_URL || "";
          case "gpt-4o-mini":
            return process.env.NEXT_PUBLIC_GPT_4O_MINI_API_URL || "";
          case "gemini-2.0-pro":
            return process.env.NEXT_PUBLIC_GEMINI_2_PRO_API_URL || "";
          case "deepseek-r1":
            return process.env.NEXT_PUBLIC_DEEPSEEK_R1_API_URL || "";
          default:
            return process.env.NEXT_PUBLIC_DEFAULT_API_URL || "";
        }
      };

      const apiUrl = getApiUrl(feature);
      
      // Validate that API URL is available
      if (!apiUrl) {
        throw new Error(`API URL not configured for model: ${feature}`);
      }

      // Build conversation history for the API
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedInput,
          history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if response has the expected data
      if (!data || !data.response) {
        throw new Error("Invalid response from API");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "Sorry, I couldn't generate a response.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Track assistant response
      try {
        await trackMessage('response');
      } catch (error) {
        console.error('Failed to track response:', error);
      }
    } catch (error) {
      console.error("API error:", error);
      const modelName = FEATURE_OPTIONS.find(opt => opt.value === feature)?.label || feature;
      let errorMessage = "Unknown error occurred";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: `Sorry, there was an issue with ${modelName}: ${errorMessage}. Please try again or select a different model.`,
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
                  setMessages([]);
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
            className="rounded-lg p-4 light-scrollbar flex-1 overflow-auto"
            style={{ backgroundColor: "transparent" }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome to AI Chatbot</h2>
                  <p className="text-muted-foreground text-lg">Start a conversation!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex animate-fade-in items-start space-x-3",
                    message.role === "user"
                      ? "ml-auto justify-end max-w-[95%] sm:max-w-[80%]"
                      : "mr-auto justify-start w-full"
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
                          ? " min-w-16"
                          : ""
                      )}
                    >
                      <div className="text-sm sm:text-[15px] text-left sm:text-justify overflow-hidden break-words">
                        <MessageContent content={message.content} />
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
            )}
          </div>
          <Card className="mt-4 w-full">
            <form onSubmit={handleSubmit} className="flex items-end p-2 gap-2">
              <textarea
                ref={textareaRef}
                placeholder="🧠 Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  // Check if it's a mobile device
                  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
                  
                  // Only prevent Enter and send message on desktop, allow new lines on mobile
                  if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-ring  disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                rows={1}
                style={{
                  height: '40px',
                  maxHeight: '120px',
                  fontSize: '16px' // Prevents zoom on iOS Safari
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = '40px';
                  const scrollHeight = target.scrollHeight;
                  if (scrollHeight > 40) {
                    target.style.height = Math.min(scrollHeight, 120) + 'px';
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0"
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
