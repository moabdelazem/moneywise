"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Film,
  MoreHorizontal,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Expense {
  id: string;
  amount: number;
  category: string;
}

interface TopSpendingCategoriesProps {
  expenses: Expense[];
  isLoading: boolean;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "shopping":
      return <ShoppingBag className="h-5 w-5" />;
    case "food":
      return <Utensils className="h-5 w-5" />;
    case "transport":
      return <Car className="h-5 w-5" />;
    case "housing":
      return <Home className="h-5 w-5" />;
    case "entertainment":
      return <Film className="h-5 w-5" />;
    default:
      return <MoreHorizontal className="h-5 w-5" />;
  }
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.category}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`$${value.toFixed(2)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export function TopSpendingCategories({
  expenses,
  isLoading,
}: TopSpendingCategoriesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { topCategories, totalSpending } = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));

    const total = sortedCategories.reduce(
      (sum, category) => sum + category.amount,
      0
    );

    return { topCategories: sortedCategories, totalSpending: total };
  }, [expenses]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-card text-card-foreground shadow-xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Top Spending Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="w-full lg:w-1/2 h-[300px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    onMouseEnter={onPieEnter}
                  >
                    {topCategories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-6">
              <AnimatePresence>
                {topCategories.map((category, index) => (
                  <CategoryItem
                    key={category.category}
                    category={category}
                    index={index}
                    totalSpending={totalSpending}
                    isActive={index === activeIndex}
                    onHover={() => setActiveIndex(index)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingState() {
  return (
    <Card className="bg-card text-card-foreground shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          Top Spending Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-[300px]">
        <Skeleton className="h-full w-full rounded-2xl" />
      </CardContent>
    </Card>
  );
}

interface CategoryItemProps {
  category: { category: string; amount: number };
  index: number;
  totalSpending: number;
  isActive: boolean;
  onHover: () => void;
}

function CategoryItem({
  category,
  index,
  totalSpending,
  isActive,
  onHover,
}: CategoryItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group p-4 rounded-lg transition-all duration-300 border-primary/10",
        isActive && "bg-accent"
      )}
      onMouseEnter={onHover}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        >
          {getCategoryIcon(category.category)}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold">{category.category}</span>
            <span className="text-sm font-bold">
              ${category.amount.toFixed(2)}
            </span>
          </div>
          <Progress
            value={(category.amount / totalSpending) * 100}
            className={cn(
              "h-2 transition-all duration-300 group-hover:h-3",
              "[&>div]:transition-all [&>div]:duration-300",
              isActive && "[&>div]:animate-pulse"
            )}
          />
          <div className="text-xs text-muted-foreground mt-1">
            {((category.amount / totalSpending) * 100).toFixed(1)}% of total
          </div>
        </div>
      </div>
    </motion.div>
  );
}
