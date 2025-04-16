export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  status: string;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
  month: number;
  year: number;
}

export type AuthHeader = string | null;

export interface ReportConfig {
  startDate: Date;
  endDate: Date;
  categories?: string[];
  format: "PDF" | "CSV" | "EXCEL";
  type: "EXPENSE" | "BUDGET" | "SAVINGS" | "COMPLETE";
}

export interface ReportData {
  expenses: Expense[];
  budgets: Budget[];
  summary: {
    totalExpenses: number;
    totalBudget: number;
    savings: number;
    categoryBreakdown: {
      category: string;
      amount: number;
      percentage: number;
    }[];
  };
}

export interface AnalysisRequest {
  prompt: string;
  data: {
    budgets: Budget[];
    expenses: Expense[];
  };
}

export interface AnalysisResponse {
  analysis: string;
  error?: string;
}
