"use client"

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
  TableRow 
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, SortAsc, SortDesc, Filter } from 'lucide-react';

const MotionCard = motion(Card);

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
}

export function ExpensesTable({ expenses, isLoading }: ExpensesTableProps) {
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
        return sortOrder === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
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

  return (
    <MotionCard
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <CardHeader>
        <CardTitle className="text-2xl font-semibold flex items-center justify-between">
          <span>All Expenses</span>
          <Button variant="outline" size="sm" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search expenses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex space-x-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
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
                    >
                      <TableCell className="font-medium">
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="text-right">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(pageCount)}
              disabled={currentPage === pageCount}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </MotionCard>
  );
}