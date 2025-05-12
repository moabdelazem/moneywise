import ExcelJS from "exceljs";
import { ReportData, ReportConfig } from "@/lib/types";

export async function generateExcelReport(
  reportData: ReportData,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  config: ReportConfig
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();

  // Add report metadata
  workbook.creator = "MoneyWise";
  workbook.lastModifiedBy = "MoneyWise Report Generator";
  workbook.created = new Date();
  workbook.modified = new Date();

  // Format dates for title
  const startDate =
    config.startDate instanceof Date
      ? config.startDate.toISOString().split("T")[0]
      : new Date(config.startDate).toISOString().split("T")[0];

  const endDate =
    config.endDate instanceof Date
      ? config.endDate.toISOString().split("T")[0]
      : new Date(config.endDate).toISOString().split("T")[0];

  // --- SUMMARY WORKSHEET ---
  const summarySheet = workbook.addWorksheet("Summary");

  // Add title
  summarySheet.mergeCells("A1:C1");
  const titleCell = summarySheet.getCell("A1");
  titleCell.value = `Financial Report: ${startDate} to ${endDate}`;
  titleCell.font = { size: 16, bold: true };
  titleCell.alignment = { horizontal: "center" };
  summarySheet.addRow([]);

  // Add summary section
  summarySheet.addRow(["Total Expenses", "Total Budget", "Savings"]);
  const summaryDataRow = summarySheet.addRow([
    reportData.summary.totalExpenses,
    reportData.summary.totalBudget,
    reportData.summary.savings,
  ]);

  // Format numbers as currency
  summaryDataRow.eachCell((cell) => {
    cell.numFmt = '"$"#,##0.00;[Red]-"$"#,##0.00';
  });

  summarySheet.addRow([]);

  // Add category breakdown
  summarySheet.addRow(["Category Breakdown"]);
  const headerRow = summarySheet.addRow(["Category", "Amount", "Percentage"]);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
  });

  reportData.summary.categoryBreakdown.forEach((category) => {
    const row = summarySheet.addRow([
      category.category,
      category.amount,
      category.percentage / 100, // Format as percentage
    ]);

    // Format amount as currency and percentage
    row.getCell(2).numFmt = '"$"#,##0.00;[Red]-"$"#,##0.00';
    row.getCell(3).numFmt = "0.0%";
  });

  // Set column widths
  summarySheet.getColumn(1).width = 30;
  summarySheet.getColumn(2).width = 15;
  summarySheet.getColumn(3).width = 15;

  // --- BUDGET WORKSHEET ---
  if (reportData.budgets && reportData.budgets.length > 0) {
    const budgetSheet = workbook.addWorksheet("Budget Details");

    // Add headers
    const budgetHeaderRow = budgetSheet.addRow([
      "Category",
      "Budget Amount",
      "Spent",
      "Remaining",
      "Usage Percentage",
    ]);
    budgetHeaderRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    // Add budget data
    reportData.budgets.forEach((budget) => {
      const usagePercentage =
        budget.amount > 0 ? budget.spent / budget.amount : 0;

      const row = budgetSheet.addRow([
        budget.category,
        budget.amount,
        budget.spent,
        budget.remaining,
        usagePercentage,
      ]);

      // Format cells
      row.getCell(2).numFmt = '"$"#,##0.00;[Red]-"$"#,##0.00'; // Budget amount
      row.getCell(3).numFmt = '"$"#,##0.00;[Red]-"$"#,##0.00'; // Spent
      row.getCell(4).numFmt = '"$"#,##0.00;[Red]-"$"#,##0.00'; // Remaining
      row.getCell(5).numFmt = "0.0%"; // Usage percentage

      // Highlight over-budget items
      if (budget.spent > budget.amount) {
        row.getCell(4).font = { color: { argb: "FFFF0000" } }; // Red text for negative remaining
        row.getCell(5).font = { color: { argb: "FFFF0000" } }; // Red text for over 100%
      }
    });

    // Set column widths
    budgetSheet.getColumn(1).width = 30;
    budgetSheet.getColumn(2).width = 15;
    budgetSheet.getColumn(3).width = 15;
    budgetSheet.getColumn(4).width = 15;
    budgetSheet.getColumn(5).width = 18;
  }

  // --- EXPENSES WORKSHEET ---
  if (reportData.expenses && reportData.expenses.length > 0) {
    const expenseSheet = workbook.addWorksheet("Expense Details");

    // Add headers
    const expenseHeaderRow = expenseSheet.addRow([
      "Date",
      "Category",
      "Description",
      "Amount",
      "Status",
      "Notes",
    ]);
    expenseHeaderRow.eachCell((cell) => {
      cell.font = { bold: true };
    });

    // Add expense data
    reportData.expenses.forEach((expense) => {
      const expenseDate =
        expense.date instanceof Date ? expense.date : new Date(expense.date);

      const row = expenseSheet.addRow([
        expenseDate,
        expense.category,
        expense.description,
        expense.amount,
        expense.status,
        expense.notes || "",
      ]);

      // Format date and amount
      row.getCell(1).numFmt = "yyyy-mm-dd";
      row.getCell(4).numFmt = '"$"#,##0.00;[Red]-"$"#,##0.00';
    });

    // Set column widths
    expenseSheet.getColumn(1).width = 12; // Date
    expenseSheet.getColumn(2).width = 20; // Category
    expenseSheet.getColumn(3).width = 40; // Description
    expenseSheet.getColumn(4).width = 15; // Amount
    expenseSheet.getColumn(5).width = 15; // Status
    expenseSheet.getColumn(6).width = 30; // Notes

    // Add auto-filter to headers
    expenseSheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 6 },
    };
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
