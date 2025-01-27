"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";
import type { Expense } from "@/lib/types";

interface SpendingAnalysisProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function SpendingAnalysis({
  expenses,
  isLoading,
}: SpendingAnalysisProps) {
  const analysisData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get daily totals for current month
    const dailyTotals = expenses.reduce((acc, expense) => {
      const expenseDate = new Date(expense.date);
      if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      ) {
        const day = expenseDate.getDate();
        acc[day] = (acc[day] || 0) + expense.amount;
      }
      return acc;
    }, {} as Record<number, number>);

    // Create daily spending data
    return Object.entries(dailyTotals)
      .map(([day, amount]) => ({
        day: `Day ${day}`,
        amount,
      }))
      .sort(
        (a, b) =>
          Number.parseInt(a.day.split(" ")[1]) -
          Number.parseInt(b.day.split(" ")[1])
      );
  }, [expenses]);

  if (isLoading) {
    return <LoadingState />;
  }

  const totalSpending = analysisData.reduce((sum, day) => sum + day.amount, 0);

  return (
    <Card className="bg-card text-card-foreground shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Daily Spending Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Total Spending: ${totalSpending.toFixed(2)}
        </p>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analysisData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Amount",
                ]}
              />
              <Bar dataKey="amount" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="bg-card text-card-foreground shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Daily Spending Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-48 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}
