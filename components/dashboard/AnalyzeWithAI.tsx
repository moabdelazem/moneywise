import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Budget, Expense } from "@/lib/types";
import { cn } from "@/lib/utils";

const predefinedPrompts = [
  "Analyze my spending habits",
  "Give me a summary of my expenses",
  "Suggest ways to save money",
  "Provide a financial forecast",
  "Show me my budget status",
  "How can I improve my financial health?",
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

export function AnalyzeWithAI({ budgets, expenses, initialRemainingRequests }: AnalyzeWithAIProps) {
  // Initialize state from sessionStorage or default to empty array
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const savedMessages = sessionStorage.getItem(CHAT_HISTORY_KEY);
      try {
        return savedMessages ? JSON.parse(savedMessages) : [];
      } catch (error) {
        console.error("Failed to parse chat history from sessionStorage:", error);
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      const { analysis, remainingRequests: updatedRemainingRequests } = await response.json();
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, ai: analysis } : msg
        )
      );

      if (typeof updatedRemainingRequests === 'number') {
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
      setTimeout(scrollToBottom, 0);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px] p-3 sm:p-4 bg-card rounded-lg shadow-md border">
      <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b">
        {predefinedPrompts.map((prompt, index) => (
          <Button
            key={index}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm hover:bg-muted"
          >
            {prompt}
          </Button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto mb-3 pr-2 space-y-4 scroll-smooth">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm pt-8">
            Ask MoneyWise AI about your finances or select a prompt above.
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-primary text-primary-foreground p-3 rounded-lg rounded-br-none shadow-sm text-sm break-words">
                {msg.user}
              </div>
            </div>

            {(msg.ai || msg.error || (loading && index === messages.length - 1)) && (
              <div className="flex justify-start">
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg rounded-bl-none shadow-sm text-sm break-words",
                    msg.error ? "bg-destructive/10" : "bg-muted"
                  )}
                >
                  {msg.ai && (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.ai}
                      </ReactMarkdown>
                    </div>
                  )}
                  {msg.error && (
                    <p className="text-destructive font-medium">{msg.error}</p>
                  )}
                  {loading && index === messages.length - 1 && !msg.ai && !msg.error && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Analyzing... Please wait.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center space-x-2 pt-3 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(input)}
          placeholder="Ask about your finances..."
          className="flex-1 h-10"
          disabled={loading}
          aria-label="Chat input"
        />
        <Button
          onClick={() => handleSendMessage(input)}
          disabled={loading || !input.trim()}
          className="h-10"
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Send"
          )}
        </Button>
      </div>
      {remainingRequests !== null && (
        <div className="text-xs text-muted-foreground text-center pt-2">
          Requests remaining: {remainingRequests}
        </div>
      )}
    </div>
  );
}
