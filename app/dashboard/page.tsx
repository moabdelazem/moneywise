"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { ExpensesChart } from "@/components/dashboard/ExpensesChart";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { Reports } from "@/components/dashboard/Reports";
import { toast } from "@/hooks/use-toast";
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
import { Button } from "@/components/ui/button";
import { Plus, PieChart as PieChartIcon } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface Budget {
  id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [activeView, setActiveView] = useState<
    "dashboard" | "expenses" | "budgets" | "reports"
  >("dashboard");
  const router = useRouter();

  useEffect(() => {
    const fetchUserDataAndExpenses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [userResponse, expensesResponse, budgetsResponse] =
          await Promise.all([
            fetch("/api/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch("/api/expenses", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(
              `/api/budgets?month=${
                new Date().getMonth() + 1
              }&year=${new Date().getFullYear()}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        if (userResponse.ok && expensesResponse.ok && budgetsResponse.ok) {
          const userData = await userResponse.json();
          const expensesData = await expensesResponse.json();
          const budgetsData = await budgetsResponse.json();
          setUserName(userData.name);
          setExpenses(expensesData);
          setBudgets(budgetsData);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndExpenses();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleAddExpense = async (newExpense: Omit<Expense, "id">) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      });

      if (response.ok) {
        const addedExpense = await response.json();
        setExpenses([addedExpense, ...expenses]);
        setShowExpenseModal(false);
        checkBudgetLimits(addedExpense);
        toast({
          title: "Expense added",
          description: "Your expense has been successfully added.",
        });
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error adding expense",
        description:
          "There was an error adding your expense. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddBudget = async (newBudget: Omit<Budget, "id">) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBudget),
      });

      if (response.ok) {
        const addedBudget = await response.json();
        setBudgets([
          ...budgets.filter((b) => b.category !== addedBudget.category),
          addedBudget,
        ]);
        setShowBudgetModal(false);
        toast({
          title: "Budget set",
          description: "Your budget has been successfully set.",
        });
      } else {
        throw new Error("Failed to add budget");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      toast({
        title: "Error setting budget",
        description:
          "There was an error setting your budget. Please try again.",
        variant: "destructive",
      });
    }
  };

  const checkBudgetLimits = (newExpense: Expense) => {
    const relevantBudget = budgets.find(
      (b) => b.category === newExpense.category
    );
    if (relevantBudget) {
      const totalExpenses =
        expenses
          .filter((e) => e.category === newExpense.category)
          .reduce((sum, e) => sum + e.amount, 0) + newExpense.amount;

      if (totalExpenses > relevantBudget.amount * 0.9) {
        toast({
          title: "Budget Alert",
          description: `You've spent over 90% of your ${newExpense.category} budget for this month.`,
          variant: "destructive",
        });
      }
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <>
            <OverviewCards
              expenses={expenses}
              budgets={budgets}
              isLoading={isLoading}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <ExpensesChart expenses={expenses} isLoading={isLoading} />
              <BudgetOverview
                expenses={expenses}
                budgets={budgets}
                isLoading={isLoading}
              />
            </div>
          </>
        );
      case "expenses":
        return <ExpensesTable expenses={expenses} isLoading={isLoading} />;
      case "budgets":
        return (
          <BudgetOverview
            expenses={expenses}
            budgets={budgets}
            isLoading={isLoading}
            fullWidth
          />
        );
      case "reports":
        return <Reports />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Sidebar
        userName={userName}
        activeView={activeView}
        setActiveView={setActiveView}
        handleLogout={handleLogout}
      />

      <main className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Header>
          <Dialog open={showExpenseModal} onOpenChange={setShowExpenseModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your new expense below.
                </DialogDescription>
              </DialogHeader>
              <ExpenseForm
                onSubmit={(data) =>
                  handleAddExpense({
                    ...data,
                    amount: parseFloat(data.amount),
                  })
                }
                onCancel={() => setShowExpenseModal(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showBudgetModal} onOpenChange={setShowBudgetModal}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <PieChartIcon className="mr-2 h-4 w-4" /> Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set New Budget</DialogTitle>
                <DialogDescription>
                  Enter the details of your new budget below.
                </DialogDescription>
              </DialogHeader>
              <BudgetForm
                onSubmit={(data) =>
                  handleAddBudget({
                    ...data,
                    amount: parseFloat(data.amount),
                    month: parseInt(data.month, 10),
                    year: parseInt(data.year, 10),
                  })
                }
                onCancel={() => setShowBudgetModal(false)}
              />
            </DialogContent>
          </Dialog>
        </Header>

        {renderContent()}
      </main>
    </div>
  );
}
