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
    if (
      score !== null &&
      prevScore !== null &&
      !isNaN(score) &&
      !isNaN(prevScore)
    ) {
      setScoreChange(score - prevScore);
    }
    if (score !== null && !isNaN(score)) {
      setPrevScore(score);
    }
  }, [score]);

  const getScoreColor = (score: number | null) => {
    if (score === null || isNaN(score)) return "bg-gray-400";
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getScoreText = (score: number | null) => {
    if (score === null || isNaN(score)) return "Not Available";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  const getScoreDetails = (score: number | null) => [
    {
      label: "Savings",
      value:
        score === null || isNaN(score)
          ? "N/A"
          : score >= 60
          ? "On Track"
          : "Needs Attention",
      icon: PiggyBank,
      percentage:
        score === null || isNaN(score) ? 0 : Math.min(100, (score / 60) * 100),
    },
    {
      label: "Debt",
      value:
        score === null || isNaN(score)
          ? "N/A"
          : score >= 70
          ? "Manageable"
          : "High",
      icon: CreditCard,
      percentage:
        score === null || isNaN(score) ? 0 : Math.min(100, (score / 70) * 100),
    },
    {
      label: "Spending",
      value:
        score === null || isNaN(score)
          ? "N/A"
          : score >= 50
          ? "Controlled"
          : "Excessive",
      icon: DollarSign,
      percentage:
        score === null || isNaN(score) ? 0 : Math.min(100, (score / 50) * 100),
    },
    {
      label: "Investments",
      value:
        score === null || isNaN(score)
          ? "N/A"
          : score >= 80
          ? "Diversified"
          : "Limited",
      icon: TrendingUp,
      percentage:
        score === null || isNaN(score) ? 0 : Math.min(100, (score / 80) * 100),
    },
  ];

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-neutral-800 rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Financial Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-24 rounded-full mx-auto mb-6" />
          <Skeleton className="h-5 w-2/3 mx-auto mb-4" />
          <Skeleton className="h-3 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-white/5 dark:bg-neutral-900/50 backdrop-blur-xl border-neutral-200/10 dark:border-neutral-800/10 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-3">
            Financial Health Score
            {!isNaN(scoreChange) && scoreChange !== 0 && (
              <span
                className={`text-base ${
                  scoreChange > 0 ? "text-emerald-500" : "text-rose-500"
                } flex items-center font-semibold`}
              >
                {scoreChange > 0 ? (
                  <ArrowUpRight className="w-5 h-5" />
                ) : (
                  <ArrowDownRight className="w-5 h-5" />
                )}
                {Math.abs(scoreChange)}
              </span>
            )}
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>
                  Your overall financial health based on savings, debt,
                  spending, and investments. Updated monthly based on your
                  financial activity.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-4">
          <motion.div
            className={`relative w-40 h-40 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg
              ${getScoreColor(
                score
              )} dark:bg-opacity-90 before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-black/5 dark:before:bg-black/20`}
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {score === null || isNaN(score) ? (
              <AlertCircle className="w-16 h-16" />
            ) : (
              score
            )}
          </motion.div>
          <p className="mt-6 text-xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-neutral-300 dark:to-neutral-100 bg-clip-text text-transparent">
            {getScoreText(score)}
          </p>
          {score !== null && !isNaN(score) ? (
            <Progress
              value={score}
              className="w-full mt-6 h-3 rounded-lg"
              aria-label={`Financial health score: ${score} out of 100`}
            />
          ) : (
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              We don&apos;t have enough data to calculate your score yet. Keep
              using MoneyWise to get your financial health score.
            </p>
          )}
          <Button
            variant="outline"
            size="lg"
            className="mt-6 font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-105"
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
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full mt-6 space-y-4"
              >
                {getScoreDetails(score).map((detail, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/30 transition-all duration-300 border border-transparent hover:border-neutral-200/10 dark:hover:border-neutral-700/30"
                  >
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-lg ${getScoreColor(
                          score
                        )} bg-opacity-10 mr-3`}
                      >
                        <detail.icon className="h-5 w-5 text-gray-700 dark:text-neutral-300" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                        {detail.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress
                        value={detail.percentage}
                        className="w-32 h-2.5 rounded-full"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300 min-w-[90px] text-right">
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
