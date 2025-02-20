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
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Expense, Budget } from "@/lib/types";

interface BudgetVsActualProps {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
}

export function BudgetVsActual({
  expenses,
  budgets,
  isLoading,
}: BudgetVsActualProps) {
  const comparisonData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    return budgets.map((budget) => {
      const spent = expenses
        .filter(
          (expense) =>
            expense.category === budget.category &&
            new Date(expense.date).getMonth() + 1 === currentMonth &&
            new Date(expense.date).getFullYear() === currentYear
        )
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        category: budget.category,
        budget: budget.amount,
        spent: spent,
      };
    });
  }, [expenses, budgets]);

  if (isLoading) {
    return (
      <Card className="bg-card text-card-foreground shadow-lg">
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/20">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Budget vs Actual
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] transition-transform duration-300 hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Legend />
              <defs>
                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--primary))"
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient id="spentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--secondary))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--secondary))"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <Bar
                dataKey="budget"
                fill="url(#budgetGradient)"
                name="Budget"
                radius={[4, 4, 0, 0]}
                className="transition-all duration-300 hover:opacity-80"
              />
              <Bar
                dataKey="spent"
                fill="url(#spentGradient)"
                name="Spent"
                radius={[4, 4, 0, 0]}
                className="transition-all duration-300 hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
