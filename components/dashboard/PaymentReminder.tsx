"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Plus, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { AddReminderModal } from "./modals/AddReminderModal";

interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  category: string;
  status: string;
  isRecurring: boolean;
  frequency?: string;
}

interface PaymentReminderProps {
  reminders: Reminder[];
  isLoading: boolean;
  onAddReminder: (reminder: Omit<Reminder, "id" | "status">) => Promise<void>;
  onUpdateReminder: (id: string, status: "PAID" | "PENDING") => Promise<void>;
}

export function PaymentReminder({
  reminders,
  isLoading,
  onAddReminder,
  onUpdateReminder,
}: PaymentReminderProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const sortedReminders = reminders.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusColor = (status: string, daysUntilDue: number) => {
    if (status === "PAID") return "bg-emerald-500/80 text-emerald-50";
    if (daysUntilDue <= 0) return "bg-red-500/80 text-red-50";
    if (daysUntilDue <= 3) return "bg-amber-500/80 text-amber-50";
    return "bg-blue-500/80 text-blue-50";
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl shadow-xl border-opacity-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Payment Reminders
            </CardTitle>
            <Button
              size="sm"
              variant="default"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full animate-pulse" />
                ))}
              </div>
            ) : sortedReminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
                <p>No payment reminders set</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {sortedReminders.map((reminder) => {
                    const daysUntilDue = getDaysUntilDue(reminder.dueDate);
                    return (
                      <motion.div
                        key={reminder.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between p-4 bg-card/60 rounded-xl border border-border/50 shadow-sm hover:shadow-md hover:bg-card/80 transition-all duration-300"
                      >
                        <div className="space-y-1.5">
                          <h4 className="font-semibold tracking-tight">
                            {reminder.title}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(reminder.dueDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                            {reminder.isRecurring && (
                              <Badge
                                variant="outline"
                                className="ml-2 bg-background/50"
                              >
                                {reminder.frequency}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold flex items-center text-lg">
                              <DollarSign className="h-4 w-4" />
                              {reminder.amount.toFixed(2)}
                            </div>
                            <Badge
                              className={`${getStatusColor(
                                reminder.status,
                                daysUntilDue
                              )} shadow-sm`}
                            >
                              {reminder.status === "PENDING"
                                ? `Due in ${daysUntilDue} days`
                                : reminder.status}
                            </Badge>
                          </div>
                          {reminder.status === "PENDING" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onUpdateReminder(reminder.id, "PAID")
                              }
                              className="hover:bg-emerald-500 hover:text-white transition-colors duration-300"
                            >
                              Mark as Paid
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <AddReminderModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddReminder={onAddReminder}
      />
    </>
  );
}
