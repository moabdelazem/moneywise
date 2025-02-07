"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, DollarSign, PlusCircle } from "lucide-react";
import type { Budget, Expense } from "@/lib/types";
import { useState } from "react";
import { AdjustBudgetModal } from "./modals/AdjustBudgetModal";
import { OverallBudget } from "./OverallBudget";
import { ExpenseDistribution } from "./ExpenseDistribution";
import { CategoryBreakdown } from "./CategoryBreakdown";

const MotionCard = motion(Card);

interface BudgetOverviewProps {
  expenses: Expense[];
  budgets: Budget[];
  isLoading: boolean;
  fullWidth?: boolean;
}

export function BudgetOverview({
  expenses,
  budgets,
  isLoading,
  fullWidth = false,
}: BudgetOverviewProps) {
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const totalBudget = budgets
    .filter(
      (budget) => budget.month === currentMonth && budget.year === currentYear
    )
    .reduce((sum, budget) => sum + budget.amount, 0);

  const totalExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() + 1 === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const remainingBudget = totalBudget - totalExpenses;
  const budgetUtilization =
    totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const pieChartData = budgets
    .filter(
      (budget) => budget.month === currentMonth && budget.year === currentYear
    )
    .map((budget) => {
      const expensesForCategory = expenses
        .filter((e) => {
          const expenseDate = new Date(e.date);
          return (
            e.category === budget.category &&
            expenseDate.getMonth() + 1 === currentMonth &&
            expenseDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, e) => sum + e.amount, 0);
      return {
        name: budget.category,
        value: expensesForCategory,
      };
    });

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const chartConfig = {
    expenses: {
      label: "Expenses",
      color: "hsl(var(--chart-1))",
    },
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (budgets.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-background to-secondary/20 rounded-lg p-8">
          <AlertCircle className="w-16 h-16 text-primary mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold mb-3 text-foreground">
            No Budgets Set
          </h3>
          <p className="text-center text-muted-foreground mb-6 max-w-md">
            You haven&apos;t set any budgets yet. Start by adding your first
            budget to track your expenses effectively.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Budget
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OverallBudget
            totalBudget={totalBudget}
            totalExpenses={totalExpenses}
            remainingBudget={remainingBudget}
            budgetUtilization={budgetUtilization}
          />
          <ExpenseDistribution
            pieChartData={pieChartData}
            COLORS={COLORS}
            chartConfig={chartConfig}
            hoveredCategory={hoveredCategory}
            setHoveredCategory={setHoveredCategory}
          />
        </div>
        <CategoryBreakdown
          budgets={budgets}
          expenses={expenses}
          COLORS={COLORS}
          hoveredCategory={hoveredCategory}
          setHoveredCategory={setHoveredCategory}
        />
      </div>
    );
  };

  return (
    <>
      <MotionCard
        className={`bg-background-primary text-card-foreground border-border shadow-lg p-6 ${
          fullWidth ? "w-full" : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Budget Overview</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdjustModalOpen(true)}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Adjust Budget
          </Button>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </MotionCard>

      <AdjustBudgetModal
        open={isAdjustModalOpen}
        onOpenChange={setIsAdjustModalOpen}
        currentBudgets={budgets}
        onBudgetAdjusted={() => {
          window.dispatchEvent(new CustomEvent("refresh-budgets"));
        }}
      />
    </>
  );
}
