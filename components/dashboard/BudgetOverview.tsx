"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  AlertCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PlusCircle,
} from "lucide-react";
import { Budget, Expense } from "@/lib/types";
import { useState } from "react";
import { AdjustBudgetModal } from "./modals/AdjustBudgetModal";

// Motion card component for animations
const MotionCard = motion(Card);

// Budget overview component
interface BudgetOverviewProps {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
  fullWidth?: boolean;
}

export function BudgetOverview({
  expenses,
  budgets,
  isLoading,
  fullWidth = false,
}: BudgetOverviewProps) {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);

  // Calculate total budget, total expenses, remaining budget, and budget utilization
  const totalBudget = budgets
    .filter((budget) => {
      const currentDate = new Date();
      return budget.month === currentDate.getMonth() + 1 &&
        budget.year === currentDate.getFullYear();
    })
    .reduce((sum, budget) => sum + budget.amount, 0);

  const totalExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === new Date().getMonth();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const remainingBudget = totalBudget - totalExpenses;
  const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  // Calculate pie chart data
  const pieChartData = budgets.map((budget) => {
    const expensesForCategory = expenses
      .filter((e) => e.category === budget.category)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      name: budget.category,
      value: expensesForCategory,
    };
  });

  // Enhanced color palette with better contrast
  const COLORS = [
    "#3B82F6", // Blue
    "#10B981", // Green  
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
  ];

  const chartConfig = {
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-1))",
    },
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (budgets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-neutral-900 dark:to-neutral-800 rounded-lg p-8">
          <AlertCircle className="w-16 h-16 text-blue-500 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            No Budgets Set
          </h3>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            You haven&apos;t set any budgets yet. Start by adding your first
            budget to track your expenses effectively.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Budget
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Overall Budget
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Budget
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  ${totalBudget.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Expenses
                </span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  ${totalExpenses.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Remaining
                </span>
                <span className={`text-lg font-bold flex items-center gap-2 
                  ${remainingBudget >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                  ${Math.abs(remainingBudget).toFixed(2)}
                  {remainingBudget >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Progress
                value={budgetUtilization}
                className="h-3 rounded-full"
                style={{
                  background: budgetUtilization > 100 ? "#FEE2E2" : "#F3F4F6",
                  backgroundColor: budgetUtilization > 100
                    ? "#EF4444"
                    : budgetUtilization > 75
                      ? "#F59E0B"
                      : "#10B981",
                }}
              />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                {budgetUtilization.toFixed(1)}% of budget utilized
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Expense Distribution
            </h3>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    wrapperClassName="bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-2"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {pieChartData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center bg-white dark:bg-neutral-800 p-2 rounded-lg shadow-sm">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Category Breakdown
          </h3>
          <div className="space-y-6">
            {budgets.map((budget) => {
              const totalExpensesForCategory = expenses
                .filter((e) => e.category === budget.category)
                .reduce((sum, e) => sum + e.amount, 0);
              const percentage = (totalExpensesForCategory / budget.amount) * 100;

              return (
                <div key={budget.id} className="space-y-3 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {budget.category}
                    </span>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-gray-100 dark:bg-neutral-700">
                      ${totalExpensesForCategory.toFixed(2)} / ${budget.amount.toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-2.5 rounded-full"
                    style={{
                      background: percentage > 100 ? "#FEE2E2" : "#F3F4F6",
                      backgroundColor: percentage > 100
                        ? "#EF4444"
                        : percentage > 75
                          ? "#F59E0B"
                          : "#10B981",
                    }}
                  />
                  {percentage > 100 && (
                    <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <AlertCircle className="h-5 w-5" />
                      <AlertTitle className="font-semibold">Over Budget</AlertTitle>
                      <AlertDescription className="text-sm">
                        You&apos;ve exceeded your budget for {budget.category} by
                        <span className="font-semibold"> ${(totalExpensesForCategory - budget.amount).toFixed(2)}</span>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <MotionCard
        className={`bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 shadow-xl border-0 ${fullWidth ? "w-full" : ""
          }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-neutral-800">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Budget Overview
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 shadow-sm"
            onClick={() => setIsAdjustModalOpen(true)}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Adjust Budget
          </Button>
        </CardHeader>
        <CardContent className="p-6">{renderContent()}</CardContent>
      </MotionCard>

      <AdjustBudgetModal
        open={isAdjustModalOpen}
        onOpenChange={setIsAdjustModalOpen}
        currentBudgets={budgets}
        onBudgetAdjusted={() => {
          // Trigger a refresh of the budgets data
          window.dispatchEvent(new CustomEvent("refresh-budgets"));
        }}
      />
    </>
  );
}
