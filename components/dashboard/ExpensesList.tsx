import { useState } from "react";
import { motion } from "framer-motion";
import { Expense } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, DollarSign, Search, Filter } from "lucide-react";

interface ExpensesListProps {
  expenses: Expense[];
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        filterCategory === "all" || expense.category === filterCategory
    )
    .filter((expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalAmount = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categories = Array.from(
    new Set(expenses.map((expense) => expense.category))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <span className="text-2xl font-semibold">
            ${totalAmount.toFixed(2)}
          </span>
          <span className="text-muted-foreground">Total</span>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid gap-4">
          {filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{expense.description}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(expense.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="secondary"
                  className="hidden group-hover:inline-flex"
                >
                  {expense.category}
                </Badge>
                <span className="text-lg font-semibold">
                  ${expense.amount.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
