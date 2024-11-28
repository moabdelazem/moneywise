"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  date: string;
}

interface MonthlySpendingTrendProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function MonthlySpendingTrend({
  expenses,
  isLoading,
}: MonthlySpendingTrendProps) {
  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString("default", { month: "short" });
    }).reverse();

    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return last6Months.map((month) => ({
      name: month,
      amount: monthlyTotals[month] || 0,
    }));
  }, [expenses]);

  const trend =
    monthlyData[monthlyData.length - 1].amount - monthlyData[0].amount;

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Monthly Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
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
      <Card className="bg-card backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center justify-between">
            Monthly Spending Trend
            {trend > 0 ? (
              <TrendingUp className="h-5 w-5 text-red-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-green-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
