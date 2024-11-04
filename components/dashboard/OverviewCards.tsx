import { motion } from "framer-motion";
import { DollarSign, TrendingUp, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MotionCard = motion(Card);

interface OverviewCardsProps {
  expenses: { amount: number; category: string }[];
  budgets: { id: string; amount: number; category: string }[];
  isLoading: boolean;
}

export function OverviewCards({
  expenses,
  budgets,
  isLoading,
}: OverviewCardsProps) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const chartData = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const existingCategory = acc.find((item) => item.category === category);
    if (existingCategory) {
      existingCategory.amount += expense.amount;
    } else {
      acc.push({ category, amount: expense.amount });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <MotionCard
        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-5 w-5 opacity-70" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-blue-300" />
          ) : (
            <motion.div
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              ${totalExpenses.toFixed(2)}
            </motion.div>
          )}
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-gradient-to-br from-green-500 to-green-600 text-white border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Budget Status</CardTitle>
          <TrendingUp className="h-5 w-5 opacity-70" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-green-300" />
          ) : (
            <motion.div
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {budgets.length > 0 ? "On Track" : "Not Set"}
            </motion.div>
          )}
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Top Category</CardTitle>
          <CreditCard className="h-5 w-5 opacity-70" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-purple-300" />
          ) : (
            <motion.div
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {chartData.length > 0
                ? chartData.reduce((a, b) => (a.amount > b.amount ? a : b))
                    .category
                : "N/A"}
            </motion.div>
          )}
        </CardContent>
      </MotionCard>
      <MotionCard
        className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">This Month</CardTitle>
          <Calendar className="h-5 w-5 opacity-70" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-24 bg-orange-300" />
          ) : (
            <motion.div
              className="text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {new Date().toLocaleString("default", { month: "long" })}
            </motion.div>
          )}
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
