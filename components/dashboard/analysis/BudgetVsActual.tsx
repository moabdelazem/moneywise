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
    <Card className="bg-card text-card-foreground shadow-lg">
      <CardHeader>
        <CardTitle>Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
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
              <Bar dataKey="budget" fill="hsl(var(--primary))" name="Budget" />
              <Bar dataKey="spent" fill="hsl(var(--secondary))" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
