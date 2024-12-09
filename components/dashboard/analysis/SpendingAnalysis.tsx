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
    Legend,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Expense } from "@/lib/types";

interface SpendingAnalysisProps {
    expenses: Expense[];
    isLoading: boolean;
}

export function SpendingAnalysis({ expenses, isLoading }: SpendingAnalysisProps) {
    const analysisData = useMemo(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Get daily totals for current month
        const dailyTotals = expenses.reduce((acc, expense) => {
            const expenseDate = new Date(expense.date);
            if (expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear) {
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
                average: 0, // Will be calculated after
            }))
            .sort((a, b) => parseInt(a.day.split(' ')[1]) - parseInt(b.day.split(' ')[1]))
            .map((entry, _, array) => {
                const totalSpending = array.reduce((sum, day) => sum + day.amount, 0);
                return {
                    ...entry,
                    average: totalSpending / array.length,
                };
            });
    }, [expenses]);

    if (isLoading) {
        return <Skeleton className="h-[400px] w-full" />;
    }

    const totalSpending = analysisData.reduce((sum, day) => sum + day.amount, 0);
    const averageSpending = totalSpending / analysisData.length;
    const trend = analysisData.length > 1
        ? analysisData[analysisData.length - 1].amount - analysisData[0].amount
        : 0;

    return (
        <Card className="bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-border/10">
                <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 flex items-center justify-between">
                    Daily Spending Analysis
                    {trend > 0 ? (
                        <TrendingUp className="h-5 w-5 text-red-500" />
                    ) : (
                        <TrendingDown className="h-5 w-5 text-green-500" />
                    )}
                </CardTitle>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Total: ${totalSpending.toFixed(2)}</span>
                    <span className="font-medium">Average: ${averageSpending.toFixed(2)}/day</span>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analysisData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                                dataKey="day"
                                stroke="#888888"
                                tick={{ fill: '#888888', fontSize: 12 }}
                            />
                            <YAxis
                                stroke="#888888"
                                tick={{ fill: '#888888', fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                            />
                            <Legend />
                            <Bar
                                name="Daily Spending"
                                dataKey="amount"
                                fill="url(#colorAmount)"
                                stroke="#8884d8"
                                strokeWidth={1}
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                name="Average"
                                dataKey="average"
                                fill="none"
                                stroke="#ff7300"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
} 