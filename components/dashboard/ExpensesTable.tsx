"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  DollarSign,
  Calendar,
} from "lucide-react";
import { Expense } from "@/lib/types";

// MotionCard is a Framer Motion component that animates the Card component
const MotionCard = motion(Card);

// ExpensesTable component
interface ExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
}

// ExpensesTable component
export function ExpensesTable({ expenses, isLoading }: ExpensesTableProps) {
  // State variables
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
        return sortOrder === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  const pageCount = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Calculate total amount
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <MotionCard
      className="bg-card backdrop-blur-sm shadow-lg rounded-xl border-primary/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>All Expenses</span>
            <span className="text-sm font-normal text-muted-foreground">
              Total: ${totalAmount.toFixed(2)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="hover:bg-primary/5 transition-colors"
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4" />
            ) : (
              <SortDesc className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 hover:bg-background/80 transition-colors"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] bg-background/50 hover:bg-background/80 transition-colors">
                <Filter className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value: "date" | "amount") => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px] bg-background/50 hover:bg-background/80 transition-colors">
                {sortBy === "date" ? (
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                ) : (
                  <DollarSign className="h-4 w-4 mr-2 text-primary" />
                )}
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-lg border bg-background/50">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-primary/5">
                <TableHead className="w-[100px] font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="text-right font-semibold">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24">
                    <div className="flex items-center justify-center">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 ml-4">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {paginatedExpenses.map((expense, index) => (
                    <motion.tr
                      key={expense.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {expense.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
        {!isLoading && pageCount > 1 && (
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="hover:bg-primary/5"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="hover:bg-primary/5"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Page {currentPage} of {pageCount}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="hover:bg-primary/5"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(pageCount)}
                disabled={currentPage === pageCount}
                className="hover:bg-primary/5"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </MotionCard>
  );
}
