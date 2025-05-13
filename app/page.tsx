import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to AI Chatbot
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Experience intelligent conversations with our advanced AI assistant. Get answers, ideas, and help with
                just a message.
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
      </section>

      {/* Features section */}
      <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-3">
            <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Instant Responses</h3>
                <p className="text-muted-foreground">
                  Get immediate answers to your questions with our AI-powered chatbot.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">24/7 Availability</h3>
                <p className="text-muted-foreground">Our chatbot is always available to assist you, day or night.</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4 rounded-lg border bg-background p-6 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Smart Learning</h3>
                <p className="text-muted-foreground">
                  Our AI continuously improves to provide better responses over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
