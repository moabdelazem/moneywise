"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Budget, Expense } from "@/lib/types";

const MotionCard = motion(Card);

interface OverviewCardsProps {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
}

export function OverviewCards({
  expenses,
  budgets,
  isLoading,
}: OverviewCardsProps) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

  const budgetStatus =
    totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const chartData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const existingCategory = acc.find((item) => item.category === category);
    if (existingCategory) {
      existingCategory.amount += expense.amount;
    } else {
      acc.push({ category, amount: expense.amount });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  const topCategory =
    chartData.length > 0
      ? chartData.reduce((a, b) => (a.amount > b.amount ? a : b))
      : null;

  const currentMonth = new Date().getMonth();
  const currentMonthExpenses = expenses.filter(
    (expense) => new Date(expense.date).getMonth() === currentMonth
  );
  const currentMonthTotal = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthExpenses = expenses.filter(
    (expense) => new Date(expense.date).getMonth() === previousMonth
  );
  const previousMonthTotal = previousMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const monthlyChange = currentMonthTotal - previousMonthTotal;
  const monthlyChangePercentage =
    previousMonthTotal !== 0 ? (monthlyChange / previousMonthTotal) * 100 : 0;

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <MotionCard
        className="bg-card border border-gray-200 dark:border-neutral-700 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700 dark:text-neutral-200">
            Total Expenses
          </CardTitle>
          <DollarSign className="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <motion.div
              className="text-3xl font-bold text-gray-900 dark:text-neutral-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              ${totalExpenses.toFixed(2)}
            </motion.div>
          )}
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
            Total spent this period
          </p>
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-card border border-gray-200 dark:border-neutral-700 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700 dark:text-neutral-200">
            Budget Status
          </CardTitle>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <motion.div
                className="text-3xl font-bold text-gray-900 dark:text-neutral-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {budgetStatus.toFixed(0)}%
              </motion.div>
              <Progress value={budgetStatus} className="mt-2" />
              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
                {budgetStatus > 100 ? "Over budget" : "Within budget"}
              </p>
            </>
          )}
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-card border border-gray-200 dark:border-neutral-700 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700 dark:text-neutral-200">
            Top Category
          </CardTitle>
          <CreditCard className="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <motion.div
                className="text-3xl font-bold text-gray-900 dark:text-neutral-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {topCategory ? topCategory.category : "N/A"}
              </motion.div>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
                {topCategory
                  ? `$${topCategory.amount.toFixed(2)} spent`
                  : "No expenses recorded"}
              </p>
            </>
          )}
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-card border border-gray-200 dark:border-neutral-700 shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium text-gray-700 dark:text-neutral-200">
            Monthly Trend
          </CardTitle>
          <Calendar className="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <motion.div
                className="text-3xl font-bold text-gray-900 dark:text-neutral-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                ${currentMonthTotal.toFixed(2)}
              </motion.div>
              <div
                className={`flex items-center mt-2 ${
                  monthlyChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {monthlyChange >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(monthlyChangePercentage).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-neutral-400 ml-1">
                  vs last month
                </span>
              </div>
            </>
          )}
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
