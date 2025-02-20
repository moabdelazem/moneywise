"use client";

import { motion } from "framer-motion";
import { ReportsGenerator } from "./reports/ReportsGenerator";
import { Expense, Budget } from "@/lib/types";

interface ReportsProps {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
}

export function Reports({ expenses, budgets, isLoading }: ReportsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <ReportsGenerator expenses={expenses} budgets={budgets} />
    </motion.div>
  );
}
