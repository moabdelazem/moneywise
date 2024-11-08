"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface Expense {
  id: string;
  amount: number;
  category: string;
}

interface TopSpendingCategoriesProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function TopSpendingCategories({
  expenses,
  isLoading,
}: TopSpendingCategoriesProps) {
  const topCategories = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));
  }, [expenses]);

  const totalSpending = topCategories.reduce(
    (sum, category) => sum + category.amount,
    0
  );

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-8 w-full mb-2" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCategories.map((category) => (
            <div key={category.category} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {category.category}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ${category.amount.toFixed(2)}
                </span>
              </div>
              <Progress
                value={(category.amount / totalSpending) * 100}
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
