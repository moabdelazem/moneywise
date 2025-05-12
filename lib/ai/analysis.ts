import { Budget, Expense } from "@/lib/types";

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const SIMILARITY_THRESHOLD = 0.25; // Lower threshold to capture more intents

interface PromptTemplate {
  type: string;
  template: string;
  keywords: string[]; // Keywords for better intent matching
}

const promptTemplates: Record<string, PromptTemplate> = {
  questionAnswering: {
    type: "question",
    template: `You are MoneyWise, a professional financial advisor assistant. Answer the user's specific financial question using only the provided data. 

Your response MUST:
1. Be direct and concise - answer the specific question asked
2. Use precise dollar figures from the actual data
3. Double-check all calculations before responding
4. Format using Markdown with clear structure
5. Present only factually correct information based strictly on the provided data
6. Focus on CURRENT MONTH data unless the question specifically asks about other time periods

**Format your response like this:**
## Answer
Direct answer to the question with **important figures in bold**.

### Supporting Data
| Item | Value | Context |
| ---- | ----- | ------- |
| Item 1 | $X | Brief explanation |
| Item 2 | $Y | Brief explanation |

### Additional Context
- Add 1-2 points that provide helpful context to the answer
- Only include if directly relevant to the question

If you're unable to answer the question with the available data, clearly state that and explain what data would be needed.

**IMPORTANT:** The following sections contain financial data for your analysis. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's question and the provided data.`,
    keywords: [
      "what",
      "how much",
      "how many",
      "when",
      "where",
      "why",
      "which",
      "can you tell",
      "show me",
      "list",
      "analyze",
      "?",
    ],
  },
  spendingHabits: {
    type: "analysis",
    template: `You are MoneyWise, a professional financial advisor assistant. Analyze the spending habits based on the provided expenses and budgets. Focus on CURRENT MONTH data.

Your response MUST:
1. Be thorough yet concise - minimum 2 paragraphs, maximum 4 paragraphs
2. Use precise dollar figures from the actual data
3. Double-check all calculations before responding
4. Format using Markdown with clear structure
5. Present only factually correct information based strictly on the provided data

**Format your response like this:**
## Spending Analysis 
Your analysis text here with **important figures in bold**. Make this paragraph informative and data-driven.

### Top Spending Categories
- **Category 1**: $X (X% of total spending)
- **Category 2**: $Y (Y% of total spending)
- **Category 3**: $Z (Z% of total spending)

### Budget Performance
| Category | Budget | Actual | Difference | Status |
| -------- | ------ | ------ | ---------- | ------ |
| Category 1 | $X | $Y | $Z | Over/Under |
| Category 2 | $X | $Y | $Z | Over/Under |

### Areas of Concern
1. Identify specific problems with exact figures
2. Provide context for why this is concerning

## Recommendations
Provide 2-3 actionable recommendations based on the data.

Focus on:
- **Top spending categories:** Identify the exact categories with the highest spending with specific dollar amounts.
- **Budget adherence:** Compare actual spending against the budget with percentage calculations.
- **Spending trends:** Note patterns supported by data, not assumptions.
- **Areas of concern:** Highlight categories where spending exceeds the budget with exact figures.
- **Potential savings opportunities:** Suggest specific, actionable areas where savings might be possible.

**IMPORTANT:** The following sections contain financial data for your analysis. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`,
    keywords: [
      "spending",
      "habits",
      "analyze",
      "patterns",
      "where",
      "money",
      "goes",
      "expenses",
      "spent",
    ],
  },
  budgetStatus: {
    type: "analysis",
    template: `You are MoneyWise, a professional financial advisor assistant. Evaluate the current budget status based on provided expenses and budgets. Focus on CURRENT MONTH data.

Your response MUST:
1. Be thorough yet concise - minimum 2 paragraphs, maximum 4 paragraphs
2. Use precise dollar figures from the actual data
3. Double-check all calculations before responding
4. Format using Markdown with clear structure
5. Present only factually correct information based strictly on the provided data

**Format your response like this:**
## Budget Status Overview
Your analysis text here with **important figures in bold**. Make this paragraph informative and data-driven.

### Budget Utilization By Category
| Category | Budget | Spent | Remaining | % Used |
| -------- | ------ | ----- | --------- | ------ |
| Category 1 | $X | $Y | $Z | P% |
| Category 2 | $X | $Y | $Z | P% |

### Areas of Concern
- **Over Budget**: List categories that are over budget with exact figures
- **Nearly Depleted**: List categories with less than 10% remaining

### Recommendations
1. First specific, actionable recommendation
2. Second specific, actionable recommendation

Focus on:
- **Budget utilization by category:** Show exactly how much of the budget has been used for each category with specific dollar amounts.
- **Over/under budget areas:** Clearly identify categories that are over or under budget with exact figures.
- **Remaining budget analysis:** Summarize the total remaining budget with specific dollar amounts.
- **Budget effectiveness:** Assess how well the current budget aligns with spending patterns using data-driven insights.
- **Recommendations for adjustments:** Suggest specific, actionable adjustments to the budget if necessary.

**IMPORTANT:** The following sections contain financial data for your analysis. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`,
    keywords: [
      "budget",
      "status",
      "utilization",
      "remaining",
      "overspent",
      "underspent",
      "allocation",
    ],
  },
  savingsSuggestions: {
    type: "recommendations",
    template: `You are MoneyWise, a professional financial advisor assistant. Based on the spending patterns and budget allocation, suggest ways to save money. Focus on CURRENT MONTH data.

Your response MUST:
1. Be thorough yet concise - minimum 2 paragraphs, maximum 4 paragraphs
2. Use precise dollar figures from the actual data
3. Double-check all calculations before responding
4. Format using Markdown with clear structure
5. Present only factually correct information based strictly on the provided data

**Format your response like this:**
## Savings Opportunities
Your analysis text here with **important figures in bold**. Make this paragraph informative and data-driven.

### Top Areas for Potential Savings
| Category | Current Spending | Potential Saving | How to Achieve |
| -------- | ---------------- | ---------------- | -------------- |
| Category 1 | $X | $Y | Brief strategy |
| Category 2 | $X | $Y | Brief strategy |

### Specific Recommendations
1. **First recommendation**: Detailed explanation with potential savings amount
2. **Second recommendation**: Detailed explanation with potential savings amount
3. **Third recommendation**: Detailed explanation with potential savings amount

### Long-term Strategy
Provide a brief paragraph about long-term saving strategies based on the data.

Focus on:
- **Identify potential areas of overspending:** Pinpoint specific categories where spending can be reduced with exact dollar amounts.
- **Specific actionable recommendations:** Provide concrete steps the user can take with estimated savings amounts.
- **Category-specific saving strategies:** Offer tailored tips for different spending categories based on actual spending patterns.
- **Budget reallocation suggestions:** Propose shifting funds between categories with specific dollar amounts.
- **Long-term saving opportunities:** Mention broader strategies for improving savings over time with projected outcomes.

**IMPORTANT:** The following sections contain financial data for your analysis. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`,
    keywords: [
      "save",
      "saving",
      "savings",
      "reduce",
      "cut",
      "lower",
      "decrease",
      "recommendations",
      "suggestions",
      "tips",
      "optimize",
    ],
  },
  categoryComparison: {
    type: "comparison",
    template: `You are MoneyWise, a professional financial advisor assistant. Compare specific expense categories as requested by the user. Focus on CURRENT MONTH data unless otherwise specified.

Your response MUST:
1. Be direct and data-focused
2. Use precise dollar figures from the actual data
3. Include percentages to show relative differences
4. Format using Markdown with clear structure including tables and/or charts
5. Present only factually correct information based strictly on the provided data

**Format your response like this:**
## Category Comparison
Direct answer to the comparison question with **important figures in bold**.

### Comparison Table
| Category | Amount | % of Total | Notes |
| -------- | ------ | ---------- | ----- |
| Category 1 | $X | X% | Brief context |
| Category 2 | $Y | Y% | Brief context |

### Key Observations
- First observation about the comparison with specific figures
- Second observation about the comparison with specific figures

**IMPORTANT:** The following sections contain financial data for your analysis. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`,
    keywords: [
      "compare",
      "comparison",
      "versus",
      "vs",
      "difference",
      "between",
      "more than",
      "less than",
    ],
  },
};

