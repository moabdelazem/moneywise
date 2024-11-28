"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Film,
  MoreHorizontal,
} from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
}

interface TopSpendingCategoriesProps {
  expenses: Expense[];
  isLoading: boolean;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "shopping":
      return <ShoppingBag className="h-4 w-4" />;
    case "food":
      return <Utensils className="h-4 w-4" />;
    case "transport":
      return <Car className="h-4 w-4" />;
    case "housing":
      return <Home className="h-4 w-4" />;
    case "entertainment":
      return <Film className="h-4 w-4" />;
    default:
      return <MoreHorizontal className="h-4 w-4" />;
  }
};

export function TopSpendingCategories({
  expenses,
  isLoading,
}: TopSpendingCategoriesProps) {
  const { topCategories, totalSpending } = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    const total = sortedCategories.reduce(
      (sum, category) => sum + category.amount,
      0
    );

    return { topCategories: sortedCategories, totalSpending: total };
  }, [expenses]);

  if (isLoading) {
    return (
      <Card className="bg-card backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <Skeleton className="h-full w-full rounded-full" />
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
      <Card className="bg-card backdrop-blur-sm shadow-lg text-card-foreground border border-gray-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="w-full md:w-1/2 h-[200px] mb-4 md:mb-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="amount"
                  >
                    {topCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toFixed(2)}`,
                      "Amount",
                    ]}
                    labelFormatter={(label: string) => `Category: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              {topCategories.map((category, index) => (
                <div key={category.category} className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {getCategoryIcon(category.category)}
                  </div>
                  <div className="flex-grow">
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
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
