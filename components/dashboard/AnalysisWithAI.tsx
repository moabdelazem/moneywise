import { useState } from "react";
import { getGeminiResponse } from "@/services/geminiApi";
import { Button } from "@/components/ui/button";

interface AnalysisWithAIProps {
  prompt: string;
}

export function AnalysisWithAI({ prompt }: AnalysisWithAIProps) {
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAiAnalysis = async () => {
    setLoading(true);
    try {
      const response = await getGeminiResponse(prompt);
      setAiResponse(response);
    } catch (error) {
      console.error("AI analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleAiAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Get AI Analysis"}
      </Button>
      {aiResponse && (
        <div className="p-4 bg-gray-100 rounded">{aiResponse}</div>
      )}
    </div>
  );
}
