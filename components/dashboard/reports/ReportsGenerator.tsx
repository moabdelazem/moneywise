"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
} from "lucide-react";
import { ReportConfig, Expense, Budget } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ReportsGeneratorProps {
  expenses: Expense[];
  budgets: Budget[];
}

export function ReportsGenerator({ expenses, budgets }: ReportsGeneratorProps) {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    startDate: new Date(),
    endDate: new Date(),
    format: "CSV", // Changed default from PDF to CSV since PDF isn't in formatOptions
    type: "COMPLETE",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    try {
      setIsGenerating(true);

      // Validate date range
      if (reportConfig.startDate > reportConfig.endDate) {
        throw new Error("Start date must be before end date");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...reportConfig,
          expenses,
          budgets,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to generate report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `financial-report-${reportConfig.type.toLowerCase()}-${
        new Date().toISOString().split("T")[0]
      }.${reportConfig.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      a.remove(); // Clean up DOM
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Report generated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Report generation error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate report. Please try again.",
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
      description: "Full financial overview with all details",
    },
    {
      value: "EXPENSE",
      label: "Expense Report",
      description: "Detailed breakdown of all expenses",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-background via-background/90 to-background backdrop-blur-xl shadow-2xl border-border/50">
        <CardHeader className="pb-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CardTitle className="text-4xl font-bold flex items-center gap-4">
              <CalendarIcon className="h-10 w-10 text-primary" />
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                Financial Reports
              </span>
            </CardTitle>
            <CardDescription className="text-lg mt-2 text-muted-foreground">
              Generate comprehensive financial reports with customizable
              parameters
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="space-y-4"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <CalendarIcon className="h-4 w-4 text-primary" />
                Select Date Range
              </label>
              <div className="p-6 rounded-2xl bg-card/50 shadow-lg backdrop-blur-lg border-border/50 hover:shadow-xl transition-shadow duration-300">
                <Calendar
                  mode="range"
                  selected={{
                    from: reportConfig.startDate,
                    to: reportConfig.endDate,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setReportConfig((prev) => {
                        return {
                          ...prev,
                          startDate: range.from as Date,
                          endDate: range.to as Date,
                        };
                      });
                    }
                  }}
                  className="rounded-xl border-border/50"
                />
              </div>
            </motion.div>

            <motion.div
              className="space-y-8"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="space-y-6">
                <label className="text-sm font-semibold text-foreground">
                  Report Settings
                </label>
                <div className="space-y-6">
                  <Select
                    value={reportConfig.type}
                    onValueChange={(value: ReportConfig["type"]) =>
                      setReportConfig((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="w-full h-14 bg-card/50 backdrop-blur-lg border-border/50 rounded-xl hover:shadow-md transition-shadow duration-300">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value}
                          className="py-3"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
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

                  <Select
                    value={reportConfig.format}
                    onValueChange={(value: ReportConfig["format"]) =>
                      setReportConfig((prev) => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger className="w-full h-14 bg-card/50 backdrop-blur-lg border-border/50 rounded-xl hover:shadow-md transition-shadow duration-300">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((format) => (
                        <SelectItem
                          key={format.value}
                          value={format.value}
                          className="py-2"
                        >
                          <div className="flex items-center gap-3">
                            <format.icon className="h-5 w-5 text-primary" />
                            <span className="font-medium">{format.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={generateReport}
              className={cn(
                "w-full h-16 text-lg font-semibold transition-all duration-300",
                "bg-gradient-to-r from-primary to-primary",
                "hover:from-primary/90 hover:to-primary/90",
                "rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02]",
                "border border-primary/10",
                isGenerating && "opacity-80"
              )}
              disabled={isGenerating}
            >
              {formatOptions.find((f) => f.value === reportConfig.format)
                ?.icon && (
                <motion.div
                  className="mr-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {React.createElement(
                    formatOptions.find((f) => f.value === reportConfig.format)!
                      .icon,
                    {
                      className: "h-6 w-6",
                    }
                  )}
                </motion.div>
              )}
              {isGenerating ? "Generating Report..." : "Generate Report"}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
