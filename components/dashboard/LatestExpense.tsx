"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const MotionCard = motion(Card);

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface LatestExpensesProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function LatestExpenses({ expenses, isLoading }: LatestExpensesProps) {
  const latestExpenses = expenses.slice(0, 5); // Get the 5 most recent expenses

  const getExpenseIcon = (amount: number) => {
    return amount > 100 ? (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-green-500" />
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Food: "bg-blue-500",
      Transport: "bg-green-500",
      Entertainment: "bg-yellow-500",
      Shopping: "bg-purple-500",
      Bills: "bg-red-500",
    };
    return colors[category] || "bg-gray-500";
  };

  if (isLoading) {
    return (
      <MotionCard
        className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Latest Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} className="w-full h-16 mb-4" />
          ))}
        </CardContent>
      </MotionCard>
    );
  }

  if (expenses.length === 0) {
    return (
      <MotionCard
        className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Latest Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Expenses</AlertTitle>
            <AlertDescription>
              You haven&apos;t recorded any expenses yet. Start adding expenses
              to see them here.
            </AlertDescription>
          </Alert>
          <Button className="w-full mt-4">Add Your First Expense</Button>
        </CardContent>
      </MotionCard>
    );
  }

  return (
    <MotionCard
      className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Latest Expenses</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <ul className="space-y-4">
            {latestExpenses.map((expense) => (
              <motion.li
                key={expense.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getExpenseIcon(expense.amount)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-neutral-100">
                      {expense.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="secondary"
                        className={`${getCategoryColor(
                          expense.category
                        )} text-white`}
                      >
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-neutral-400 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-neutral-100 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {expense.amount.toFixed(2)}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </MotionCard>
  );
}
