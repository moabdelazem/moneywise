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
import { LatestExpenses } from "@/components/dashboard/LatestExpense";
import { TopSpendingCategories } from "@/components/dashboard/TopSpendingCategories";
import { FinancialHealthScore } from "@/components/dashboard/FinancialHealthScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Budget } from "@/lib/types";
import { Expense } from "@/lib/types";


export default function Dashboard() {
  // State variables
  // User name State
  const [userName, setUserName] = useState<string>("");
  // Expenses State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  // Budgets State
  const [budgets, setBudgets] = useState<Budget[]>([]);
  // Loading State
  const [isLoading, setIsLoading] = useState(true);
  // Active View State
  const [activeView, setActiveView] = useState<
    "dashboard" | "expenses" | "budgets" | "reports"
  >("dashboard");
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Router Hook to navigate between pages
  const router = useRouter();
  // Toast Hook to show toast notifications
  const { toast } = useToast();

  /**
   * Fetches user, expenses, and budgets data from the server.
   * If the token is not found in local storage, redirects to the login page.
   * If the fetch requests are successful, updates the state with the fetched data.
   * If any fetch request fails, logs the error, shows a toast notification, and redirects to the login page.
   *
   * @async
   * @function fetchData
   * @returns {Promise<void>} A promise that resolves when the data fetching is complete.
   */
  const fetchData = useCallback(async () => {
    // Retrieve the authentication token from local storage
    const token = localStorage.getItem("token");
    // Redirect to the login page if the token is not found
    if (!token) {
      router.push("/login");
      return;
    }

    // Send requests to fetch user, expenses, and budgets data
    try {
      // Send a request to fetch user data
      const [userResponse, expensesResponse, budgetsResponse] =
        // Fetch user data
        await Promise.all([
          // Fetch user data
          fetch("/api/user", { headers: { Authorization: `Bearer ${token}` } }),
          // Fetch expenses data
          fetch("/api/expenses", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // Fetch budgets data
          fetch(
            `/api/budgets?month=${new Date().getMonth() + 1
            }&year=${new Date().getFullYear()}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

      // Check if all requests were successful
      if (userResponse.ok && expensesResponse.ok && budgetsResponse.ok) {
        // Parse the response JSON data
        const [userData, expensesData, budgetsData] = await Promise.all([
          userResponse.json(),
          expensesResponse.json(),
          budgetsResponse.json(),
        ]);
        // Update the state with the fetched data
        setUserName(userData.name);
        setExpenses(expensesData);
        setBudgets(budgetsData);
      } else {
        // Throw an error if any request fails
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      // Log the error to the console
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

  // Fetch user data, expenses, and budgets on initial render
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handles the logout action by removing the authentication token from local storage and redirecting to the login page.
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  /**
   * Handles the addition of a new expense.
   *
   * This function is wrapped in a `useCallback` hook to memoize it and prevent unnecessary re-renders.
   * It retrieves the authentication token from local storage and sends a POST request to the `/api/expenses` endpoint
   * with the new expense data. If the request is successful, the new expense is added to the state, the expense modal
   * is closed, budget limits are checked, and a success toast notification is shown. If the request fails, an error
   * toast notification is shown.
   *
   * @param {Omit<Expense, "id">} newExpense - The new expense data, excluding the `id` field.
   *
   * @throws Will throw an error if the request to add the expense fails.
   */
  const handleAddExpense = useCallback(
    async (newExpense: Omit<Expense, "id">) => {
      // Retrieve the authentication token from local storage
      const token = localStorage.getItem("token");
      // Redirect to the login page if the token is not found
      if (!token) {
        router.push("/login");
        return;
      }

      // Send a POST request to add the new expense
      try {
        // Send a POST request to the `/api/expenses` endpoint
        const response = await fetch("/api/expenses", {
          method: "POST",
          // Include the authentication token in the request headers
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Convert the new expense object to a JSON string and include it in the request body
          body: JSON.stringify(newExpense),
        });

        // Check if the request was successful
        if (response.ok) {
          // Parse the response JSON data to get the added expense
          const addedExpense = await response.json();
          // Update the expenses state by adding the new expense
          setExpenses((prevExpenses) => [addedExpense, ...prevExpenses]);
          // Check the budget limits for the new expense
          checkBudgetLimits(addedExpense);
          toast({
            title: "Expense added",
            description: "Your expense has been successfully added.",
          });
        } else {
          throw new Error("Failed to add expense");
        }
      } catch (error) {
        // Log the error to the console
        console.error("Error adding expense:", error);
        // Show an error toast notification
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

  /**
   * Handles the addition of a new budget.
   *
   * This function uses a callback to asynchronously add a new budget by sending a POST request
   * to the `/api/budgets` endpoint. It retrieves the authentication token from local storage
   * and includes it in the request headers. If the token is not found, the user is redirected
   * to the login page.
   *
   * On successful addition of the budget, the new budget is added to the state, the budget modal
   * is closed, and a success toast notification is displayed. If the addition fails, an error
   * toast notification is displayed.
   *
   * @param {Omit<Budget, "id">} newBudget - The new budget to be added, excluding the `id` property.
   */
  const handleAddBudget = useCallback(
    async (newBudget: Omit<Budget, "id">) => {
      // Retrieve the authentication token from local storage
      const token = localStorage.getItem("token");
      // Redirect to the login page if the token is not found
      // ? This is Not The Best Practice but it's okay for now
      if (!token) {
        router.push("/login");
        return;
      }

      // Send a POST request to add the new budget
      try {
        // Send a POST request to the `/api/budgets` endpoint
        const response = await fetch("/api/budgets", {
          method: "POST",
          headers: {
            // Include the authentication token in the request headers
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Convert the new budget object to a JSON string and include it in the request body
          body: JSON.stringify(newBudget),
        });

        // Check if the request was successful
        if (response.ok) {
          // Parse the response JSON data to get the added budget
          const addedBudget = await response.json();
          // Update the budgets state by adding the new budget
          setBudgets((prevBudgets) => [
            ...prevBudgets.filter((b) => b.category !== addedBudget.category),
            addedBudget,
          ]);
          // Show a success toast notification
          toast({
            title: "Budget set",
            description: "Your budget has been successfully set.",
          });
        } else {
          // Throw an error if the request failed
          throw new Error("Failed to add budget");
        }
      } catch (error) {
        // Log the error to the console
        console.error("Error adding budget:", error);
        // Show an error toast notification
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

  /**
   * Checks if the new expense exceeds 90% of the relevant budget limit and shows a toast notification if it does.
   *
   * @param {Expense} newExpense - The new expense to be checked against the budget limits.
   *
   * @returns {void}
   *
   * @callback
   *
   * @example
   * const newExpense = { category: 'Food', amount: 50 };
   * checkBudgetLimits(newExpense);
   *
   * @remarks
   * This function uses the `budgets` and `expenses` arrays to find the relevant budget and calculate the total expenses for the given category.
   * If the total expenses exceed 90% of the budget amount, a toast notification is displayed with a warning message.
   */
  const checkBudgetLimits = useCallback(
    (newExpense: Expense) => {
      // Find the relevant budget for the new expense
      const relevantBudget = budgets.find(
        (b) => b.category === newExpense.category
      );
      // Calculate the total expenses for the given category
      if (relevantBudget) {
        // Filter expenses by category and calculate the total amount
        const totalExpenses =
          expenses
            .filter((e) => e.category === newExpense.category)
            .reduce((sum, e) => sum + e.amount, 0) + newExpense.amount;

        // Show a toast notification if the total expenses exceed 90% of the budget amount
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

  /**
   * Calculates the financial health score based on the provided budgets and expenses.
   *
   * The score is calculated as follows:
   * - A base score of 50 points.
   * - Up to 30 additional points based on the savings ratio, which is the proportion of the budget that remains after expenses.
   * - 20 additional points if all expenses adhere to their respective budgets.
   *
   * The final score is constrained to be between 0 and 100.
   *
   * @returns {number} The calculated financial health score.
   */
  const calculateFinancialHealthScore = useCallback(() => {
    // Only consider current month's budgets and expenses
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const currentBudgets = budgets.filter(
      budget => budget.month === currentMonth && budget.year === currentYear
    );

    const currentExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear();
    });

    // Calculate total budget and expenses for current month
    const totalBudget = currentBudgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalExpenses = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Base score starts at 50
    let score = 50;

    // Calculate savings ratio (up to 30 points)
    if (totalBudget > 0) {
      const savingsRatio = (totalBudget - totalExpenses) / totalBudget;
      score += Math.max(0, savingsRatio * 30); // Prevent negative points
    }

    // Check budget adherence by category (up to 20 points)
    const categoryAdherence = currentBudgets.map(budget => {
      const categoryExpenses = currentExpenses
        .filter(expense => expense.category === budget.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return categoryExpenses <= budget.amount;
    });

    const adherenceRatio = categoryAdherence.filter(Boolean).length / categoryAdherence.length;
    score += adherenceRatio * 20;

    // Add bonus points for consistent savings (up to 10 points)
    if (totalBudget > 0 && totalExpenses < totalBudget * 0.8) {
      score += 10;
    }

    // Penalize for overspending (up to -10 points)
    if (totalBudget > 0 && totalExpenses > totalBudget) {
      score -= Math.min(10, ((totalExpenses - totalBudget) / totalBudget) * 10);
    }

    return Math.min(Math.max(Math.round(score), 0), 100);
  }, [budgets, expenses]);

  const renderContent = useCallback(() => {
    // Calculate the financial health score
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
          <ExpensesTable expenses={expenses} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="budgets">
          <CardContent>
            <BudgetOverview
              expenses={expenses}
              budgets={budgets}
              isLoading={isLoading}
              fullWidth
            />
          </CardContent>
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
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
