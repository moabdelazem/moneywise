"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/lib/types";
import { subDays, format, eachDayOfInterval, startOfDay } from "date-fns";
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
import { TrendingUp } from "lucide-react";

interface SpendingTrendChartProps {
  expenses: Expense[];
  isLoading: boolean;
}

// Helper function to format currency
const formatCurrency = (value: number) => {
  // TODO: Make currency dynamic based on user settings
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

// Helper function to process expense data for the last 30 days
const processData = (expenses: Expense[]) => {
  const endDate = new Date();
  const startDate = subDays(endDate, 29); // Last 30 days including today

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const dailySpending = dateRange.map((date) => ({
    date: format(date, "MMM d"),
    total: 0,
  }));

  expenses.forEach((expense) => {
    try {
        const expenseDate = startOfDay(new Date(expense.date));
        // Filter expenses within the 30-day range
        if (expenseDate >= startDate && expenseDate <= endDate) {
        const formattedDate = format(expenseDate, "MMM d");
        const dayData = dailySpending.find((d) => d.date === formattedDate);
        if (dayData) {
            dayData.total += expense.amount;
        }
        }
    } catch (error) {
        console.error("Error processing expense date:", expense.date, error);
        // Optionally handle the error, e.g., skip this expense
    }
  });

  return dailySpending;
};


export function SpendingTrendChart({
  expenses,
  isLoading,
}: SpendingTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Spending Trend (Last 30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData = processData(expenses);
  const hasData = chartData.some(d => d.total > 0);

  return (
    <Card className="shadow-sm bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl border-opacity-50 border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
           <TrendingUp className="h-5 w-5 text-primary" />
           Spending Trend (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
           <ResponsiveContainer width="100%" height={300}>
             <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
               <defs>
                 <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                   <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
               <XAxis
                 dataKey="date"
                 stroke="hsl(var(--muted-foreground))"
                 fontSize={12}
                 tickLine={false}
                 axisLine={false}
                 interval="preserveStartEnd" // Show start and end dates
                 minTickGap={20} // Adjust gap between ticks
               />
               <YAxis
                 stroke="hsl(var(--muted-foreground))"
                 fontSize={12}
                 tickLine={false}
                 axisLine={false}
                 tickFormatter={(value) => formatCurrency(value)}
                 width={80} // Adjust width for currency formatting
                 domain={[0, 'dataMax + 10']} // Add some padding to the top
               />
               <Tooltip
                 contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--popover-foreground))',
                    boxShadow: 'hsl(var(--shadow))'
                 }}
                 itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                 formatter={(value: number) => [formatCurrency(value), "Spending"]}
                 labelStyle={{ fontWeight: 'bold' }}
               />
               <Line
                 type="monotone"
                 dataKey="total"
                 stroke="hsl(var(--primary))"
                 strokeWidth={2}
                 dot={false}
                 activeDot={{ r: 6, fill: "hsl(var(--background))", stroke: "hsl(var(--primary))" }}
                 // fillOpacity={1} // Disabled area fill for now, can be enabled if desired
                 // fill="url(#colorSpending)"
               />
             </LineChart>
           </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground space-y-3">
            <TrendingUp className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No spending data found</p>
            <p className="text-sm text-center max-w-[300px]">
              Add expenses in the last 30 days to see your spending trend here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 