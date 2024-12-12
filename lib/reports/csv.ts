import { ReportData, ReportConfig } from "@/lib/types";

export async function generateCSVReport(
    reportData: ReportData,
    config: ReportConfig
): Promise<Buffer> {
    const { summary } = reportData;

    let csvContent = "Category,Amount,Percentage\n";
    summary.categoryBreakdown.forEach((category) => {
        csvContent += `${category.category},${category.amount.toFixed(2)},${category.percentage.toFixed(
            1
        )}%\n`;
    });

    csvContent += `\nTotal Expenses,${summary.totalExpenses.toFixed(2)}\n`;
    csvContent += `Total Budget,${summary.totalBudget.toFixed(2)}\n`;
    csvContent += `Savings,${summary.savings.toFixed(2)}\n`;

    return Buffer.from(csvContent, "utf-8");
} 