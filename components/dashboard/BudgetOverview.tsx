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

const MotionCard = motion(Card);

interface BudgetOverviewProps {
  expenses: { category: string; amount: number }[];
  budgets: { id: string; category: string; amount: number }[];
  isLoading: boolean;
  fullWidth?: boolean;
}

export function BudgetOverview({
  expenses,
  budgets,
  isLoading,
  fullWidth = false,
}: BudgetOverviewProps) {
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const remainingBudget = totalBudget - totalExpenses;
  const budgetUtilization =
    totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const pieChartData = budgets.map((budget) => {
    const expensesForCategory = expenses
      .filter((e) => e.category === budget.category)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      name: budget.category,
      value: expensesForCategory,
    };
  });

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
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
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    if (budgets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Budgets Set</h3>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
            You haven&apos;t set any budgets yet. Start by adding your first
            budget to track your expenses effectively.
          </p>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Budget
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Overall Budget</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Budget:
              </span>
              <span className="font-medium">${totalBudget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Total Expenses:
              </span>
              <span className="font-medium">${totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Remaining:
              </span>
              <span
                className={`font-medium ${
                  remainingBudget >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                ${Math.abs(remainingBudget).toFixed(2)}
                {remainingBudget >= 0 ? (
                  <TrendingUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="inline ml-1 h-4 w-4" />
                )}
              </span>
            </div>
            <Progress
              value={budgetUtilization}
              className="mt-2"
              style={{
                background: budgetUtilization > 100 ? "#FCA5A5" : "#E5E7EB",
              }}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {budgetUtilization.toFixed(1)}% of budget used
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Expense Distribution</h3>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {pieChartData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div
                    className="w-3 h-3 mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Category Breakdown</h3>
          {budgets.map((budget) => {
            const totalExpensesForCategory = expenses
              .filter((e) => e.category === budget.category)
              .reduce((sum, e) => sum + e.amount, 0);
            const percentage = (totalExpensesForCategory / budget.amount) * 100;
            return (
              <div key={budget.id} className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {budget.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ${totalExpensesForCategory.toFixed(2)} / $
                    {budget.amount.toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  style={{
                    background: percentage > 100 ? "#FCA5A5" : "#E5E7EB",
                    backgroundColor:
                      percentage > 100
                        ? "#EF4444"
                        : percentage > 75
                        ? "#FBBF24"
                        : "#10B981",
                  }}
                />
                {percentage > 100 && (
                  <Alert variant="destructive" className="bg-white/80">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Over Budget</AlertTitle>
                    <AlertDescription>
                      You&apos;ve exceeded your budget for {budget.category} by
                      ${(totalExpensesForCategory - budget.amount).toFixed(2)}.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <MotionCard
      className={`bg-card backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700 ${
        fullWidth ? "w-full" : ""
      }`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Budget Overview</CardTitle>
        <Button variant="outline" size="sm">
          <DollarSign className="mr-2 h-4 w-4" />
          Adjust Budget
        </Button>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </MotionCard>
  );
}
