import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader } from "@/components/ui/loader";
import { toast } from "@/components/ui/use-toast";
import { Budget, Expense } from "@/lib/types";

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
}

interface Message {
  user: string;
  ai: string;
  error?: string;
}

export function AnalyzeWithAI({ budgets, expenses }: AnalyzeWithAIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { user: userMessage, ai: "" }]);
    setInput("");
    setLoading(true);

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
        const error = await response.json();
        throw new Error(error.error || "Failed to get AI response");
      }

      const { analysis } = await response.json();
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, ai: analysis } : msg
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, error: errorMessage } : msg
        )
      );

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg shadow-md">
      <div className="flex flex-wrap gap-2">
        {predefinedPrompts.map((prompt, index) => (
          <Button
            key={index}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            variant="outline"
            className="bg-primary/10 hover:bg-primary/20"
          >
            {prompt}
          </Button>
        ))}
      </div>
      <div className="p-4 bg-muted rounded-lg h-96 overflow-y-auto border border-border">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className="font-semibold text-primary">You:</div>
            <div className="mb-2 p-2 bg-primary/10 rounded-lg">{msg.user}</div>
            <div className="font-semibold text-secondary">Moneywise:</div>
            <div className="p-2 bg-secondary/10 rounded-lg prose prose-sm max-w-none dark:prose-invert">
              {msg.ai ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.ai}
                </ReactMarkdown>
              ) : loading && index === messages.length - 1 ? (
                <div className="flex items-center space-x-2">
                  <span>Analyzing your finances...</span>
                  <Loader />
                </div>
              ) : (
                <div className="text-destructive">{msg.error}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage(input)}
          placeholder="Ask about your finances..."
          className="flex-1"
        />
        <Button
          onClick={() => handleSendMessage(input)}
          disabled={loading}
          className="bg-primary hover:bg-primary/90"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
