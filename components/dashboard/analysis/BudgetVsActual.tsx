"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { Expense, Budget } from "@/lib/types";

interface BudgetVsActualProps {
    expenses: Expense[];
    budgets: Budget[];
    isLoading: boolean;
}

export function BudgetVsActual({ expenses, budgets, isLoading }: BudgetVsActualProps) {
    const comparisonData = useMemo(() => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        return budgets.map(budget => {
            const spent = expenses
                .filter(expense =>
                    expense.category === budget.category &&
                    new Date(expense.date).getMonth() + 1 === currentMonth &&
                    new Date(expense.date).getFullYear() === currentYear
                )
                .reduce((sum, expense) => sum + expense.amount, 0);

            const percentage = (spent / budget.amount) * 100;

            return {
                category: budget.category,
                budget: 100, // Reference line at 100%
                spent: Math.min(percentage, 150), // Allow overspending visualization up to 150%
                remaining: Math.max(100 - percentage, 0),
            };
        });
    }, [expenses, budgets]);

    if (isLoading) {
        return <Skeleton className="h-[400px] w-full" />;
    }

    return (
        <Card className="bg-card/80 backdrop-blur-xl shadow-xl">
            <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={comparisonData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                            <PolarGrid gridType="circle" />
                            <PolarAngleAxis
                                dataKey="category"
                                tick={{ fill: '#888888', fontSize: 12 }}
                                axisLine={{ strokeWidth: 2 }}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 150]}
                                tick={{ fill: '#888888' }}
                                axisLine={{ strokeWidth: 2 }}
                            />
                            <Radar
                                name="Budget Target"
                                dataKey="budget"
                                stroke="#82ca9d"
                                fill="#82ca9d"
                                fillOpacity={0.1}
                                strokeWidth={2}
                            />
                            <Radar
                                name="Spent"
                                dataKey="spent"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => {
                                    if (name === "Budget Target") return ["100%", "Target"];
                                    return [`${value.toFixed(1)}%`, "Spent"];
                                }}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '6px',
                                    padding: '8px',
                                    border: '1px solid #ccc'
                                }}
                            />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: '20px'
                                }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
} 