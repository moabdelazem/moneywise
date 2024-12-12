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
import { FileDown, FileSpreadsheet, FileText, Calendar as CalendarIcon } from "lucide-react";
import { ReportConfig, Expense, Budget } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ReportsGeneratorProps {
  expenses: Expense[];
  budgets: Budget[];
}

export function ReportsGenerator({ expenses, budgets }: ReportsGeneratorProps) {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    startDate: new Date(),
    endDate: new Date(),
    format: 'CSV', // Changed default from PDF to CSV since PDF isn't in formatOptions
    type: 'COMPLETE'
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
          budgets
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
      a.download = `financial-report-${reportConfig.type.toLowerCase()}-${new Date().toISOString().split('T')[0]}.${reportConfig.format.toLowerCase()}`;
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
        description: error instanceof Error ? error.message : "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatOptions = [
    { value: 'CSV', label: 'CSV Spreadsheet', icon: FileDown },
    { value: 'EXCEL', label: 'Excel Workbook', icon: FileSpreadsheet },
  ];

  const reportTypes = [
    { value: 'COMPLETE', label: 'Complete Report', description: 'Full financial overview with all details' },
    { value: 'EXPENSE', label: 'Expense Report', description: 'Detailed breakdown of all expenses' },
  ];

  return (
    <Card className="bg-gradient-to-br from-white/95 to-white/90 dark:from-neutral-800/95 dark:to-neutral-900/90 backdrop-blur-lg shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl font-bold flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <CalendarIcon className="h-8 w-8 text-blue-500" />
          Generate Financial Reports
        </CardTitle>
        <CardDescription className="text-base text-neutral-600 dark:text-neutral-300">
          Create detailed financial reports for your records and analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <label className="text-sm font-semibold flex items-center gap-2 text-neutral-700 dark:text-neutral-200">
              <CalendarIcon className="h-4 w-4 text-blue-500" />
              Date Range
            </label>
            <div className="p-6 border rounded-xl bg-white/80 dark:bg-neutral-800/80 shadow-sm backdrop-blur-sm">
              <Calendar
                mode="range"
                selected={{
                  from: reportConfig.startDate,
                  to: reportConfig.endDate,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setReportConfig(prev => {
                      return {
                        ...prev,
                        startDate: range.from as Date,
                        endDate: range.to as Date,
                      };
                    });
                  }
                }}
                className="rounded-lg border-neutral-200 dark:border-neutral-700"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Report Configuration</label>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Select
                    value={reportConfig.type}
                    onValueChange={(value: ReportConfig["type"]) =>
                      setReportConfig(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="py-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{type.label}</span>
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Select
                    value={reportConfig.format}
                    onValueChange={(value: ReportConfig["format"]) =>
                      setReportConfig(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger className="w-full h-12 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-neutral-200 dark:border-neutral-700">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formatOptions.map((format) => (
                        <SelectItem key={format.value} value={format.value} className="py-2">
                          <div className="flex items-center gap-3">
                            <format.icon className="h-5 w-5 text-blue-500" />
                            <span className="font-medium">{format.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={generateReport}
          className={cn(
            "w-full h-14 text-lg font-semibold transition-all bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
            isGenerating && "opacity-80"
          )}
          disabled={isGenerating}
        >
          {formatOptions.find(f => f.value === reportConfig.format)?.icon && (
            <div className="mr-3">
              {React.createElement(formatOptions.find(f => f.value === reportConfig.format)!.icon, {
                className: "h-5 w-5"
              })}
            </div>
          )}
          {isGenerating ? "Generating Report..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  );
}