// Generic template for prompts that don't match specific analyses
const genericTemplate = `You are MoneyWise, a professional financial advisor assistant. Based on the provided financial data, answer the following user request. Focus on CURRENT MONTH data unless otherwise specified.

Your response MUST:
1. Be thorough yet concise - minimum 2 paragraphs, maximum 4 paragraphs
2. Use precise dollar figures from the actual data
3. Double-check all calculations before responding
4. Format using Markdown with clear structure
5. Present only factually correct information based strictly on the provided data
6. Directly answer the user's specific question without unnecessary information

**Format your response like this:**
## Financial Analysis
Your analysis text here with **important figures in bold**. Make this paragraph informative and data-driven.

### Key Data Points
| Item | Value | Notes |
| ---- | ----- | ----- |
| Item 1 | Value 1 | Brief context |
| Item 2 | Value 2 | Brief context |

### Observations
- First important observation with supporting data
- Second important observation with supporting data

### Recommendations
1. First specific, actionable recommendation
2. Second specific, actionable recommendation

**IMPORTANT:** The following sections contain financial data for context. Do NOT include the 'Financial Data Summary' or 'Detailed Data' sections in your final response to the user. Base your response ONLY on the user's request and the provided data.`;

// Filter expenses for current month
function filterCurrentMonthData(expenses: Expense[]): Expense[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });
}

