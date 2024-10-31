"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseForm } from "@/components/ExpenseForm";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const MotionCard = motion(Card);

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserDataAndExpenses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const [userResponse, expensesResponse] = await Promise.all([
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
        ]);

        if (userResponse.ok && expensesResponse.ok) {
          const userData = await userResponse.json();
          const expensesData = await expensesResponse.json();
          setUserName(userData.name);
          setExpenses(expensesData);
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
        setShowExpenseForm(false);
      } else {
        throw new Error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        filterCategory === "all" || expense.category === filterCategory
    )
    .filter((expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const chartData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const existingCategory = acc.find((item) => item.category === category);
    if (existingCategory) {
      existingCategory.value += expense.amount;
    } else {
      acc.push({ category, value: expense.amount });
    }
    return acc;
  }, [] as { category: string; value: number }[]);

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header
        className="bg-white shadow"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <Skeleton className="w-48 h-9" />
            ) : (
              `Welcome, ${userName}`
            )}
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </motion.header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MotionCard
              className="w-full max-w-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <motion.div
                    className="text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    ${totalExpenses.toFixed(2)}
                  </motion.div>
                )}
              </CardContent>
            </MotionCard>
            <Button onClick={() => setShowExpenseForm(!showExpenseForm)}>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </motion.div>

          <AnimatePresence>
            {showExpenseForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExpenseForm
                  onSubmit={(data: {
                    date: string;
                    amount: string;
                    description: string;
                    category: string;
                  }) =>
                    handleAddExpense({
                      ...data,
                      amount: parseFloat(data.amount),
                    })
                  }
                  onCancel={() => setShowExpenseForm(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.slice(0, 5).map((expense) => (
                      <motion.div
                        key={expense.id}
                        className="flex justify-between items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {expense.category}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${expense.amount.toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </MotionCard>
          </div>

          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <CardHeader>
              <CardTitle>All Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Transportation">
                      Transportation
                    </SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(value: "date" | "amount") => setSortBy(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Search expenses"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[200px]"
                />
              </div>
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Description</th>
                        <th className="px-6 py-3 text-left">Category</th>
                        <th className="px-6 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((expense, index) => (
                        <motion.tr
                          key={expense.id}
                          className="border-b"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <td className="px-6 py-4">
                            {new Date(expense.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">{expense.description}</td>
                          <td className="px-6 py-4">{expense.category}</td>
                          <td className="px-6 py-4 text-right">
                            ${expense.amount.toFixed(2)}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </CardContent>
          </MotionCard>
        </div>
      </main>
    </div>
  );
}
