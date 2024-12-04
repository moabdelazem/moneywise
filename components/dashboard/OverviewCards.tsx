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
        className="bg-gradient-to-br from-blue-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-blue-100 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-shadow duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Total Expenses
          </CardTitle>
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
            <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <motion.div
              className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              ${totalExpenses.toFixed(2)}
            </motion.div>
          )}
          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 font-medium">
            Total spent this period
          </p>
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-gradient-to-br from-green-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-green-100 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-shadow duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Budget Status
          </CardTitle>
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {budgetStatus.toFixed(0)}%
              </motion.div>
              <Progress
                value={budgetStatus}
                className="mt-2 h-2 bg-green-100 dark:bg-green-900"
              />
              <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 font-medium">
                {budgetStatus > 100 ? "Over budget" : "Within budget"}
              </p>
            </>
          )}
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-gradient-to-br from-purple-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-purple-100 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-shadow duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Top Category
          </CardTitle>
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
            <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {topCategory ? topCategory.category : "N/A"}
              </motion.div>
              <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 font-medium">
                {topCategory
                  ? `$${topCategory.amount.toFixed(2)} spent`
                  : "No expenses recorded"}
              </p>
            </>
          )}
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-gradient-to-br from-orange-50 to-white dark:from-neutral-900 dark:to-neutral-800 border border-orange-100 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-shadow duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Monthly Trend
          </CardTitle>
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
            <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <motion.div
                className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                ${currentMonthTotal.toFixed(2)}
              </motion.div>
              <div
                className={`flex items-center mt-2 ${monthlyChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
              >
                {monthlyChange >= 0 ? (
                  <ArrowUp className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-semibold">
                  {Math.abs(monthlyChangePercentage).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-600 dark:text-neutral-400 ml-1 font-medium">
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
