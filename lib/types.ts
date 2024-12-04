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
