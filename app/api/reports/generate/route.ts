import { NextResponse } from "next/server";
import { ReportConfig, ReportData } from "@/lib/types";
import { generateCSVReport } from "@/lib/reports/csv";
import { generateExcelReport } from "@/lib/reports/excel";
import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Expense, Budget } from "@prisma/client";
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
      expenses: expenses.map((exp) => ({
        ...exp,
        notes: exp.notes === null ? undefined : exp.notes,
      })),
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
