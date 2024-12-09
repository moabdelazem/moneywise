"use client";

import { useMemo } from "react";
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
    Legend,
} from "recharts";
import { Expense, Budget } from "@/lib/types";

interface SavingsAnalysisProps {
    expenses: Expense[];
    budgets: Budget[];
    isLoading: boolean;
}

export function SavingsAnalysis({ expenses, budgets, isLoading }: SavingsAnalysisProps) {
    const savingsData = useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return {
                month: date.toLocaleString('default', { month: 'short' }),
                monthNum: date.getMonth() + 1,
                year: date.getFullYear(),
            };
        }).reverse();

        return last6Months.map(({ month, monthNum, year }) => {
            const monthlyBudget = budgets
                .filter(b => b.month === monthNum && b.year === year)
                .reduce((sum, budget) => sum + budget.amount, 0);

            const monthlyExpenses = expenses
                .filter(expense => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate.getMonth() + 1 === monthNum &&
                        expenseDate.getFullYear() === year;
                })
                .reduce((sum, expense) => sum + expense.amount, 0);

            const savings = monthlyBudget - monthlyExpenses;

            return {
                month,
                budget: monthlyBudget,
                expenses: monthlyExpenses,
                savings: Math.max(savings, 0),
            };
        });
    }, [expenses, budgets]);

    if (isLoading) {
        return <Skeleton className="h-[400px] w-full" />;
    }

    return (
        <Card className="bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="border-b border-border/10">
                <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Savings Analysis
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={savingsData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis
                                dataKey="month"
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
                                formatter={(value: number) => [`$${value}`, '']}
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                                wrapperStyle={{
                                    paddingTop: '10px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="budget"
                                name="Budget"
                                stroke="#8884d8"
                                fill="url(#budgetGradient)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="expenses"
                                name="Expenses"
                                stroke="#82ca9d"
                                fill="url(#expensesGradient)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="savings"
                                name="Savings"
                                stroke="#ffc658"
                                fill="url(#savingsGradient)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
} 