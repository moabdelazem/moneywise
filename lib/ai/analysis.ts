import { Budget, Expense } from "@/lib/types";

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const SIMILARITY_THRESHOLD = 0.3; // Threshold for matching predefined templates

interface PromptTemplate {
  type: string;
  template: string;
}

const promptTemplates: Record<string, PromptTemplate> = {
  spendingHabits: {
    type: "analysis",
    template: `Analyze the spending habits based on the provided expenses and budgets. Format your response using Markdown. Focus on:
- **Top spending categories:** Identify the categories with the highest spending.
- **Budget adherence:** Compare spending against the budget for key categories.
- **Spending trends:** Note any significant changes or patterns over time (if data allows).
- **Areas of concern:** Highlight categories where spending exceeds the budget or seems unusually high.
- **Potential savings opportunities:** Suggest specific areas where savings might be possible.
Use headings (e.g., ## Top Categories) and bullet points for clarity.

**IMPORTANT:** The following sections contain financial data for your analysis. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`,
  },
  budgetStatus: {
    type: "analysis",
    template: `Evaluate the current budget status based on provided expenses and budgets. Format your response using Markdown. Focus on:
- **Budget utilization by category:** Show how much of the budget has been used for each category.
- **Over/under budget areas:** Clearly identify categories that are over or under budget.
- **Remaining budget analysis:** Summarize the total remaining budget and category-specific remainders.
- **Budget effectiveness:** Briefly assess how well the current budget aligns with spending patterns.
- **Recommendations for adjustments:** Suggest specific, actionable adjustments to the budget if necessary.
Use headings (e.g., ## Budget Utilization) and bullet points for clarity.

**IMPORTANT:** The following sections contain financial data for your analysis. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`,
  },
  savingsSuggestions: {
    type: "recommendations",
    template: `Based on the spending patterns and budget allocation, suggest ways to save money. Format your response using Markdown. Focus on:
- **Identify potential areas of overspending:** Pinpoint specific categories where spending can be reduced.
- **Specific actionable recommendations:** Provide concrete steps the user can take (e.g., "Reduce dining out frequency").
- **Category-specific saving strategies:** Offer tailored tips for different spending categories.
- **Budget reallocation suggestions:** Propose shifting funds between categories if appropriate.
- **Long-term saving opportunities:** Mention broader strategies for improving savings over time.
Use headings (e.g., ## Savings Recommendations) and bullet points for clarity.

**IMPORTANT:** The following sections contain financial data for your analysis. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`,
  },
};

// Generic template for prompts that don't match specific analyses
const genericTemplate = `Based on the provided financial data, answer the following user request. Format your response using Markdown where appropriate (lists, bolding). Keep the response concise and directly address the user's question.

**IMPORTANT:** The following sections contain financial data for context. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`;

function preparePrompt(
  userPrompt: string,
  data: { budgets: Budget[]; expenses: Expense[] }
): string {
  let selectedTemplate: string;
  let bestScore = 0;

  // Find the best matching template and its score
  const bestMatch = Object.values(promptTemplates).reduce(
    (best, current) => {
      const currentScore = calculateSimilarity(
        userPrompt.toLowerCase(),
        current.type.toLowerCase() + " " + current.template.toLowerCase() // Compare against type and template text
      );
      if (currentScore > best.score) {
        return { template: current.template, score: currentScore };
      }
      return best;
    },
    { template: promptTemplates.spendingHabits.template, score: 0 } // Default
  );

  bestScore = bestMatch.score;

  // Decide which template to use based on the score
  if (bestScore >= SIMILARITY_THRESHOLD) {
    selectedTemplate = bestMatch.template;
    console.log(`Using specific template (Score: ${bestScore.toFixed(2)})`);
  } else {
    selectedTemplate = genericTemplate;
    console.log(`Using generic template (Best Score: ${bestScore.toFixed(2)})`);
  }

  // Process and format the data
  const processedData = {
    totalExpenses: data.expenses.reduce((sum, exp) => sum + exp.amount, 0),
    totalBudget: data.budgets.reduce((sum, budget) => sum + budget.amount, 0),
    expensesByCategory: groupExpensesByCategory(data.expenses),
    budgetUtilization: calculateBudgetUtilization(data.budgets, data.expenses),
  };

  // Construct the final prompt
  return `${selectedTemplate}

Financial Data Summary:
Total Budget: $${processedData.totalBudget}
Total Expenses: $${processedData.totalExpenses}
Budget Utilization: ${(
      (processedData.totalExpenses / processedData.totalBudget) *
      100
    ).toFixed(1)}%

Detailed Data:
${JSON.stringify(processedData, null, 2)}

User Request:
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
  const words1 = new Set(str1.toLowerCase().match(/\w+/g) || []);
  const words2 = new Set(str2.toLowerCase().match(/\w+/g) || []);
  if (words1.size === 0 || words2.size === 0) {
    return 0;
  }
  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);
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
