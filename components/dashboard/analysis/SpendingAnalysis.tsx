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
    <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/20">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          <Calendar className="h-6 w-6 text-primary animate-pulse" />
          Daily Spending Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground font-medium">
            Total Spending:
            <span className="ml-2 text-lg font-bold text-primary">
              ${totalSpending.toFixed(2)}
            </span>
          </p>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="h-[300px] transition-transform duration-300 hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analysisData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.9}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <filter id="shadow" height="200%">
                  <feDropShadow
                    dx="0"
                    dy="4"
                    stdDeviation="8"
                    floodOpacity="0.2"
                  />
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.2}
              />
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickLine={false}
                axisLine={{ opacity: 0.3 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                tickLine={false}
                axisLine={{ opacity: 0.3 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(200, 200, 200, 0.1)" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                }}
                formatter={(value: number) => [
                  `$${value.toFixed(2)}`,
                  "Amount",
                ]}
              />
              <Bar
                dataKey="amount"
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                className="transition-all duration-300 hover:opacity-80"
                animationDuration={2000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/20">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          <Calendar className="h-6 w-6 text-primary" />
          Daily Spending Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Skeleton className="h-4 w-48 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
}
