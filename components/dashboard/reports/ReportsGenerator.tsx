"use client";

import React, { useState, CSSProperties } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  FileSpreadsheet,
  Calendar as CalendarIcon,
  Settings,
  Download,
} from "lucide-react";
import { ReportConfig /*, Expense, Budget */ } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

export function ReportsGenerator(/* { expenses, budgets }: ReportsGeneratorProps */) {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    startDate: new Date(),
    endDate: new Date(),
    format: "CSV",
    type: "COMPLETE",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    try {
      setIsGenerating(true);

      // Validate date range
      if (reportConfig.startDate > reportConfig.endDate) {
        toast({
          title: "Invalid Date Range",
          description: "Start date must be before end date.",
          variant: "destructive",
        });
        return; // Stop execution
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No authentication token found. Please log in again.",
          variant: "destructive",
        });
        return; // Stop execution
      }

      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Only send necessary config, not all expenses/budgets again
        body: JSON.stringify(reportConfig),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to parse error response" }));
        throw new Error(errorData.error || "Failed to generate report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Cleaner filename
      const formattedStartDate = reportConfig.startDate
        .toISOString()
        .split("T")[0];
      const formattedEndDate = reportConfig.endDate.toISOString().split("T")[0];
      a.download = `financial-report_${reportConfig.type.toLowerCase()}_${formattedStartDate}_to_${formattedEndDate}.${reportConfig.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success!",
        description: "Your report has been generated and downloaded.",
        variant: "default", // Use default variant for success
      });
    } catch (error) {
      console.error("Report generation error:", error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatOptions = [
    { value: "CSV", label: "CSV Spreadsheet", icon: FileDown },
    { value: "EXCEL", label: "Excel Workbook", icon: FileSpreadsheet },
  ];

  const reportTypes = [
    {
      value: "COMPLETE",
      label: "Complete Report",
      description: "Full financial overview (expenses & budgets)",
    },
    {
      value: "EXPENSE",
      label: "Expense Report",
      description: "Detailed breakdown of expenses only",
    },
    // Added Budget Report Type
    {
      value: "BUDGET",
      label: "Budget Report",
      description: "Overview of budgets vs. actual spending",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card className="w-full max-w-4xl mx-auto shadow-md border border-border/20 rounded-lg overflow-hidden">
        <CardHeader className="bg-muted/40 p-5 border-b border-border/20">
          <motion.div variants={itemVariants}>
            <CardTitle className="text-xl font-semibold flex items-center gap-2.5 text-foreground">
              <Download className="h-5 w-5 text-primary" />
              Generate & Download Report
            </CardTitle>
            <CardDescription className="text-sm mt-1 text-muted-foreground">
              Configure and generate your financial report.
            </CardDescription>
          </motion.div>
        </CardHeader>

        <motion.div variants={itemVariants}>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Calendar Section (Takes more space) */}
            <div className="md:col-span-3 space-y-3">
              <Label
                htmlFor="date-range-calendar"
                className="text-base font-medium flex items-center gap-2 text-foreground"
              >
                <CalendarIcon className="h-5 w-5 text-primary" />
                Select Date Range
              </Label>
              <div className="p-3 border border-border/30 rounded-md bg-background shadow-sm flex justify-center">
                <Calendar
                  id="date-range-calendar"
                  mode="range"
                  selected={{
                    from: reportConfig.startDate,
                    to: reportConfig.endDate,
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      setReportConfig((prev) => ({
                        ...prev,
                        startDate: range.from as Date,
                        endDate: range.to ?? (range.from as Date),
                      }));
                    } else if (!range?.from && !range?.to) {
                      setReportConfig((prev) => ({
                        ...prev,
                        startDate: new Date(),
                        endDate: new Date(),
                      }));
                    }
                  }}
                  numberOfMonths={1}
                  className="rounded-md p-0" // Remove internal padding of calendar
                />
              </div>
            </div>

            {/* Settings Section (Takes less space) */}
            <div className="md:col-span-2 space-y-5">
              <div className="space-y-3">
                <Label
                  htmlFor="report-type"
                  className="text-base font-medium flex items-center gap-2 text-foreground"
                >
                  <Settings className="h-5 w-5 text-primary" />
                  Report Type
                </Label>
                <Select
                  value={reportConfig.type}
                  onValueChange={(value: ReportConfig["type"]) =>
                    setReportConfig((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger
                    id="report-type"
                    className="h-10 rounded-md border-border/30 bg-background hover:bg-muted/50 transition-colors"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="py-2 cursor-pointer" // Ensure cursor changes
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-foreground">
                            {type.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {type.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="report-format"
                  className="text-base font-medium flex items-center gap-2 text-foreground"
                >
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  Format
                </Label>
                <Select
                  value={reportConfig.format}
                  onValueChange={(value: ReportConfig["format"]) =>
                    setReportConfig((prev) => ({ ...prev, format: value }))
                  }
                >
                  <SelectTrigger
                    id="report-format"
                    className="h-10 rounded-md border-border/30 bg-background hover:bg-muted/50 transition-colors"
                  >
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => (
                      <SelectItem
                        key={format.value}
                        value={format.value}
                        className="py-2 cursor-pointer" // Ensure cursor changes
                      >
                        <div className="flex items-center gap-2">
                          <format.icon className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">
                            {format.label}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </motion.div>

        <motion.div variants={itemVariants}>
          <CardFooter className="bg-muted/40 p-5 border-t border-border/20 flex justify-end">
            <Button
              onClick={generateReport}
              className={cn(
                "h-10 px-5 text-sm font-medium transition-all duration-300",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "rounded-md shadow hover:shadow-md",
                "flex items-center justify-center gap-2",
                isGenerating && "opacity-70 cursor-not-allowed"
              )}
              disabled={isGenerating}
            >
              {!isGenerating &&
                formatOptions.find((f) => f.value === reportConfig.format)
                  ?.icon &&
                React.createElement(
                  formatOptions.find((f) => f.value === reportConfig.format)!
                    .icon,
                  { className: "h-4 w-4" }
                )}
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={
                      {
                        width: 16, // Smaller spinner
                        height: 16,
                        border: "2px solid transparent",
                        borderTopColor: "currentColor",
                        borderRadius: "50%",
                        marginRight: "8px", // Add spacing
                      } as CSSProperties
                    }
                  />
                  <span>Generating...</span>
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </CardFooter>
        </motion.div>
      </Card>
    </motion.div>
  );
}
