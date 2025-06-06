import { useState } from "react";
import { Plus, PieChart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/ExpenseForm";
import { BudgetForm } from "@/components/BudgetForm";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  handleAddExpense: (data: any) => void;
  handleAddBudget: (data: any) => void;
  onToggleSidebar: () => void;
  children?: React.ReactNode;
}

export function Header({
  userName,
  userEmail,
  onLogout,
  handleAddExpense,
  handleAddBudget,
  onToggleSidebar,
  children,
}: HeaderProps) {
  // Modal state management
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="mr-2"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          {/* Add Expense Modal */}
          <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-border">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your new expense below.
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm
                onSubmit={(data) => {
                  handleAddExpense({
                    ...data,
                    amount: parseFloat(data.amount),
                  });
                  setShowExpenseModal(false);
                }}
                onCancel={() => setShowExpenseModal(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Add Budget Modal */}
          <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
            <DialogTrigger asChild>
              <Button
                id="add-budget-trigger"
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
              >
                <PieChart className="mr-2 h-4 w-4" /> Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Set New Budget</DialogTitle>
                <DialogDescription>
                  Enter the details of your new budget below.
                </DialogDescription>
              </DialogHeader>
              <BudgetForm
                onSubmit={(data) => {
                  handleAddBudget({
                    ...data,
                    amount: parseFloat(data.amount),
                    month: parseInt(data.month, 10),
                    year: parseInt(data.year, 10),
                  });
                  setShowBudgetModal(false);
                }}
                onCancel={() => setShowBudgetModal(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </div>
      {children}
    </header>
  );
}
