import { NextResponse } from "next/server";
import { ReportConfig, ReportData } from "@/lib/types";
import { generateCSVReport } from "@/lib/reports/csv";
import { generateExcelReport } from "@/lib/reports/excel";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Expense, Budget } from "@prisma/client";

interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

interface ReportSummary {
  totalExpenses: number;
  totalBudget: number;
  savings: number;
  categoryBreakdown: CategoryBreakdown[];
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

    // Fetch data based on date range
    const expenses: Expense[] = await prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: new Date(config.startDate),
          lte: new Date(config.endDate),
        },
      },
    });

    const budgets: Budget[] = await prisma.budget.findMany({
      where: {
        userId,
      },
    });

    // Calculate category breakdown
    const categoryTotals = expenses.reduce(
      (acc: Record<string, number>, expense: Expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const totalExpenses = expenses.reduce(
      (sum: number, exp: Expense) => sum + exp.amount,
      0
    );
    const totalBudget = budgets.reduce(
      (sum: number, budget: Budget) => sum + budget.amount,
      0
    );

    // Generate report data
    const reportData: ReportData = {
      expenses,
      budgets,
      summary: {
        totalExpenses,
        totalBudget,
        savings: totalBudget - totalExpenses,
        categoryBreakdown: Object.entries(categoryTotals).map(
          ([category, amount]): CategoryBreakdown => ({
            category,
            amount,
            percentage: (amount / totalExpenses) * 100,
          })
        ),
      },
    };

    // Generate report in requested format
    let reportBuffer: Buffer;
    let contentType: string;
    let fileExtension: string;

    type ReportFormat = "CSV" | "EXCEL";
    const format = config.format as ReportFormat;

    switch (format) {
      case "CSV":
        reportBuffer = await generateCSVReport(reportData, config);
        contentType = "text/csv";
        fileExtension = "csv";
        break;
      case "EXCEL":
        reportBuffer = await generateExcelReport(reportData, config);
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        fileExtension = "xlsx";
        break;
      default:
        throw new Error("Unsupported format");
    }

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
