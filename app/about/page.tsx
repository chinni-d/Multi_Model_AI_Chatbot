import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            About AI Chatbot
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Learn more about our AI assistant and how it can help you.
          </p>
        </div>

        <Card>
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
              someone to chat with, AI Chatbot is here to help 24/7. Our system
              continuously learns and improves from interactions to provide
              better responses over time.
            </p>
          </CardContent>
        </Card>

        <Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Our Technology</CardTitle>
            <CardDescription>The science behind AI Chatbot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              AI Chatbot is powered by advanced large language models that have
              been trained on diverse datasets to understand and generate
              human-like text. Our system uses sophisticated algorithms to
              process your input, understand the context, and generate relevant
              responses.
            </p>
            <p>
              We continuously update and improve our models to enhance accuracy,
              relevance, and safety. Our commitment to responsible AI means we
              prioritize providing helpful information while avoiding harmful or
              misleading content.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
