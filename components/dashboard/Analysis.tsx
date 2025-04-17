"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { SpendingAnalysis } from "./analysis/SpendingAnalysis";
import { BudgetVsActual } from "./analysis/BudgetVsActual";
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
            className="container mx-auto p-4 md:p-6"
        >
            <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg shadow-2xl rounded-xl border-0 overflow-hidden">
                <CardHeader className="border-b border-border/10 pb-4 flex flex-row items-center space-x-3">
                    <BarChart className="h-6 w-6 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            Financial Analysis Dashboard
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Visualize your spending, budget adherence, trends, and savings.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                        >
                            <Card className="h-full bg-card/80 backdrop-blur-sm border-border/10 shadow-lg">
                                <SpendingAnalysis expenses={expenses} isLoading={isLoading} />
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                        >
                            <Card className="h-full bg-card/80 backdrop-blur-sm border-border/10 shadow-lg">
                                <BudgetVsActual expenses={expenses} budgets={budgets} isLoading={isLoading} />
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                            className="lg:col-span-2"
                        >
                            <Card className="h-full bg-card/80 backdrop-blur-sm border-border/10 shadow-lg">
                                <SavingsAnalysis expenses={expenses} budgets={budgets} isLoading={isLoading} />
                            </Card>
                        </motion.div>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}