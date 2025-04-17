"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Calendar, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Expense } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SpendingAnalysisProps {
  expenses: Expense[];
  isLoading: boolean;
}

const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--primary) / 0.8)',
    'hsl(var(--primary) / 0.6)',
    'hsl(var(--primary) / 0.4)',
    'hsl(var(--primary) / 0.2)',
    'hsl(var(--muted-foreground))',
];

export function SpendingAnalysis({
  expenses,
  isLoading,
}: SpendingAnalysisProps) {
  const { analysisData, totalSpending, averageSpending, categoryData } = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const dailyTotals: Record<number, number> = {};
    const categoryTotals: Record<string, number> = {};

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      ) {
        const day = expenseDate.getDate();
        dailyTotals[day] = (dailyTotals[day] || 0) + expense.amount;

        const category = expense.category || 'Uncategorized';
        categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
      }
    });

    const dailyData = Object.entries(dailyTotals)
      .map(([day, amount]) => ({
        day: `Day ${day}`,
        amount,
      }))
      .sort(
        (a, b) =>
          Number.parseInt(a.day.split(" ")[1]) -
          Number.parseInt(b.day.split(" ")[1])
      );

    const total = dailyData.reduce((sum, day) => sum + day.amount, 0);
    const average = dailyData.length > 0 ? total / dailyData.length : 0;

    const categoryChartData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return {
        analysisData: dailyData,
        totalSpending: total,
        averageSpending: average,
        categoryData: categoryChartData
    };
  }, [expenses]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-xl">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          <Calendar className="h-6 w-6 text-primary" />
          Monthly Spending Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground font-medium">
            Total Spending This Month:
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

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="daily">
              <TrendingUp className="mr-2 h-4 w-4" /> Daily Trend
            </TabsTrigger>
            <TabsTrigger value="category">
              <PieChartIcon className="mr-2 h-4 w-4" /> By Category
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <div className="h-[350px] transition-transform duration-300 hover:scale-[1.01]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analysisData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ opacity: 0.2 }}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                    tickFormatter={(value) => `$${value}`}
                    tickLine={false}
                    axisLine={{ opacity: 0.2 }}
                    width={50}
                  />
                  <Tooltip
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      padding: "8px 12px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number, name: string) => [
                      `$${value.toFixed(2)}`,
                      name === 'amount' ? 'Spending' : 'Average',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    animationDuration={1500}
                  />
                  <ReferenceLine
                    y={averageSpending}
                    label={{
                        value: `Avg: $${averageSpending.toFixed(1)}`,
                        position: 'insideTopRight',
                        fill: 'hsl(var(--muted-foreground))',
                        fontSize: 9,
                        dy: -4,
                        dx: -5
                    }}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="2 2"
                    strokeWidth={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="category">
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={110}
                          innerRadius={40}
                          fill="hsl(var(--primary))"
                          dataKey="value"
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                          paddingAngle={1}
                          animationDuration={1000}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background" />
                            ))}
                        </Pie>
                        <Tooltip
                           cursor={{ fill: 'hsl(var(--muted) / 0.3)'}}
                            contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                borderRadius: "8px",
                                border: "1px solid hsl(var(--border))",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                padding: "8px 12px",
                                fontSize: "12px",
                            }}
                            formatter={(value: number, name: string) => [`$${value.toFixed(2)} (${((value / totalSpending) * 100).toFixed(0)}%)`, name]}
                        />
                         <Legend
                            iconSize={10}
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            iconType="circle"
                            wrapperStyle={{ fontSize: '12px', lineHeight: '1.6', color: 'hsl(var(--muted-foreground))', paddingLeft: '10px' }}
                            formatter={(value, entry) => {
                                const { color } = entry;
                                const displayName = value.length > 15 ? value.substring(0, 15) + '...' : value;
                                return <span style={{ color }}>{displayName}</span>;
                             }}
                         />
                    </PieChart>
                </ResponsiveContainer>
             </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="bg-card/80 backdrop-blur-xl border border-border/50">
      <CardHeader className="border-b border-border/10">
        <CardTitle className="text-2xl font-bold flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-6 w-6" />
          Monthly Spending Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
             <Skeleton className="h-5 w-48" />
             <Skeleton className="h-4 w-32" />
        </div>
        <div>
             <Skeleton className="h-10 w-full mb-4" />
             <Skeleton className="h-[350px] w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
