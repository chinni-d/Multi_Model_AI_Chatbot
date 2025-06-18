const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm text-muted-foreground md:text-left">
          <p>© {new Date().getFullYear()} AI Chatbot. All rights reserved.</p>
        </div>
        <div className="text-center text-sm text-muted-foreground md:text-right">
          <p>Built with 💛 using Next.js and AI technologies.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
