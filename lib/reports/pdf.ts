import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ReportData, ReportConfig } from "@/lib/types";

export async function generatePDFReport(
  reportData: ReportData,
  config: ReportConfig
): Promise<Buffer> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add standard fonts
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesItalicFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanItalic
  );

  // Constants for layout
  const margin = 50;
  const pageWidth = 612; // Standard US Letter width
  const pageHeight = 792; // Standard US Letter height
  const lineHeight = 20;
  const tableRowHeight = 25;
  const tableHeaderHeight = 30;

  // Format dates for header
  const startDate =
    config.startDate instanceof Date
      ? config.startDate.toISOString().split("T")[0]
      : new Date(config.startDate).toISOString().split("T")[0];

  const endDate =
    config.endDate instanceof Date
      ? config.endDate.toISOString().split("T")[0]
      : new Date(config.endDate).toISOString().split("T")[0];

  // ----- SUMMARY PAGE -----
  // Create the first page
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // Add title
  page.drawText(`Financial Report: ${startDate} to ${endDate}`, {
    x: margin,
    y: pageHeight - margin - 30,
    size: 24,
    font: timesBoldFont,
    color: rgb(0, 0, 0.7),
  });

  // Add report type
  page.drawText(`Report Type: ${config.type}`, {
    x: margin,
    y: pageHeight - margin - 60,
    size: 14,
    font: timesItalicFont,
  });

  let yPosition = pageHeight - margin - 100;

  // Summary section
  page.drawText("SUMMARY", {
    x: margin,
    y: yPosition,
    size: 16,
    font: timesBoldFont,
  });

  yPosition -= lineHeight * 1.5;

  const summaryData = [
    {
      label: "Total Expenses",
      value: `$${reportData.summary.totalExpenses.toFixed(2)}`,
    },
    {
      label: "Total Budget",
      value: `$${reportData.summary.totalBudget.toFixed(2)}`,
    },
    { label: "Savings", value: `$${reportData.summary.savings.toFixed(2)}` },
  ];

  summaryData.forEach((item) => {
    page.drawText(item.label, {
      x: margin,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    page.drawText(item.value, {
      x: margin + 150,
      y: yPosition,
      size: 12,
      font: timesRomanFont,
    });

    yPosition -= lineHeight;
  });

  yPosition -= lineHeight;

  // Category breakdown section
  page.drawText("CATEGORY BREAKDOWN", {
    x: margin,
    y: yPosition,
    size: 16,
    font: timesBoldFont,
  });

  yPosition -= lineHeight * 1.5;

  // Draw table header
  const categoryColumnWidth = 200;
  const amountColumnWidth = 100;
  const percentageColumnWidth = 100;

  // Table header
  page.drawText("Category", {
    x: margin,
    y: yPosition,
    size: 12,
    font: timesBoldFont,
  });

  page.drawText("Amount", {
    x: margin + categoryColumnWidth,
    y: yPosition,
    size: 12,
    font: timesBoldFont,
  });

  page.drawText("Percentage", {
    x: margin + categoryColumnWidth + amountColumnWidth,
    y: yPosition,
    size: 12,
    font: timesBoldFont,
  });

  yPosition -= tableHeaderHeight;

  // Draw category rows
  reportData.summary.categoryBreakdown.forEach((category, index) => {
    // Check if we need a new page
    if (yPosition < margin + 50) {
      // Add a new page
      const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - margin - 30;

      // Add continuation header
      newPage.drawText("Category Breakdown (continued)", {
        x: margin,
        y: yPosition,
        size: 16,
        font: timesBoldFont,
      });

      yPosition -= tableHeaderHeight;

      // Add table header again
      newPage.drawText("Category", {
        x: margin,
        y: yPosition,
        size: 12,
        font: timesBoldFont,
      });

      newPage.drawText("Amount", {
        x: margin + categoryColumnWidth,
        y: yPosition,
        size: 12,
        font: timesBoldFont,
      });

      newPage.drawText("Percentage", {
        x: margin + categoryColumnWidth + amountColumnWidth,
        y: yPosition,
        size: 12,
        font: timesBoldFont,
      });

      yPosition -= tableHeaderHeight;
    }

    // Draw a light gray background for even rows
    if (index % 2 === 1) {
      page.drawRectangle({
        x: margin - 5,
        y: yPosition - 5,
        width:
          categoryColumnWidth + amountColumnWidth + percentageColumnWidth + 10,
        height: tableRowHeight,
        color: rgb(0.95, 0.95, 0.95),
        borderWidth: 0,
      });
    }

    // Draw row data
    page.drawText(category.category, {
      x: margin,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });

    page.drawText(`$${category.amount.toFixed(2)}`, {
      x: margin + categoryColumnWidth,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });

    page.drawText(`${category.percentage.toFixed(1)}%`, {
      x: margin + categoryColumnWidth + amountColumnWidth,
      y: yPosition,
      size: 11,
      font: timesRomanFont,
    });

    yPosition -= tableRowHeight;
  });

  // ----- BUDGET DETAILS PAGE -----
  if (reportData.budgets && reportData.budgets.length > 0) {
    const budgetPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let budgetY = pageHeight - margin - 30;

    // Add title
    budgetPage.drawText("Budget Details", {
      x: margin,
      y: budgetY,
      size: 16,
      font: timesBoldFont,
    });

    budgetY -= lineHeight * 2;

    // Define column widths
    const categoryColWidth = 150;
    const amountColWidth = 100;
    const spentColWidth = 100;
    const remainingColWidth = 100;

    // Draw table header
    budgetPage.drawText("Category", {
      x: margin,
      y: budgetY,
      size: 12,
      font: timesBoldFont,
    });

    budgetPage.drawText("Budget", {
      x: margin + categoryColWidth,
      y: budgetY,
      size: 12,
      font: timesBoldFont,
    });

    budgetPage.drawText("Spent", {
      x: margin + categoryColWidth + amountColWidth,
      y: budgetY,
      size: 12,
      font: timesBoldFont,
    });

    budgetPage.drawText("Remaining", {
      x: margin + categoryColWidth + amountColWidth + spentColWidth,
      y: budgetY,
      size: 12,
      font: timesBoldFont,
    });

    budgetY -= tableHeaderHeight;

    // Draw budget rows
    reportData.budgets.forEach((budget, index) => {
      // Check if we need a new page
      if (budgetY < margin + 50) {
        // Add a new page
        const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
        budgetY = pageHeight - margin - 30;

        // Add continuation header
        newPage.drawText("Budget Details (continued)", {
          x: margin,
          y: budgetY,
          size: 16,
          font: timesBoldFont,
        });

        budgetY -= tableHeaderHeight;

        // Add table header again
        newPage.drawText("Category", {
          x: margin,
          y: budgetY,
          size: 12,
          font: timesBoldFont,
        });

        newPage.drawText("Budget", {
          x: margin + categoryColWidth,
          y: budgetY,
          size: 12,
          font: timesBoldFont,
        });

        newPage.drawText("Spent", {
          x: margin + categoryColWidth + amountColWidth,
          y: budgetY,
          size: 12,
          font: timesBoldFont,
        });

        newPage.drawText("Remaining", {
          x: margin + categoryColWidth + amountColWidth + spentColWidth,
          y: budgetY,
          size: 12,
          font: timesBoldFont,
        });

        budgetY -= tableHeaderHeight;
      }

      // Draw a light gray background for even rows
      if (index % 2 === 1) {
        budgetPage.drawRectangle({
          x: margin - 5,
          y: budgetY - 5,
          width:
            categoryColWidth +
            amountColWidth +
            spentColWidth +
            remainingColWidth +
            10,
          height: tableRowHeight,
          color: rgb(0.95, 0.95, 0.95),
          borderWidth: 0,
        });
      }

      // Draw row data
      budgetPage.drawText(budget.category, {
        x: margin,
        y: budgetY,
        size: 11,
        font: timesRomanFont,
      });

      budgetPage.drawText(`$${budget.amount.toFixed(2)}`, {
        x: margin + categoryColWidth,
        y: budgetY,
        size: 11,
        font: timesRomanFont,
      });

      budgetPage.drawText(`$${budget.spent.toFixed(2)}`, {
        x: margin + categoryColWidth + amountColWidth,
        y: budgetY,
        size: 11,
        font: timesRomanFont,
      });

      // Use red color for negative remaining amounts
      const remainingColor =
        budget.remaining < 0 ? rgb(0.8, 0, 0) : rgb(0, 0, 0);

      budgetPage.drawText(`$${budget.remaining.toFixed(2)}`, {
        x: margin + categoryColWidth + amountColWidth + spentColWidth,
        y: budgetY,
        size: 11,
        font: timesRomanFont,
        color: remainingColor,
      });

      budgetY -= tableRowHeight;
    });
  }

  // ----- EXPENSE DETAILS PAGES -----
  if (reportData.expenses && reportData.expenses.length > 0) {
    const expensePage = pdfDoc.addPage([pageWidth, pageHeight]);
    let expenseY = pageHeight - margin - 30;

    // Add title
    expensePage.drawText("Expense Details", {
      x: margin,
      y: expenseY,
      size: 16,
      font: timesBoldFont,
    });

    expenseY -= lineHeight * 2;

    // Define column widths for expenses table
    const dateColWidth = 80;
    const categoryColWidth = 100;
    const descriptionColWidth = 150;
    const amountColWidth = 80;
    const statusColWidth = 80;

    // Draw table header
    expensePage.drawText("Date", {
      x: margin,
      y: expenseY,
      size: 11,
      font: timesBoldFont,
    });

    expensePage.drawText("Category", {
      x: margin + dateColWidth,
      y: expenseY,
      size: 11,
      font: timesBoldFont,
    });

    expensePage.drawText("Description", {
      x: margin + dateColWidth + categoryColWidth,
      y: expenseY,
      size: 11,
      font: timesBoldFont,
    });

    expensePage.drawText("Amount", {
      x: margin + dateColWidth + categoryColWidth + descriptionColWidth,
      y: expenseY,
      size: 11,
      font: timesBoldFont,
    });

    expensePage.drawText("Status", {
      x:
        margin +
        dateColWidth +
        categoryColWidth +
        descriptionColWidth +
        amountColWidth,
      y: expenseY,
      size: 11,
      font: timesBoldFont,
    });

    expenseY -= tableHeaderHeight;

    let currentPage = expensePage;

    // Draw expense rows
    reportData.expenses.forEach((expense, index) => {
      // Check if we need a new page
      if (expenseY < margin + 50) {
        // Add a new page
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        expenseY = pageHeight - margin - 30;

        // Add continuation header
        currentPage.drawText("Expense Details (continued)", {
          x: margin,
          y: expenseY,
          size: 16,
          font: timesBoldFont,
        });

        expenseY -= tableHeaderHeight;

        // Add table header again
        currentPage.drawText("Date", {
          x: margin,
          y: expenseY,
          size: 11,
          font: timesBoldFont,
        });

        currentPage.drawText("Category", {
          x: margin + dateColWidth,
          y: expenseY,
          size: 11,
          font: timesBoldFont,
        });

        currentPage.drawText("Description", {
          x: margin + dateColWidth + categoryColWidth,
          y: expenseY,
          size: 11,
          font: timesBoldFont,
        });

        currentPage.drawText("Amount", {
          x: margin + dateColWidth + categoryColWidth + descriptionColWidth,
          y: expenseY,
          size: 11,
          font: timesBoldFont,
        });

        currentPage.drawText("Status", {
          x:
            margin +
            dateColWidth +
            categoryColWidth +
            descriptionColWidth +
            amountColWidth,
          y: expenseY,
          size: 11,
          font: timesBoldFont,
        });

        expenseY -= tableHeaderHeight;
      }

      // Draw a light gray background for even rows
      if (index % 2 === 1) {
        currentPage.drawRectangle({
          x: margin - 5,
          y: expenseY - 5,
          width:
            dateColWidth +
            categoryColWidth +
            descriptionColWidth +
            amountColWidth +
            statusColWidth +
            10,
          height: tableRowHeight,
          color: rgb(0.95, 0.95, 0.95),
          borderWidth: 0,
        });
      }

      // Format date
      const expenseDate =
        expense.date instanceof Date ? expense.date : new Date(expense.date);

      const formattedDate = `${expenseDate.getFullYear()}-${String(
        expenseDate.getMonth() + 1
      ).padStart(2, "0")}-${String(expenseDate.getDate()).padStart(2, "0")}`;

      // Draw row data
      currentPage.drawText(formattedDate, {
        x: margin,
        y: expenseY,
        size: 9,
        font: timesRomanFont,
      });

      currentPage.drawText(expense.category, {
        x: margin + dateColWidth,
        y: expenseY,
        size: 9,
        font: timesRomanFont,
      });

      // Truncate description if too long
      let description = expense.description;
      if (description.length > 25) {
        description = description.substring(0, 22) + "...";
      }

      currentPage.drawText(description, {
        x: margin + dateColWidth + categoryColWidth,
        y: expenseY,
        size: 9,
        font: timesRomanFont,
      });

      currentPage.drawText(`$${expense.amount.toFixed(2)}`, {
        x: margin + dateColWidth + categoryColWidth + descriptionColWidth,
        y: expenseY,
        size: 9,
        font: timesRomanFont,
      });

      currentPage.drawText(expense.status, {
        x:
          margin +
          dateColWidth +
          categoryColWidth +
          descriptionColWidth +
          amountColWidth,
        y: expenseY,
        size: 9,
        font: timesRomanFont,
      });

      expenseY -= tableRowHeight;
    });
  }

  // Add footer with page numbers
  const pageCount = pdfDoc.getPageCount();

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPage(i);
    page.drawText(`Page ${i + 1} of ${pageCount}`, {
      x: pageWidth - margin - 100,
      y: margin / 2,
      size: 10,
      font: timesRomanFont,
    });

    // Add MoneyWise footer
    page.drawText("Generated by MoneyWise", {
      x: margin,
      y: margin / 2,
      size: 10,
      font: timesRomanFont,
    });
  }

  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}
