"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { Reports } from "@/components/dashboard/Reports";
import { useToast } from "@/hooks/use-toast";
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
import { Plus, PieChart, ArrowLeft } from "lucide-react";
import { LatestExpenses } from "@/components/dashboard/LatestExpense";
import { TopSpendingCategories } from "@/components/dashboard/TopSpendingCategories";
import { FinancialHealthScore } from "@/components/dashboard/FinancialHealthScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MonthlySpendingTrend } from "@/components/dashboard/MonthlySpendingTrend";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const [userResponse, expensesResponse, budgetsResponse] =
        await Promise.all([
          fetch("/api/user", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/expenses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `/api/budgets?month=${
              new Date().getMonth() + 1
            }&year=${new Date().getFullYear()}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

      if (userResponse.ok && expensesResponse.ok && budgetsResponse.ok) {
        const [userData, expensesData, budgetsData] = await Promise.all([
          userResponse.json(),
          expensesResponse.json(),
          budgetsResponse.json(),
        ]);
        setUserName(userData.name);
        setExpenses(expensesData);
        setBudgets(budgetsData);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  const handleAddExpense = useCallback(
    async (newExpense: Omit<Expense, "id">) => {
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
          setExpenses((prevExpenses) => [addedExpense, ...prevExpenses]);
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
    },
    [router, toast]
  );

  const handleAddBudget = useCallback(
    async (newBudget: Omit<Budget, "id">) => {
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
          setBudgets((prevBudgets) => [
            ...prevBudgets.filter((b) => b.category !== addedBudget.category),
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
    },
    [router, toast]
  );

  const checkBudgetLimits = useCallback(
    (newExpense: Expense) => {
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
    },
    [budgets, expenses, toast]
  );

  const calculateFinancialHealthScore = useCallback(() => {
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const savingsRatio = (totalBudget - totalExpenses) / totalBudget;
    const budgetAdherence = expenses.every((expense) => {
      const relevantBudget = budgets.find(
        (b) => b.category === expense.category
      );
      return relevantBudget ? expense.amount <= relevantBudget.amount : true;
    });

    let score = 50; // Base score
    score += savingsRatio * 30; // Up to 30 points for savings
    score += budgetAdherence ? 20 : 0; // 20 points for sticking to budget

    return Math.min(Math.max(Math.round(score), 0), 100); // Ensure score is between 0 and 100
  }, [budgets, expenses]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = useCallback(() => {
    const financialHealthScore = calculateFinancialHealthScore();

    return (
      <Tabs
        defaultValue={activeView}
        onValueChange={(value) => setActiveView(value as typeof activeView)}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="dashboard" className="space-y-6">
          <OverviewCards
            expenses={expenses}
            budgets={budgets}
            isLoading={isLoading}
          />
          <div className="grid gap-6 ">
            <BudgetOverview
              expenses={expenses}
              budgets={budgets}
              isLoading={isLoading}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-1">
            <LatestExpenses expenses={expenses} isLoading={isLoading} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <FinancialHealthScore
              score={financialHealthScore}
              isLoading={isLoading}
            />
            <TopSpendingCategories expenses={expenses} isLoading={isLoading} />
          </div>
        </TabsContent>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensesTable expenses={expenses} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle>Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetOverview
                expenses={expenses}
                budgets={budgets}
                isLoading={isLoading}
                fullWidth
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Reports />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  }, [
    activeView,
    expenses,
    budgets,
    isLoading,
    calculateFinancialHealthScore,
    handleAddExpense,
    handleAddBudget,
  ]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        userName={userName}
        activeView={activeView}
        setActiveView={setActiveView}
        handleLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={userName}
          onLogout={handleLogout}
          handleAddExpense={handleAddExpense}
          handleAddBudget={handleAddBudget}
        ></Header>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
            <ScrollArea className="h-[calc(100vh-theme(spacing.16))]">
              {renderContent()}
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  );
}
