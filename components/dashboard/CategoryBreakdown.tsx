import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import type { Budget, Expense } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryBreakdownProps {
  budgets: Budget[];
  expenses: Expense[];
  COLORS: string[];
  hoveredCategory: string | null;
  setHoveredCategory: (category: string | null) => void;
}

export function CategoryBreakdown({
  budgets,
  expenses,
  COLORS,
  hoveredCategory,
  setHoveredCategory,
}: CategoryBreakdownProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-foreground">
        Category Breakdown
      </h3>
      <div className="space-y-6">
        {budgets.map((budget, index) => {
          const totalExpensesForCategory = expenses
            .filter((e) => e.category === budget.category)
            .reduce((sum, e) => sum + e.amount, 0);
          const percentage = (totalExpensesForCategory / budget.amount) * 100;

          return (
            <div
              key={budget.id}
              className={`space-y-3 bg-background p-4 rounded-xl shadow-sm transition-opacity duration-300 ${
                hoveredCategory === null || hoveredCategory === budget.category
                  ? "opacity-100"
                  : "opacity-50"
              }`}
              onMouseEnter={() => setHoveredCategory(budget.category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">
                  {budget.category}
                </span>
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-secondary">
                  ${totalExpensesForCategory.toFixed(2)} / $
                  {budget.amount.toFixed(2)}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={percentage}
                  className="h-2.5 rounded-full"
                  style={
                    {
                      "--progress-foreground":
                        percentage > 100
                          ? "var(--destructive)"
                          : percentage > 75
                          ? "var(--warning)"
                          : "var(--primary)",
                    } as React.CSSProperties
                  }
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        style={{ color: COLORS[index % COLORS.length] }}
                      >
                        <Info className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Budget: ${budget.amount.toFixed(2)}</p>
                      <p>Spent: ${totalExpensesForCategory.toFixed(2)}</p>
                      <p>
                        Remaining: $
                        {(budget.amount - totalExpensesForCategory).toFixed(2)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {percentage > 100 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Over Budget</AlertTitle>
                  <AlertDescription>
                    You've exceeded your budget for {budget.category} by
                    <span className="font-semibold">
                      {" "}
                      ${(totalExpensesForCategory - budget.amount).toFixed(2)}
                    </span>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
