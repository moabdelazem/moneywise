"use client";

import { motion } from "framer-motion";
import { ReportsGenerator } from "./reports/ReportsGenerator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Expense, Budget } from "@/lib/types";

interface ReportsProps {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
}

const MotionCard = motion(Card);

export function Reports({ expenses, budgets, isLoading }: ReportsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm"
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Financial Reports</CardTitle>
          <CardDescription>
            Generate and download detailed financial reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportsGenerator expenses={expenses} budgets={budgets} />
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
