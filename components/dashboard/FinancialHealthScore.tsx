"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialHealthScoreProps {
  score: number;
  isLoading: boolean;
}

export function FinancialHealthScore({
  score,
  isLoading,
}: FinancialHealthScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white ${getScoreColor(
              score
            )}`}
          >
            {score}
          </div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            {getScoreText(score)}
          </p>
          <Progress value={score} className="w-full mt-4" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
