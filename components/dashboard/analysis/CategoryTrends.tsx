"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Expense } from "@/lib/types";

interface CategoryTrendsProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function CategoryTrends({ expenses, isLoading }: CategoryTrendsProps) {
  const trendData = useMemo(() => {
    const last3Months = Array.from({ length: 3 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleString("default", { month: "short" });
    }).reverse();

    const categories = Array.from(new Set(expenses.map((e) => e.category)));

    return last3Months.map((month) => {
      const monthData: any = { month };
      categories.forEach((category) => {
        const total = expenses
          .filter((expense) => {
            const expenseMonth = new Date(expense.date).toLocaleString(
              "default",
              { month: "short" }
            );
            return expenseMonth === month && expense.category === category;
          })
          .reduce((sum, expense) => sum + expense.amount, 0);
        monthData[category] = total;
      });
      return monthData;
    });
  }, [expenses]);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const categories = Array.from(new Set(expenses.map((e) => e.category)));
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c"];

  return (
    <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-primary/20">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Category Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] transition-transform duration-300 hover:scale-[1.02]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                {categories.map((category, index) => (
                  <linearGradient
                    key={category}
                    id={`color${category}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={colors[index % colors.length]}
                      stopOpacity={0.6}
                    />
                    <stop
                      offset="95%"
                      stopColor={colors[index % colors.length]}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderRadius: "6px",
                  border: "none",
                }}
              />
              <Legend />
              {categories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={colors[index % colors.length]}
                  fillOpacity={1}
                  fill={`url(#color${category})`}
                  strokeWidth={2}
                  className="transition-opacity duration-300 hover:opacity-80"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
