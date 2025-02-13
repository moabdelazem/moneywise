import { useState } from "react";
import { getGeminiResponse } from "@/services/geminiApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const predefinedPrompts = [
  "Analyze my spending habits",
  "Give me a summary of my expenses",
  "Suggest ways to save money",
  "Provide a financial forecast",
];

export function AnalyzeWithAI() {
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
      const aiResponse = await getGeminiResponse(userMessage);
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
    <div className="space-y-4">
      <div className="flex space-x-2">
        {predefinedPrompts.map((prompt, index) => (
          <Button
            key={index}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
          >
            {prompt}
          </Button>
        ))}
      </div>
      <div className="p-4 bg-gray-100 rounded h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-4">
            <div className="font-bold">You:</div>
            <div className="mb-2">{msg.user}</div>
            <div className="font-bold">Moneywise:</div>
            <div>
              {msg.ai ||
                (loading && index === messages.length - 1
                  ? "Analyzing..."
                  : msg.error)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Moneywise..."
        />
        <Button onClick={() => handleSendMessage(input)} disabled={loading}>
          Send
        </Button>
      </div>
    </div>
  );
}
