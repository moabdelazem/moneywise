import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MotionCard = motion(Card);

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface LatestExpensesProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function LatestExpenses({ expenses, isLoading }: LatestExpensesProps) {
  const latestExpenses = expenses.slice(0, 5); // Get the 5 most recent expenses

  if (isLoading) {
    return (
      <MotionCard
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Latest Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-12 mb-2" />
          ))}
        </CardContent>
      </MotionCard>
    );
  }

  if (expenses.length === 0) {
    return (
      <MotionCard
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Latest Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Expenses</AlertTitle>
            <AlertDescription>
              You haven&apos;t recorded any expenses yet. Start adding expenses
              to see them here.
            </AlertDescription>
          </Alert>
        </CardContent>
      </MotionCard>
    );
  }

  return (
    <MotionCard
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Latest Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {latestExpenses.map((expense) => (
            <li key={expense.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {expense.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {expense.category}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  ${expense.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </MotionCard>
  );
}
