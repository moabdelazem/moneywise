import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CSSProperties } from "react";

const MotionCard = motion(Card);

interface BudgetOverviewProps {
  expenses: { category: string; amount: number }[];
  budgets: { id: string; category: string; amount: number }[];
  isLoading: boolean;
  fullWidth?: boolean;
}

export function BudgetOverview({
  expenses,
  budgets,
  isLoading,
  fullWidth = false,
}: BudgetOverviewProps) {
  return (
    <MotionCard
      className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 ${
        fullWidth ? "w-full" : ""
      }`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {budgets.map((budget) => {
              // total expenses for the category
              const totalExpensesForCategory = expenses
                .filter((e) => e.category === budget.category)
                .reduce((sum, e) => sum + e.amount, 0);
              const percentage =
                (totalExpensesForCategory / budget.amount) * 100;
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {budget.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ${totalExpensesForCategory.toFixed(2)} / $
                      {budget.amount.toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    style={
                      {
                        background: percentage > 100 ? "#FCA5A5" : "#E5E7EB",
                        backgroundColor:
                          percentage > 100
                            ? "#EF4444"
                            : percentage > 75
                            ? "#FBBF24"
                            : "#10B981",
                      } as CSSProperties
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </MotionCard>
  );
}
