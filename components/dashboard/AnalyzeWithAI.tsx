"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Info,
  RefreshCw,
  Send,
  PlusCircle,
  Copy,
  Check,
  Download,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Budget, Expense } from "@/lib/types";
import { cn } from "@/lib/utils";

// Update predefined prompts to be more question-focused
const predefinedPrompts = [
  "How much did I spend this month?",
  "What category am I spending the most on?",
  "Am I over budget on any categories?",
  "Compare my housing vs entertainment expenses",
  "What's my biggest unnecessary expense?",
];

// Updated examples of good questions to ask
const helpfulExamples = [
  "How much do I have left in my grocery budget?",
  "What percentage of my income goes to bills?",
  "Which day of the month did I spend the most?",
  "How does my spending this month compare to my budget?",
];

interface AnalyzeWithAIProps {
  budgets: Budget[];
  expenses: Expense[];
  initialRemainingRequests?: number; // Optional prop for initial count
}

// Define the key for session storage
const CHAT_HISTORY_KEY = "aiChatHistory";

interface Message {
  user: string;
  ai: string;
  error?: string;
}

// Custom markdown components for better styling
const MarkdownComponents = {
  h1: (props: any) => (
    <h1
      className="text-xl font-bold mb-3 mt-4 text-foreground border-b border-border/30 pb-1"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-lg font-semibold mb-2 mt-4 text-foreground border-b border-border/20 pb-1"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-base font-semibold mb-2 mt-3 text-foreground"
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="mb-2 text-foreground leading-relaxed" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mb-3 pl-5 list-disc space-y-1" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-3 pl-5 list-decimal space-y-1" {...props} />
  ),
  li: (props: any) => <li className="mb-1" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary/30 pl-4 italic my-2"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-4 rounded-md border border-border/30">
      <table className="min-w-full divide-y divide-border" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-muted/50" {...props} />,
  th: (props: any) => (
    <th
      className="px-3 py-2 text-left text-xs font-medium text-foreground uppercase tracking-wider"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="px-3 py-2 whitespace-nowrap text-sm" {...props} />
  ),
  tr: (props: any) => (
    <tr
      className="hover:bg-muted/30 border-b border-border/20 last:border-0"
      {...props}
    />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-primary" {...props} />
  ),
  code: (props: any) => {
    const { className } = props;
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <div className="bg-muted rounded-md p-3 my-3 overflow-x-auto">
        <code className="text-sm font-mono text-foreground" {...props} />
      </div>
    ) : (
      <code
        className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-foreground"
        {...props}
      />
    );
  },
  pre: (props: any) => <pre className="p-0 my-0 bg-transparent" {...props} />,
};

