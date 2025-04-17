"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  Plus,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AddReminderModal } from "./modals/AddReminderModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const getDaysUntilDue = (dueDate: Date) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl shadow-xl border-opacity-50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" />
              Payment Reminders
            </CardTitle>
            <Button
              size="sm"
              variant="default"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <LoadingState />
            ) : sortedReminders.length === 0 ? (
              <EmptyState />
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <AnimatePresence mode="popLayout">
                  {sortedReminders.map((reminder) => (
                    <ReminderItem
                      key={reminder.id}
                      reminder={reminder}
                      onUpdateReminder={onUpdateReminder}
                    />
                  ))}
                </AnimatePresence>
              </ScrollArea>
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

function LoadingState() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
      <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
      <p className="text-lg font-medium">No payment reminders set</p>
      <p className="text-sm text-center max-w-[250px]">
        Add your first reminder to stay on top of your payments
      </p>
    </div>
  );
}

function ReminderItem({
  reminder,
  onUpdateReminder,
}: {
  reminder: Reminder;
  onUpdateReminder: (id: string, status: "PAID" | "PENDING") => Promise<void>;
}) {
  const daysUntilDue = getDaysUntilDue(reminder.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="mb-4 last:mb-0"
    >
      <Card className="overflow-hidden border-border text-card-foreground ">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 bg-card hover:bg-accent transition-colors duration-300 ">
            <div className="space-y-1.5">
              <h4 className="font-semibold tracking-tight text-lg">
                {reminder.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(reminder.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {reminder.isRecurring && (
                  <Badge variant="outline" className="ml-2 bg-background/50">
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
                <StatusBadge
                  status={reminder.status}
                  daysUntilDue={daysUntilDue}
                />
              </div>
              {reminder.status === "PENDING" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onUpdateReminder(reminder.id, "PAID")}
                        className="rounded-full hover:bg-emerald-500 hover:text-white transition-colors duration-300"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark as Paid</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusBadge({
  status,
  daysUntilDue,
}: {
  status: string;
  daysUntilDue: number;
}) {
  const getStatusColor = (status: string, daysUntilDue: number) => {
    if (status === "PAID") return "bg-emerald-500 text-emerald-50";
    if (daysUntilDue < 0) return "bg-red-600 text-red-50";
    if (daysUntilDue === 0) return "bg-red-500 text-red-50";
    if (daysUntilDue <= 3) return "bg-amber-500 text-amber-50";
    return "bg-blue-500 text-blue-50";
  };

  const getStatusText = (status: string, daysUntilDue: number) => {
    if (status === "PAID") return "Paid";
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    if (daysUntilDue === 0) return "Due Today";
    return `Due in ${daysUntilDue} days`;
  }

  return (
    <Badge className={`${getStatusColor(status, daysUntilDue)} shadow-sm`}>
      {getStatusText(status, daysUntilDue)}
    </Badge>
  );
}
