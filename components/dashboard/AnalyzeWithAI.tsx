import { useState } from "react";
import { getGeminiResponse } from "@/services/geminiApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader } from "@/components/ui/loader";

const predefinedPrompts = [
  "Analyze my spending habits",
  "Give me a summary of my expenses",
  "Suggest ways to save money",
  "Provide a financial forecast",
  "Show me my budget status",
  "How can I improve my financial health?",
];

interface AnalyzeWithAIProps {
  budgets: any[];
  expenses: any[];
}

export function AnalyzeWithAI({ budgets, expenses }: AnalyzeWithAIProps) {
  const [messages, setMessages] = useState<
    { user: string; ai: string; error?: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessages((prev) => [...prev, { user: userMessage, ai: "" }]);
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await getGeminiResponse(userMessage, {
        budgets,
        expenses,
      });
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 ? { ...msg, ai: aiResponse } : msg
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
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
          >
            {prompt}
          </Button>
        ))}
      </div>
      <div className="p-4 bg-muted rounded h-96 overflow-y-auto border border-border">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className="font-bold text-primary">You:</div>
            <div className="mb-2 p-2 bg-primary-light rounded shadow-sm">
              {msg.user}
            </div>
            <div className="font-bold text-secondary">Moneywise:</div>
            <div className="p-2 bg-secondary-light rounded shadow-sm">
              {msg.ai ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.ai}
                </ReactMarkdown>
              ) : loading && index === messages.length - 1 ? (
                <div className="flex items-center space-x-2">
                  <span>Moneywise is thinking...</span>
                  <Loader />
                </div>
              ) : (
                msg.error
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Moneywise..."
          className="flex-1 p-2 border border-border rounded shadow-sm"
        />
        <Button
          onClick={() => handleSendMessage(input)}
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded shadow-sm"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
