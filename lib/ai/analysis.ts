import { Budget, Expense } from "@/lib/types";

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface PromptTemplate {
  type: string;
  template: string;
}

const promptTemplates: Record<string, PromptTemplate> = {
  spendingHabits: {
    type: "analysis",
    template: `Analyze the spending habits based on the provided expenses and budgets. Focus on:
1. Top spending categories
2. Budget adherence
3. Spending trends
4. Areas of concern
5. Potential savings opportunities`,
  },
  budgetStatus: {
    type: "analysis",
    template: `Evaluate the current budget status:
1. Budget utilization by category
2. Over/under budget areas
3. Remaining budget analysis
4. Budget effectiveness
5. Recommendations for adjustments`,
  },
  savingsSuggestions: {
    type: "recommendations",
    template: `Based on the spending patterns and budget allocation, suggest ways to save money:
1. Identify potential areas of overspending
2. Specific actionable recommendations
3. Category-specific saving strategies
4. Budget reallocation suggestions
5. Long-term saving opportunities`,
  },
};

function preparePrompt(
  userPrompt: string,
  data: { budgets: Budget[]; expenses: Expense[] }
): string {
  // Identify the most relevant template based on the user's prompt
  const template = Object.values(promptTemplates).reduce((best, current) => {
    const currentScore = calculateSimilarity(
      userPrompt.toLowerCase(),
      current.type.toLowerCase()
    );
    const bestScore = calculateSimilarity(
      userPrompt.toLowerCase(),
      best.type.toLowerCase()
    );
    return currentScore > bestScore ? current : best;
  }, promptTemplates.spendingHabits);

  // Process and format the data
  const processedData = {
    totalExpenses: data.expenses.reduce((sum, exp) => sum + exp.amount, 0),
    totalBudget: data.budgets.reduce((sum, budget) => sum + budget.amount, 0),
    expensesByCategory: groupExpensesByCategory(data.expenses),
    budgetUtilization: calculateBudgetUtilization(data.budgets, data.expenses),
  };

  return `${template.template}

Financial Data Summary:
Total Budget: $${processedData.totalBudget}
Total Expenses: $${processedData.totalExpenses}
Budget Utilization: ${(
    (processedData.totalExpenses / processedData.totalBudget) *
    100
  ).toFixed(1)}%

Detailed Data:
${JSON.stringify(processedData, null, 2)}

${userPrompt}`;
}

async function makeRequest(prompt: string, retryCount = 0): Promise<string> {
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Gemini API error: ${error.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      // Exponential backoff
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return makeRequest(prompt, retryCount + 1);
    }
    throw error;
  }
}

export async function generateFinancialAnalysis(
  prompt: string,
  data: { budgets: Budget[]; expenses: Expense[] }
): Promise<string> {
  try {
    const enhancedPrompt = preparePrompt(prompt, data);
    const analysis = await makeRequest(enhancedPrompt);
    return analysis;
  } catch (error) {
    console.error("Error generating financial analysis:", error);
    throw new Error(
      "Failed to generate financial analysis. Please try again later."
    );
  }
}

// Helper functions
function calculateSimilarity(str1: string, str2: string): number {
  // Simple Jaccard similarity implementation
  const set1 = new Set(str1.split(" "));
  const set2 = new Set(str2.split(" "));
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

function groupExpensesByCategory(expenses: Expense[]): Record<string, number> {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
}

function calculateBudgetUtilization(
  budgets: Budget[],
  expenses: Expense[]
): Record<string, number> {
  const expensesByCategory = groupExpensesByCategory(expenses);
  return budgets.reduce((acc, budget) => {
    acc[budget.category] =
      ((expensesByCategory[budget.category] || 0) / budget.amount) * 100;
    return acc;
  }, {} as Record<string, number>);
}
