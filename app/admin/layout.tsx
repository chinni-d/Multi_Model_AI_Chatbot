import type React from "react";

export const metadata = {
  title: "AI Chatbot | Admin Panel",
  description: "Admin panel for managing users and viewing chatbot statistics.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
