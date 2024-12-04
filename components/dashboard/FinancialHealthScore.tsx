"use client";

import { useState, useEffect } from "react";
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
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface FinancialHealthScoreProps {
  score: number | null;
  isLoading: boolean;
}

export function FinancialHealthScore({
  score,
  isLoading,
}: FinancialHealthScoreProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [prevScore, setPrevScore] = useState<number | null>(null);
  const [scoreChange, setScoreChange] = useState<number>(0);

  useEffect(() => {
    if (score !== null && prevScore !== null) {
      setScoreChange(score - prevScore);
    }
    setPrevScore(score);
  }, [score]);

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-400";
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getScoreText = (score: number | null) => {
    if (score === null) return "Not Available";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const getScoreDetails = (score: number | null) => [
    {
      label: "Savings",
      value: score === null ? "N/A" : score >= 60 ? "On Track" : "Needs Attention",
      icon: PiggyBank,
      percentage: score === null ? 0 : Math.min(100, (score / 60) * 100),
    },
    {
      label: "Debt",
      value: score === null ? "N/A" : score >= 70 ? "Manageable" : "High",
      icon: CreditCard,
      percentage: score === null ? 0 : Math.min(100, (score / 70) * 100),
    },
    {
      label: "Spending",
      value: score === null ? "N/A" : score >= 50 ? "Controlled" : "Excessive",
      icon: DollarSign,
      percentage: score === null ? 0 : Math.min(100, (score / 50) * 100),
    },
    {
      label: "Investments",
      value: score === null ? "N/A" : score >= 80 ? "Diversified" : "Limited",
      icon: TrendingUp,
      percentage: score === null ? 0 : Math.min(100, (score / 80) * 100),
    },
  ];

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
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            Financial Health Score
            {!isNaN(scoreChange) && scoreChange !== 0 && (
              <span className={`text-sm ${scoreChange > 0 ? 'text-emerald-500' : 'text-rose-500'} flex items-center`}>
                {scoreChange > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(scoreChange)}
              </span>
            )}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Your overall financial health based on savings, debt,
                  spending, and investments. Updated monthly based on your financial activity.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <motion.div
            className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold text-white ${getScoreColor(
              score
            )}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            {score === null ? <AlertCircle className="w-12 h-12" /> : score}
          </motion.div>
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
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
              We don&apos;t have enough data to calculate your score yet. Keep
              using MoneyWise to get your financial health score.
            </p>
          )}
          <Button
            variant="outline"
            className="mt-4 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
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
                className="w-full mt-4 space-y-3"
              >
                {getScoreDetails(score).map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <div className="flex items-center">
                      <detail.icon className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-neutral-400">
                        {detail.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={detail.percentage} className="w-24" />
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 min-w-[80px] text-right">
                        {detail.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
