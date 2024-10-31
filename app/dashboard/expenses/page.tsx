"use client";

import { useEffect, useState } from "react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setExpenses(data);
      } catch {
        setError("Failed to fetch expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>User Expenses</h1>
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <p>Description: {expense.description}</p>
            <p>Amount: ${expense.amount}</p>
            <p>Date: {expense.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesPage;
