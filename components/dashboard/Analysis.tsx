"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpendingAnalysis } from "./analysis/SpendingAnalysis";
import { BudgetVsActual } from "./analysis/BudgetVsActual";
import { CategoryTrends } from "./analysis/CategoryTrends";
import { SavingsAnalysis } from "./analysis/SavingsAnalysis";
import { Expense, Budget } from "@/lib/types";

interface AnalysisProps {
    expenses: Expense[];
    budgets: Budget[];
    isLoading: boolean;
}

export function Analysis({ expenses, budgets, isLoading }: AnalysisProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto p-6"
        >
            <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl rounded-xl border-0">
                <CardHeader className="border-b border-border/10 pb-4">
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Financial Analysis Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="grid gap-8"
                    >
                        <div className="grid gap-8 lg:grid-cols-2">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <SpendingAnalysis expenses={expenses} isLoading={isLoading} />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <BudgetVsActual
                                    expenses={expenses}
                                    budgets={budgets}
                                    isLoading={isLoading}
                                />
                            </motion.div>
                        </div>
                        <div className="grid gap-8 lg:grid-cols-2">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CategoryTrends expenses={expenses} isLoading={isLoading} />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <SavingsAnalysis
                                    expenses={expenses}
                                    budgets={budgets}
                                    isLoading={isLoading}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}