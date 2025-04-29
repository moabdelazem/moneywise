import { NextResponse } from "next/server";
import { ReportConfig, ReportData, Budget, Expense } from "@/lib/types";
import { generateCSVReport } from "@/lib/reports/csv";
import { generateExcelReport } from "@/lib/reports/excel";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { emailService } from "@/utils/emailService";
import { emailTemplates } from "@/utils/emailTemplates";

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const { userId } = await verifyToken(token);

    const config: ReportConfig = await request.json();

    // --- Conditional Data Fetching based on Report Type ---
    let expenses: Expense[] = [];
    let budgets: Budget[] = [];

    // Fetch expenses if needed (COMPLETE or EXPENSE type)
    if (config.type === "COMPLETE" || config.type === "EXPENSE") {
      expenses = await prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: new Date(config.startDate),
            lte: new Date(config.endDate),
          },
        },
        orderBy: {
          // Optional: Sort expenses by date
          date: "asc",
        },
      });
    }

    // Fetch budgets if needed (COMPLETE or BUDGET type)
    if (config.type === "COMPLETE" || config.type === "BUDGET") {
      budgets = await prisma.budget.findMany({
        where: {
          userId,
        },
        // Optional: You might want to filter/sort budgets if applicable
        // orderBy: { category: 'asc' }
      });
    }

    // --- Calculate Summaries (conditionally) ---
    let totalExpenses = 0;
    let categoryTotals: Record<string, number> = {};

    if (expenses.length > 0) {
      totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);
    }

    let totalBudget = 0;
    if (budgets.length > 0) {
      totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    }

    // --- Construct ReportData based on Type ---
    const reportData: Partial<ReportData> = {}; // Use Partial as structure varies

    const formattedExpenses = expenses.map((exp) => ({
      ...exp,
      notes: exp.notes === null ? undefined : exp.notes,
    }));

    const categoryBreakdown = Object.entries(categoryTotals).map(
      ([category, amount]): CategoryBreakdown => ({
        category,
        amount,
        // Handle division by zero if totalExpenses is 0
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      })
    );

    switch (config.type) {
      case "COMPLETE":
        reportData.expenses = formattedExpenses;
        reportData.budgets = budgets;
        reportData.summary = {
          totalExpenses,
          totalBudget,
          savings: totalBudget - totalExpenses,
          categoryBreakdown,
        };
        break;
      case "EXPENSE":
        reportData.expenses = formattedExpenses;
        reportData.summary = {
          totalExpenses,
          totalBudget: 0, // Or undefined, depending on ReportData definition
          savings: 0 - totalExpenses,
          categoryBreakdown,
        };
        break;
      case "BUDGET":
        reportData.budgets = budgets;
        reportData.summary = {
          totalExpenses: 0, // Or undefined
          totalBudget,
          savings: totalBudget - 0,
          categoryBreakdown: [], // No expenses, no breakdown
        };
        break;
      default:
        // Handle unknown type or default to COMPLETE?
        // For now, let's assume COMPLETE if type is missing/invalid
        console.warn(
          `Unknown report type: ${config.type}, defaulting to COMPLETE.`
        );
        reportData.expenses = formattedExpenses;
        reportData.budgets = budgets;
        reportData.summary = {
          totalExpenses,
          totalBudget,
          savings: totalBudget - totalExpenses,
          categoryBreakdown,
        };
        break;
    }

    // Fetch user email and name
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate report in requested format
    let reportBuffer: Buffer;
    let contentType: string;
    let fileExtension: string;

    type ReportFormat = "CSV" | "EXCEL";
    const format = config.format as ReportFormat;

    switch (format) {
      case "CSV":
        // Pass the potentially partial reportData
        reportBuffer = await generateCSVReport(
          reportData as ReportData,
          config
        );
        contentType = "text/csv";
        fileExtension = "csv";
        break;
      case "EXCEL":
        // Pass the potentially partial reportData
        reportBuffer = await generateExcelReport(
          reportData as ReportData,
          config
        );
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileExtension = "xlsx";
        break;
      default:
        throw new Error("Unsupported format");
    }

    // Send email with report attached
    await emailService.sendMail(
      user.email,
      emailTemplates.reportExport(user.name).subject,
      emailTemplates.reportExport(user.name).html,
      [
        {
          filename: `financial-report.${fileExtension}`,
          content: reportBuffer,
        },
      ]
    );

    return new NextResponse(reportBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=financial-report.${fileExtension}`,
      },
    });
  } catch (error) {
    console.error("Report generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
