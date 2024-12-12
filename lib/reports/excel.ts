import ExcelJS from "exceljs";
import { ReportData, ReportConfig } from "@/lib/types";

export async function generateExcelReport(
    reportData: ReportData,
    config: ReportConfig
): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Financial Report");

    worksheet.columns = [
        { header: "Category", key: "category", width: 30 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Percentage", key: "percentage", width: 15 },
    ];

    reportData.summary.categoryBreakdown.forEach((category) => {
        worksheet.addRow({
            category: category.category,
            amount: category.amount.toFixed(2),
            percentage: `${category.percentage.toFixed(1)}%`,
        });
    });

    worksheet.addRow({});
    worksheet.addRow({ category: "Total Expenses", amount: reportData.summary.totalExpenses.toFixed(2) });
    worksheet.addRow({ category: "Total Budget", amount: reportData.summary.totalBudget.toFixed(2) });
    worksheet.addRow({ category: "Savings", amount: reportData.summary.savings.toFixed(2) });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
} 