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

// MotionCard is a motion component that wraps the Card component
const MotionCard = motion(Card);

// OverviewCardsProps is an interface that defines the props for the OverviewCards component
interface OverviewCardsProps {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
}

// OverviewCards is a React component that displays the overview cards
export function OverviewCards({
  expenses,
  budgets,
  isLoading,
}: OverviewCardsProps) {
  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed
  const currentYear = currentDate.getFullYear();

  // Filter expenses for the current month and year
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() + 1 === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  // Filter budgets for the current month and year
  const currentMonthBudgets = budgets.filter((budget) => {
    return budget.month === currentMonth && budget.year === currentYear;
  });

  // Calculate total expenses for the CURRENT month
  const totalCurrentMonthExpenses = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate total budget for the CURRENT month
  const totalCurrentMonthBudget = currentMonthBudgets.reduce(
    (sum, budget) => sum + budget.amount,
    0
  );

  // Calculate the budget status based on CURRENT month data
  const budgetStatus =
    totalCurrentMonthBudget > 0
      ? (totalCurrentMonthExpenses / totalCurrentMonthBudget) * 100
      : 0;

  // Calculate the chart data
  const chartData = expenses.reduce((acc, expense) => {
    // Find the category of the expense
    const category = expense.category;
    // Find the existing category in the accumulator
    const existingCategory = acc.find((item) => item.category === category);
    // If the category exists, add the amount to the existing category
    if (existingCategory) {
      // Add the amount to the existing category
      existingCategory.amount += expense.amount;
    } else {
      // Otherwise, add a new category to the accumulator
      acc.push({ category, amount: expense.amount });
    }
    // Return the accumulator
    return acc;
  }, [] as { category: string; amount: number }[]);

  // Find the top category by amount
  const topCategory =
    chartData.length > 0
      ? chartData.reduce((a, b) => (a.amount > b.amount ? a : b))
      : null;

  // Calculate the monthly trend
  /* 
  The monthly trend is calculated by finding the total expenses for the current month and the previous month.
  ? If the current month is January, the previous month is December.
  */
  const currentMonthForTrend = new Date().getMonth(); // Use JS 0-indexed month here
  const currentMonthExpensesForTrend = expenses.filter(
    (expense) =>
      new Date(expense.date).getMonth() === currentMonthForTrend &&
      new Date(expense.date).getFullYear() === currentYear
  );
  const currentMonthTotal = currentMonthExpensesForTrend.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const previousMonthForTrend =
    currentMonthForTrend === 0 ? 11 : currentMonthForTrend - 1;
  const previousYearForTrend =
    currentMonthForTrend === 0 ? currentYear - 1 : currentYear;
  const previousMonthExpenses = expenses.filter(
    (expense) =>
      new Date(expense.date).getMonth() === previousMonthForTrend &&
      new Date(expense.date).getFullYear() === previousYearForTrend
  );
  const previousMonthTotal = previousMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate the monthly change and the monthly change percentage
  const monthlyChange = currentMonthTotal - previousMonthTotal;
  // Calculate the monthly change percentage
  /* 
  The monthly change percentage is calculated by dividing the monthly change by the total expenses for the previous month.
  */
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
        className="bg-gradient-to-br from-blue-50/10 to-blue-900/5 dark:from-blue-950 dark:to-neutral-900 border-blue-200/20 dark:border-blue-800/20 shadow-lg hover:shadow-xl transition-shadow duration-200"
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
              ${totalCurrentMonthExpenses.toFixed(2)}
            </motion.div>
          )}
          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-2 font-medium">
            Total spent this period
          </p>
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-gradient-to-br from-green-50/10 to-green-900/5 dark:from-green-950 dark:to-neutral-900 border-green-200/20 dark:border-green-800/20 shadow-lg hover:shadow-xl transition-shadow duration-200"
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
        className="bg-gradient-to-br from-purple-50/10 to-purple-900/5 dark:from-purple-950 dark:to-neutral-900 border-purple-200/20 dark:border-purple-800/20 shadow-lg hover:shadow-xl transition-shadow duration-200"
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
        className="bg-gradient-to-br from-orange-50/10 to-orange-900/5 dark:from-orange-950 dark:to-neutral-900 border-orange-200/20 dark:border-orange-800/20 shadow-lg hover:shadow-xl transition-shadow duration-200"
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
                className={`flex items-center mt-2 ${
                  monthlyChange >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
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