export function AnalyzeWithAI({
  budgets,
  expenses,
  initialRemainingRequests,
}: AnalyzeWithAIProps) {
  // Initialize state from sessionStorage or default to empty array
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const savedMessages = sessionStorage.getItem(CHAT_HISTORY_KEY);
      try {
        return savedMessages ? JSON.parse(savedMessages) : [];
      } catch (error) {
        console.error(
          "Failed to parse chat history from sessionStorage:",
          error
        );
        return [];
      }
    } else {
      // Return default value during SSR or if window is not available
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(
    initialRemainingRequests ?? null
  );
  const [showHelp, setShowHelp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(
    null
  );
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Prevent saving the initial empty array if it wasn't loaded
      if (messages.length > 0 || sessionStorage.getItem(CHAT_HISTORY_KEY)) {
        sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
      }
    }
  }, [messages]);

  // Focus the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Add a function to copy the message to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedMessageIndex(index);
        toast({
          title: "Copied to clipboard",
          description: "The message has been copied to your clipboard",
        });

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedMessageIndex(null);
        }, 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    );
  };

  // Function to download AI response as PDF with markdown rendering
  const downloadAsPdf = async (text: string, index: number) => {
    try {
      setDownloadingIndex(index);

      // Check if running in browser
      if (typeof window === "undefined" || typeof document === "undefined") {
        throw new Error("PDF generation is only available in the browser");
      }

      // Create a temporary container for rendering the markdown
      const container = document.createElement("div");
      container.style.padding = "20px";
      container.style.maxWidth = "800px";
      container.style.margin = "0 auto";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.color = "black";
      container.style.backgroundColor = "white";

      // Add title and date
      const header = document.createElement("div");
      const title = document.createElement("h1");
      title.textContent = "MoneyWise AI Analysis";
      title.style.borderBottom = "1px solid #ccc";
      title.style.paddingBottom = "10px";
      title.style.marginBottom = "5px";

      const dateElem = document.createElement("p");
      dateElem.textContent = `Generated: ${new Date().toLocaleDateString()}`;
      dateElem.style.color = "#666";
      dateElem.style.fontSize = "0.8rem";
      dateElem.style.marginTop = "0";

      header.appendChild(title);
      header.appendChild(dateElem);
      container.appendChild(header);

      // Create markdown container
      const markdownContainer = document.createElement("div");
      markdownContainer.className = "markdown-body";
      markdownContainer.style.marginTop = "20px";

      // Render markdown to HTML
      const tempRoot = document.createElement("div");
      document.body.appendChild(tempRoot);

      // We need to use React to render the markdown
      const ReactDOM = await import("react-dom/client");
      const root = ReactDOM.createRoot(tempRoot);

      // Use a promise to wait for rendering to complete
      await new Promise<void>((resolve) => {
        root.render(
          <div className="prose max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        );

        // Give it a moment to render
        setTimeout(() => {
          markdownContainer.innerHTML = tempRoot.innerHTML;
          resolve();
        }, 100);
      });

      // Clean up the temp element
      document.body.removeChild(tempRoot);
      container.appendChild(markdownContainer);

      // Dynamically import html2pdf
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default;

      // Use html2pdf to create PDF
      const opt = {
        margin: 10,
        filename: `moneywise-analysis-${new Date()
          .toLocaleDateString()
          .replace(/\//g, "-")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      } as const;

      await html2pdf().set(opt).from(container).save();

      toast({
        title: "PDF downloaded",
        description: "The analysis has been downloaded as a PDF",
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Download failed",
        description: "Could not generate the PDF file",
        variant: "destructive",
      });
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { user: userMessage, ai: "" }]);
    setInput("");
    setLoading(true);
    setTimeout(scrollToBottom, 0);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: userMessage,
          data: { budgets, expenses },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get AI response");
      }

      const { analysis, remainingRequests: updatedRemainingRequests } =
        await response.json();
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, ai: analysis } : msg
        )
      );

      if (typeof updatedRemainingRequests === "number") {
        setRemainingRequests(updatedRemainingRequests);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1
            ? { ...msg, ai: "", error: `Error: ${errorMessage}` }
            : msg
        )
      );
      toast({
        title: "Analysis Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 0);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem(CHAT_HISTORY_KEY);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px] bg-card rounded-lg shadow-md border border-border/30">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30 bg-muted/30">
        <h3 className="text-lg font-medium text-foreground">
          MoneyWise AI Assistant
        </h3>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowHelp(!showHelp)}
            variant="ghost"
            size="sm"
            className="p-2 h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
            title="Help"
          >
            <Info className="h-4 w-4" />
          </Button>
          {messages.length > 0 && (
            <Button
              onClick={clearChat}
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
              title="Clear chat"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {showHelp && (
        <div className="mx-4 mt-3 p-3 bg-primary/5 rounded-md text-sm border border-primary/20">
          <p className="font-medium mb-2 text-foreground">
            Ask me anything about your finances:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Ask specific questions about your spending or budgets</li>
            <li>Request comparisons between categories or time periods</li>
            <li>Get tailored recommendations based on your financial habits</li>
            <li>Analyze how well you&apos;re sticking to your budget</li>
          </ul>
          <p className="font-medium mt-2 mb-1 text-foreground">
            Try questions like:
          </p>
          <div className="grid grid-cols-1 gap-1">
            {helpfulExamples.map((example, i) => (
              <Button
                key={i}
                variant="link"
                onClick={() => handleSendMessage(example)}
                className="justify-start h-auto p-0 text-xs text-primary"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mx-4 mt-3 mb-1">
        {predefinedPrompts.map((prompt, index) => (
          <Button
            key={index}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            variant="outline"
            size="sm"
            className="text-xs rounded-full px-3 py-1 h-auto border-primary/20 hover:bg-primary/10 hover:text-primary hover:border-primary"
          >
            {prompt}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-3">
            <div className="bg-primary/10 rounded-full p-3">
              <PlusCircle className="h-8 w-8 text-primary/70" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground mb-1">
                Ask MoneyWise AI about your finances
              </p>
              <p className="text-sm">
                Select a prompt above or ask your own question
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-primary/90 text-primary-foreground p-3 rounded-2xl rounded-br-none shadow-sm text-sm break-words">
                {msg.user}
              </div>
            </div>

            {(msg.ai ||
              msg.error ||
              (loading && index === messages.length - 1)) && (
              <div className="flex justify-start">
                <div
                  className={cn(
                    "relative max-w-[80%] p-4 rounded-2xl rounded-bl-none shadow-sm text-sm break-words",
                    msg.error
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted/70"
                  )}
                >
                  {msg.ai && (
                    <>
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={MarkdownComponents}
                        >
                          {msg.ai}
                        </ReactMarkdown>
                      </div>

                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full opacity-70 hover:opacity-100 hover:bg-background/50"
                          onClick={() => copyToClipboard(msg.ai, index)}
                          title="Copy message"
                        >
                          {copiedMessageIndex === index ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full opacity-70 hover:opacity-100 hover:bg-background/50"
                          onClick={() => downloadAsPdf(msg.ai, index)}
                          title="Download as PDF"
                          disabled={downloadingIndex === index}
                        >
                          {downloadingIndex === index ? (
                            <div className="h-3.5 w-3.5 border-t-2 border-primary rounded-full animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                  {msg.error && (
                    <p className="text-destructive font-medium">{msg.error}</p>
                  )}
                  {loading &&
                    index === messages.length - 1 &&
                    !msg.ai &&
                    !msg.error && (
                      <div className="flex items-center space-x-3 text-muted-foreground">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"
                            style={{ animationDelay: "600ms" }}
                          ></div>
                        </div>
                        <span>Analyzing your financial data...</span>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border/30 bg-muted/30">
        <div className="flex gap-2 relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage(input)}
            placeholder="Ask any question about your finances..."
            className="flex-1 pl-4 pr-12 py-3 h-12 rounded-full border-border/30 bg-card focus-visible:ring-primary"
            disabled={loading}
            aria-label="Chat input"
          />
          <Button
            onClick={() => handleSendMessage(input)}
            disabled={loading || !input.trim()}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 rounded-full"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {remainingRequests !== null && (
          <div className="text-xs text-muted-foreground text-center mt-2">
            Requests remaining: {remainingRequests}
          </div>
        )}
      </div>
    </div>
  );
}
