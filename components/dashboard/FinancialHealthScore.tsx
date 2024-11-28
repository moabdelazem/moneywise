"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertCircle,
} from "lucide-react";

// FinancialHealthScore TypeScript interface
interface FinancialHealthScoreProps {
  score: number | null;
  isLoading: boolean;
}

export function FinancialHealthScore({
  score,
  isLoading,
}: FinancialHealthScoreProps) {
  // State variable to toggle showing the details
  const [showDetails, setShowDetails] = useState(false);

  // Get the color of the score based on the score value
  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-400";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get the text for the score based on the score value
  const getScoreText = (score: number | null) => {
    if (score === null) return "Not Available";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  // Get the details for the score based on the score value
  const getScoreDetails = (score: number | null) => [
    {
      label: "Savings",
      value:
        score === null ? "N/A" : score >= 60 ? "On Track" : "Needs Attention",
      icon: PiggyBank,
    },
    {
      label: "Debt",
      value: score === null ? "N/A" : score >= 70 ? "Manageable" : "High",
      icon: CreditCard,
    },
    {
      label: "Spending",
      value: score === null ? "N/A" : score >= 50 ? "Controlled" : "Excessive",
      icon: DollarSign,
    },
    {
      label: "Investments",
      value: score === null ? "N/A" : score >= 80 ? "Diversified" : "Limited",
      icon: TrendingUp,
    },
  ];

  // Check if the component is in a loading state
  if (isLoading) {
    return (
      <Card className="bg-card backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700">
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
      <Card className="bg-card backdrop-blur-sm shadow-lg border border-gray-200 dark:border-neutral-700">
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
            {score === null ? <AlertCircle className="w-12 h-12" /> : score}
          </div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-neutral-300">
            {getScoreText(score)}
          </p>
          {score !== null ? (
            <Progress
              value={score}
              className="w-full mt-4"
              aria-label={`Financial health score: ${score} out of 100`}
            />
          ) : (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              We don&apos;t have enough data to calculate your score yet. Keep
              using MoneyWise to get your financial health score.
            </p>
          )}
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full mt-4 space-y-2"
              >
                {getScoreDetails(score).map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
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
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
