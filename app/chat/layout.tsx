import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chatbot | Chat",
  description: "Chat with our AI assistant. Select from multiple AI models including GPT-4.1, GPT-4o-mini, Gemini-2.0 Pro, and DeepSeek V3.",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}