function preparePrompt(
  userPrompt: string,
  data: { budgets: Budget[]; expenses: Expense[] }
): string {
  // Filter expenses to current month by default
  const currentMonthExpenses = filterCurrentMonthData(data.expenses);
  const expenses =
    currentMonthExpenses.length > 0 ? currentMonthExpenses : data.expenses;

  let selectedTemplate: string = promptTemplates.spendingHabits.template; // Initialize with default
  let bestScore = 0;
  let bestTemplateName = "";

  // Check for question structure first
  const lowerPrompt = userPrompt.toLowerCase();
  const isQuestion = promptTemplates.questionAnswering.keywords.some(
    (keyword) => lowerPrompt.includes(keyword)
  );

  if (isQuestion) {
    selectedTemplate = promptTemplates.questionAnswering.template;
    bestTemplateName = "questionAnswering";
    console.log("Detected question pattern, using question-answering template");
  } else {
    // Check for best match across all templates using both similarity and keywords
    Object.entries(promptTemplates).forEach(([templateName, templateObj]) => {
      // Calculate similarity score
      const similarityScore = calculateSimilarity(
        lowerPrompt,
        templateObj.type.toLowerCase() +
          " " +
          templateObj.template.toLowerCase()
      );

      // Calculate keyword score
      const keywordMatches = templateObj.keywords.filter((keyword) =>
        lowerPrompt.includes(keyword.toLowerCase())
      ).length;
      const keywordScore = keywordMatches / templateObj.keywords.length;

      // Combined score (weighted)
      const combinedScore = similarityScore * 0.6 + keywordScore * 0.4;

      if (combinedScore > bestScore) {
        bestScore = combinedScore;
        selectedTemplate = templateObj.template;
        bestTemplateName = templateName;
      }
    });

    console.log(
      `Selected template: ${bestTemplateName} (Score: ${bestScore.toFixed(2)})`
    );

    // If no good match, use generic template
    if (bestScore < SIMILARITY_THRESHOLD) {
      selectedTemplate = genericTemplate;
      bestTemplateName = "generic";
      console.log(
        `Using generic template (Best Score was: ${bestScore.toFixed(2)})`
      );
    }
  }

  // Process and format the data
  const processedData = {
    totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    totalBudget: data.budgets.reduce((sum, budget) => sum + budget.amount, 0),
    expensesByCategory: groupExpensesByCategory(expenses),
    budgetUtilization: calculateBudgetUtilization(data.budgets, expenses),
    expenseTimeframe:
      currentMonthExpenses.length > 0 ? "current month" : "all time",
  };

  // Construct the final prompt with clear user request and data
  return `${selectedTemplate}

Financial Data Summary:
Time Period: ${processedData.expenseTimeframe}
Total Budget: $${processedData.totalBudget.toFixed(2)}
Total Expenses: $${processedData.totalExpenses.toFixed(2)}
Budget Utilization: ${(
    (processedData.totalExpenses / processedData.totalBudget) *
    100
  ).toFixed(1)}%

Detailed Data:
${JSON.stringify(processedData, null, 2)}

Raw Expenses Data (for reference):
${JSON.stringify(expenses.slice(0, 20), null, 2)}
${expenses.length > 20 ? `\n...and ${expenses.length - 20} more expenses` : ""}

Raw Budget Data (for reference):
${JSON.stringify(data.budgets, null, 2)}

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
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 800,
          stopSequences: [
            "User Request:",
            "Financial Data Summary:",
            "Detailed Data:",
            "Raw Expenses Data:",
            "Raw Budget Data:",
          ],
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH",
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
    const responseText = data.candidates[0].content.parts[0].text;

    // Post-process the response to ensure it's clean and properly formatted
    return cleanupResponse(responseText);
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

// Helper function to clean up AI responses
function cleanupResponse(text: string): string {
  // Remove any system prompt artifacts that might have leaked through
  let cleaned = text.replace(/^(You are MoneyWise.*?\n)/i, "");

  // Remove any references to the data sections
  cleaned = cleaned.replace(/Financial Data Summary:.*?$/gm, "");
  cleaned = cleaned.replace(/Detailed Data:.*?$/gm, "");
  cleaned = cleaned.replace(/Raw Expenses Data.*?$/gm, "");
  cleaned = cleaned.replace(/Raw Budget Data.*?$/gm, "");

  // Remove any "User Request:" sections
  cleaned = cleaned.replace(/User Request:.*?$/gm, "");

  // Remove any disclaimer text that doesn't add value
  cleaned = cleaned.replace(
    /\n*I've analyzed the provided financial data\.*/gi,
    ""
  );
  cleaned = cleaned.replace(/\n*Based on the financial data provided\.*/gi, "");
  cleaned = cleaned.replace(/\n*Based on the provided data\.*/gi, "");

  // Fix markdown formatting issues

  // Ensure headers have proper spacing (## Header instead of ##Header)
  cleaned = cleaned.replace(/##([^\s#])/g, "## $1");
  cleaned = cleaned.replace(/###([^\s#])/g, "### $1");

  // Ensure bullet points have proper spacing (- Item instead of -Item)
  cleaned = cleaned.replace(/^-([^\s])/gm, "- $1");

  // Ensure numbered lists have proper spacing (1. Item instead of 1.Item)
  cleaned = cleaned.replace(/^(\d+)\.([^\s])/gm, "$1. $2");

  // Fix table formatting to ensure proper markdown tables
  if (cleaned.includes("|")) {
    const lines = cleaned.split("\n");
    let inTable = false;
    let headerRow = -1;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        if (!inTable) {
          inTable = true;
          headerRow = i;
        }

        // Make sure cell contents have spaces for readability
        lines[i] = lines[i]
          .replace(/\|([^\s|])/g, "| $1")
          .replace(/([^\s|])\|/g, "$1 |");
      } else if (inTable) {
        // We've exited a table, check if we need to add a separator row
        inTable = false;
        if (
          headerRow >= 0 &&
          (headerRow + 1 >= lines.length ||
            !lines[headerRow + 1].includes("--"))
        ) {
          // Count columns in the header
          const columnCount = (lines[headerRow].match(/\|/g) || []).length - 1;
          const separatorRow = "| " + "--- | ".repeat(columnCount);
          lines.splice(headerRow + 1, 0, separatorRow);
          i++; // Skip the newly inserted line
        }
        headerRow = -1;
      }
    }
    cleaned = lines.join("\n");
  }

  // Ensure the response doesn't have empty sections or excessive newlines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  cleaned = cleaned.trim();

  return cleaned;
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
): Record<string, { spent: number; percentage: number; remaining: number }> {
  const expensesByCategory = groupExpensesByCategory(expenses);
  return budgets.reduce((acc, budget) => {
    const spent = expensesByCategory[budget.category] || 0;
    const percentage = (spent / budget.amount) * 100;
    const remaining = Math.max(0, budget.amount - spent);

    acc[budget.category] = {
      spent,
      percentage,
      remaining,
    };
    return acc;
  }, {} as Record<string, { spent: number; percentage: number; remaining: number }>);
}
