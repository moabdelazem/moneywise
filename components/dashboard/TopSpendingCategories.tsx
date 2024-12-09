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
      return <ShoppingBag className="h-4 w-4 text-white" />;
    case "food":
      return <Utensils className="h-4 w-4 text-white" />;
    case "transport":
      return <Car className="h-4 w-4 text-white" />;
    case "housing":
      return <Home className="h-4 w-4 text-white" />;
    case "entertainment":
      return <Film className="h-4 w-4 text-white" />;
    default:
      return <MoreHorizontal className="h-4 w-4 text-white" />;
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
      <Card className="bg-card/80 backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[300px]">
          <Skeleton className="h-full w-full rounded-2xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-neutral-50/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl text-card-foreground border border-gray-200/50 dark:border-neutral-800 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="w-full lg:w-1/2 h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="amount"
                    strokeWidth={2}
                  >
                    {topCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                      "Amount",
                    ]}
                    labelFormatter={(label: string) => `Category: ${label}`}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              {topCategories.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transform transition-transform group-hover:scale-110"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                      {getCategoryIcon(category.category)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-semibold">
                          {category.category}
                        </span>
                        <span className="text-sm font-bold">
                          ${category.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                      <Progress
                        value={(category.amount / totalSpending) * 100}
                        className="h-2.5 rounded-full transition-all duration-300 group-hover:h-3"
                        style={{
                          backgroundColor: `${COLORS[index % COLORS.length]}33`,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
