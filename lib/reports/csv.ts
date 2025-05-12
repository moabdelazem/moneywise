import { ReportData, ReportConfig } from "@/lib/types";

export async function generateCSVReport(
  reportData: ReportData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config: ReportConfig
): Promise<Buffer> {
  const { summary, expenses, budgets } = reportData;
  let csvContent = "";

  // Add report header with date range
  const startDate =
    config.startDate instanceof Date
      ? config.startDate.toISOString().split("T")[0]
      : new Date(config.startDate).toISOString().split("T")[0];

  const endDate =
    config.endDate instanceof Date
      ? config.endDate.toISOString().split("T")[0]
      : new Date(config.endDate).toISOString().split("T")[0];

  csvContent += `Financial Report,${startDate} to ${endDate}\n\n`;

  // Add summary section
  csvContent += "SUMMARY\n";
  csvContent += "Total Expenses,Total Budget,Savings\n";
  csvContent += `${summary.totalExpenses.toFixed(
    2
  )},${summary.totalBudget.toFixed(2)},${summary.savings.toFixed(2)}\n\n`;

  // Add category breakdown section
  csvContent += "CATEGORY BREAKDOWN\n";
  csvContent += "Category,Amount,Percentage\n";
  summary.categoryBreakdown.forEach((category) => {
    csvContent += `${category.category},${category.amount.toFixed(
      2
    )},${category.percentage.toFixed(1)}%\n`;
  });
  csvContent += "\n";

  // Add budget details if available
  if (budgets && budgets.length > 0) {
    csvContent += "BUDGET DETAILS\n";
    csvContent += "Category,Budget Amount,Spent,Remaining,Usage Percentage\n";

    budgets.forEach((budget) => {
      const usagePercentage =
        budget.amount > 0
          ? ((budget.spent / budget.amount) * 100).toFixed(1)
          : "0.0";

      csvContent += `${budget.category},${budget.amount.toFixed(
        2
      )},${budget.spent.toFixed(2)},${budget.remaining.toFixed(
        2
      )},${usagePercentage}%\n`;
    });
    csvContent += "\n";
  }

  // Add detailed expenses if available
  if (expenses && expenses.length > 0) {
    csvContent += "EXPENSE DETAILS\n";
    csvContent += "Date,Category,Description,Amount,Status,Notes\n";

    expenses.forEach((expense) => {
      const date =
        expense.date instanceof Date
          ? expense.date.toISOString().split("T")[0]
          : new Date(expense.date).toISOString().split("T")[0];

      // Replace commas in description and notes to prevent CSV parsing issues
      const description = expense.description
        ? expense.description.replace(/,/g, ";")
        : "";
      const notes = expense.notes ? expense.notes.replace(/,/g, ";") : "";

      csvContent += `${date},${
        expense.category
      },${description},${expense.amount.toFixed(2)},${
        expense.status
      },${notes}\n`;
    });
  }

  return Buffer.from(csvContent, "utf-8");
}
