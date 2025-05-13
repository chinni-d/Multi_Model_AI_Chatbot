import Link from "next/link"
import { MessageSquare } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">AI Chatbot</span>
        </div>
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <Link href="/chat" className="hover:text-primary">
              Chat
            </Link>
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Chatbot. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
