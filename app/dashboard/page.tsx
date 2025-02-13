"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/Header";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { BudgetOverview } from "@/components/dashboard/BudgetOverview";
import { ExpensesTable } from "@/components/dashboard/ExpensesTable";
import { Reports } from "@/components/dashboard/Reports";
import { useToast } from "@/hooks/use-toast";
import { LatestExpenses } from "@/components/dashboard/LatestExpense";
import { TopSpendingCategories } from "@/components/dashboard/TopSpendingCategories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Budget, Expense } from "@/lib/types";
import { Analysis } from "@/components/dashboard/Analysis";
import { Category, Reminder } from "@prisma/client";
import { PaymentReminder } from "@/components/dashboard/PaymentReminder";
import { verifyToken } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function Dashboard() {
  // State Management
  const [dashboardState, setDashboardState] = useState({
    userName: "",
    userEmail: "",
    expenses: [] as Expense[],
    budgets: [] as Budget[],
    isLoading: true,
    activeView: "dashboard" as
      | "dashboard"
      | "expenses"
      | "budgets"
      | "reports"
      | "analysis",
    reminders: [] as Reminder[],
    isSidebarOpen: false,
  });

  // Hooks
  const router = useRouter();
  const { toast } = useToast();

  // Data Fetching
  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const endpoints = [
        { url: "/api/user", name: "user" },
        { url: "/api/expenses", name: "expenses" },
        {
          url: `/api/budgets?month=${
            new Date().getMonth() + 1
          }&year=${new Date().getFullYear()}`,
          name: "budgets",
        },
        { url: "/api/reminders", name: "reminders" },
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(endpoint.url, { headers: { Authorization: `Bearer ${token}` } })
        )
      );

      if (responses.every((res) => res.ok)) {
        const [userData, expensesData, budgetsData, remindersData] =
          await Promise.all(responses.map((res) => res.json()));

        setDashboardState((prev) => ({
          ...prev,
          userName: userData.name,
          userEmail: userData.email,
          expenses: expensesData,
          budgets: budgetsData,
          reminders: remindersData,
          isLoading: false,
        }));
      } else {
        throw new Error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [router, toast]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
          setDashboardState((prev) => ({
            ...prev,
            expenses: [addedExpense, ...prev.expenses],
          }));
          checkBudgetLimits(addedExpense);
          toast({
            title: "Success",
            description: "Expense added successfully",
          });
        } else {
          throw new Error("Failed to add expense");
        }
      } catch (error) {
        console.error("Add expense error:", error);
        toast({
          title: "Error",
          description: "Failed to add expense. Please try again.",
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
          setDashboardState((prev) => ({
            ...prev,
            budgets: [
              ...prev.budgets.filter(
                (b) => b.category !== addedBudget.category
              ),
              addedBudget,
            ],
          }));
          toast({
            title: "Success",
            description: "Budget set successfully",
          });
        } else {
          throw new Error("Failed to add budget");
        }
      } catch (error) {
        console.error("Add budget error:", error);
        toast({
          title: "Error",
          description: "Failed to set budget. Please try again.",
          variant: "destructive",
        });
      }
    },
    [router, toast]
  );

  const checkBudgetLimits = useCallback(
    (newExpense: Expense) => {
      const { budgets, expenses } = dashboardState;
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
            description: `You've exceeded 90% of your ${newExpense.category} budget`,
            variant: "destructive",
          });
        }
      }
    },
    [dashboardState, toast]
  );

  const handleAddReminder = useCallback(
    async (newReminder: Omit<Reminder, "id">) => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const { userId } = await verifyToken(token);
        const response = await fetch("/api/reminders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...newReminder,
            userId,
            status: "PENDING",
            lastSent: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            frequency: newReminder.frequency || null,
          }),
        });

        if (response.ok) {
          const addedReminder = await response.json();
          setDashboardState((prev) => ({
            ...prev,
            reminders: [...prev.reminders, addedReminder],
          }));
          toast({
            title: "Success",
            description: "Payment reminder set successfully",
          });
        } else {
          throw new Error("Failed to add reminder");
        }
      } catch (error) {
        console.error("Add reminder error:", error);
        toast({
          title: "Error",
          description: "Failed to set reminder. Please try again.",
          variant: "destructive",
        });
      }
    },
    [router, toast]
  );

  const handleUpdateReminder = useCallback(
    async (id: string, status: string) => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/reminders", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, status }),
        });

        if (response.ok) {
          setDashboardState((prev) => ({
            ...prev,
            reminders: prev.reminders.map((reminder) =>
              reminder.id === id ? { ...reminder, status } : reminder
            ),
          }));
          toast({
            title: "Success",
            description: "Reminder updated successfully",
          });
        } else {
          throw new Error("Failed to update reminder");
        }
      } catch (error) {
        console.error("Update reminder error:", error);
        toast({
          title: "Error",
          description: "Failed to update reminder. Please try again.",
          variant: "destructive",
        });
      }
    },
    [router, toast]
  );

  const handleTabChange = useCallback((value: string) => {
    setDashboardState((prev) => ({
      ...prev,
      activeView: value as typeof prev.activeView,
    }));
    // Update URL without full page refresh
    window.history.pushState({}, "", `/dashboard?view=${value}`);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setDashboardState((prev) => ({
      ...prev,
      isSidebarOpen: !prev.isSidebarOpen,
    }));
  }, []);

  const renderDashboardContent = useCallback(() => {
    const { activeView, expenses, budgets, reminders, isLoading } =
      dashboardState;

    const handleAddBudgetClick = () => {
      // Find and click the add budget button in the header
      const addBudgetButton = document.getElementById("add-budget-trigger");
      if (addBudgetButton) {
        addBudgetButton.click();
      }
    };

    return (
      <div className="space-y-6">
        {activeView === "dashboard" && (
          <>
            <OverviewCards
              expenses={expenses}
              budgets={budgets}
              isLoading={isLoading}
            />
            <div className="grid gap-6">
              <BudgetOverview
                expenses={expenses}
                budgets={budgets}
                isLoading={isLoading}
                onAddBudget={handleAddBudgetClick}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <PaymentReminder
                reminders={reminders.map((r) => ({
                  id: r.id,
                  title: r.title,
                  amount: r.amount,
                  dueDate: r.dueDate,
                  category: r.category,
                  status: r.status,
                  isRecurring: r.isRecurring,
                  frequency: r.frequency || undefined,
                }))}
                isLoading={isLoading}
                onAddReminder={async (reminder) => {
                  const newReminder = {
                    ...reminder,
                    userId: "",
                    lastSent: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    frequency: reminder.frequency || null,
                  };
                  await handleAddReminder({
                    ...newReminder,
                    category: reminder.category as Category,
                    status: "PENDING",
                  });
                }}
                onUpdateReminder={handleUpdateReminder}
              />
              <TopSpendingCategories
                expenses={expenses}
                isLoading={isLoading}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-1">
              <LatestExpenses
                expenses={expenses}
                isLoading={isLoading}
                onAddExpense={() => {
                  // Open add expense dialog
                  document.getElementById("add-expense-trigger")?.click();
                }}
              />
            </div>
          </>
        )}
        {activeView === "expenses" && (
          <ExpensesTable expenses={expenses} isLoading={isLoading} />
        )}
        {activeView === "budgets" && (
          <BudgetOverview
            expenses={expenses}
            budgets={budgets}
            isLoading={isLoading}
            fullWidth
            onAddBudget={handleAddBudgetClick}
          />
        )}
        {activeView === "analysis" && (
          <Analysis
            expenses={expenses}
            budgets={budgets}
            isLoading={isLoading}
          />
        )}
        {activeView === "reports" && (
          <Reports
            expenses={expenses}
            budgets={budgets}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  }, [dashboardState, handleAddReminder, handleUpdateReminder]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeView={dashboardState.activeView}
        onViewChange={handleTabChange}
        isSidebarOpen={dashboardState.isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={dashboardState.userName}
          userEmail={dashboardState.userEmail}
          onLogout={handleLogout}
          handleAddExpense={handleAddExpense}
          handleAddBudget={handleAddBudget}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6 px-4 md:px-6 lg:px-8">
            {dashboardState.isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="loader"></div>
              </div>
            ) : (
              renderDashboardContent()
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
