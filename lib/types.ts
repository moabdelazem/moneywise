export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

export type AuthHeader = string | null;

export interface ReportConfig {
  startDate: Date;
  endDate: Date;
  categories?: string[];
  format: 'PDF' | 'CSV' | 'EXCEL';
  type: 'EXPENSE' | 'BUDGET' | 'SAVINGS' | 'COMPLETE';
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
