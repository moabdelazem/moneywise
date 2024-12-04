"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Expense } from "@/lib/types";

// Motion components for animations
const MotionCard = motion(Card);
const MotionLi = motion.li;

interface LatestExpensesProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function LatestExpenses({ expenses, isLoading }: LatestExpensesProps) {
  // Get 5 most recent expenses for display
  const latestExpenses = expenses.slice(0, 5);

  // Helper function to determine expense icon based on amount
  const getExpenseIcon = (amount: number) => {
    return amount > 100 ? (
      <TrendingUp className="h-4 w-4 text-red-500 dark:text-red-400" />
    ) : (
      <TrendingDown className="h-4 w-4 text-green-500 dark:text-green-400" />
    );
  };

  // Category color mapping for visual distinction
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: "bg-blue-500/20 dark:bg-blue-500/30",
      Transport: "bg-green-500/20 dark:bg-green-500/30",
      Entertainment: "bg-yellow-500/20 dark:bg-yellow-500/30",
      Shopping: "bg-purple-500/20 dark:bg-purple-500/30",
      Bills: "bg-red-500/20 dark:bg-red-500/30",
    };
    return colors[category] || "bg-gray-500/20 dark:bg-gray-500/30";
  };

  // Loading state UI
  if (isLoading) {
    return (
      <MotionCard
        className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 shadow-xl border-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Latest Expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </MotionCard>
    );
  }

  // Empty state UI
  if (expenses.length === 0) {
    return (
      <MotionCard
        className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 shadow-xl border-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Latest Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Expenses</AlertTitle>
            <AlertDescription>
              You haven&apos;t recorded any expenses yet. Start adding expenses
              to see them here.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white">
            Add Your First Expense
          </Button>
        </CardFooter>
      </MotionCard>
    );
  }

  // Main expenses list UI
  return (
    <MotionCard
      className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-800 shadow-xl border-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Latest Expenses
        </CardTitle>
        <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 dark:bg-neutral-800 dark:hover:bg-neutral-700">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <ul className="space-y-4">
            {latestExpenses.map((expense, index) => (
              <MotionLi
                key={expense.id}
                className="flex justify-between items-center p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "p-3 rounded-full",
                      getCategoryColor(expense.category)
                    )}
                  >
                    {getExpenseIcon(expense.amount)}
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                      {expense.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg flex items-center text-gray-900 dark:text-gray-100">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {expense.amount.toFixed(2)}
                  </p>
                </div>
              </MotionLi>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </MotionCard>
  );
}
