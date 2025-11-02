import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Chatbot | About", 
  description: "Learn about our AI chatbot, its features, technology stack, and meet the developer behind this intelligent assistant.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}