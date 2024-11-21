"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TrendingUp,
  DollarSign,
  PiggyBank,
  CreditCard,
  Info,
} from "lucide-react";

interface FinancialHealthScoreProps {
  score: number;
  isLoading: boolean;
}

export function FinancialHealthScore({
  score,
  isLoading,
}: FinancialHealthScoreProps) {
  const [showDetails, setShowDetails] = useState(false);

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

  const getScoreDetails = (score: number) => [
    {
      label: "Savings",
      value: score >= 60 ? "On Track" : "Needs Attention",
      icon: PiggyBank,
    },
    {
      label: "Debt",
      value: score >= 70 ? "Manageable" : "High",
      icon: CreditCard,
    },
    {
      label: "Spending",
      value: score >= 50 ? "Controlled" : "Excessive",
      icon: DollarSign,
    },
    {
      label: "Investments",
      value: score >= 80 ? "Diversified" : "Limited",
      icon: TrendingUp,
    },
  ];

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
      <Card className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Financial Health Score
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Your overall financial health based on savings, debt,
                  spending, and investments.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white ${getScoreColor(
              score
            )}`}
          >
            {score}
          </div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-neutral-300">
            {getScoreText(score)}
          </p>
          <Progress value={score} className="w-full mt-4" />
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full mt-4 space-y-2"
            >
              {getScoreDetails(score).map((detail, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <detail.icon className="h-5 w-5 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-neutral-400">
                      {detail.label}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                    {detail.value}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
