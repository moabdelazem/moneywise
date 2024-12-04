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

const MotionCard = motion(Card);
const MotionLi = motion.li;


interface LatestExpensesProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function LatestExpenses({ expenses, isLoading }: LatestExpensesProps) {
  const latestExpenses = expenses.slice(0, 5); // Get the 5 most recent expenses

  const getExpenseIcon = (amount: number) => {
    return amount > 100 ? (
      <TrendingUp className="h-4 w-4 text-red-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-green-500" />
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
        className="bg-card text-card-foreground shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Latest Expenses</CardTitle>
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

  if (expenses.length === 0) {
    return (
      <MotionCard
        className="bg-card text-card-foreground shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Latest Expenses</CardTitle>
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
        </CardContent>
        <CardFooter>
          <Button className="w-full">Add Your First Expense</Button>
        </CardFooter>
      </MotionCard>
    );
  }

  return (
    <MotionCard
      className="bg-card text-card-foreground shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">Latest Expenses</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <ul className="space-y-4">
            {latestExpenses.map((expense, index) => (
              <MotionLi
                key={expense.id}
                className="flex justify-between items-center p-4 bg-accent rounded-lg transition-colors hover:bg-accent/80"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      getCategoryColor(expense.category)
                    )}
                  >
                    {getExpenseIcon(expense.amount)}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {expense.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg flex items-center">
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
