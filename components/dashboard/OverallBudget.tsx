import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";

interface OverallBudgetProps {
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
  budgetUtilization: number;
}

export function OverallBudget({
  totalBudget,
  totalExpenses,
  remainingBudget,
  budgetUtilization,
}: OverallBudgetProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-bold mb-4 text-foreground">Overall Budget</h3>
      <div className="space-y-4">
        <BudgetItem
          label="Total Budget"
          amount={totalBudget}
          color="text-primary"
        />
        <BudgetItem
          label="Total Expenses"
          amount={totalExpenses}
          color="text-destructive"
        />
        <BudgetItem
          label="Remaining"
          amount={Math.abs(remainingBudget)}
          color={
            remainingBudget >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-destructive"
          }
          icon={
            remainingBudget >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )
          }
        />
      </div>
      <div className="mt-6">
        <Progress
          value={budgetUtilization}
          className={`h-3 rounded-full [&>div]:${
            budgetUtilization > 100
              ? "bg-destructive"
              : budgetUtilization > 75
              ? "bg-warning"
              : "bg-primary"
          }`}
        />
        <p className="text-sm font-medium text-muted-foreground mt-2">
          {budgetUtilization.toFixed(1)}% of budget utilized
        </p>
      </div>
    </div>
  );
}

interface BudgetItemProps {
  label: string;
  amount: number;
  color: string;
  icon?: React.ReactNode;
}

function BudgetItem({ label, amount, color, icon }: BudgetItemProps) {
  return (
    <div className="flex justify-between items-center p-3 bg-background rounded-lg shadow-sm">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className={`text-lg font-bold flex items-center gap-2 ${color}`}>
        ${amount.toFixed(2)}
        {icon}
      </span>
    </div>
  );
}
