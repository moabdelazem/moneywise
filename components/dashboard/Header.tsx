import { useState } from "react";
import { Bell, Search, Plus, PieChart, Router } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  children?: React.ReactNode;
}

export function Header({
  userName,
  userEmail,
  onLogout,
  handleAddExpense,
  handleAddBudget,
  children,
}: HeaderProps) {
  // Modal state management
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-4">
          <div
            className="cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <h1 className="text-xl font-bold text-primary hover:text-primary/50 transition-colors">
              MoneyWise
            </h1>
          </div>
        </div>

        {/* Right side - Actions and user menu */}
        <div className="flex flex-1 items-center justify-end space-x-4">
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
                id="add-budget-trigger" // Add this ID
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

          {/* Notifications Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-primary/10"
          >
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full hover:bg-primary/10"
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src="/avatars/01.png" alt={userName} />
                  <AvatarFallback className="bg-primary/10">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/profile")}
                className="cursor-pointer hover:bg-primary/10"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/settings")}
                className="cursor-pointer hover:bg-primary/10"
              >
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {children}
    </header>
  );
}
