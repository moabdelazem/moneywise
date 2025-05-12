"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  Filter,
  MailIcon,
  Trash2,
  Clock,
  RefreshCw,
  Info,
  ChevronDown,
} from "lucide-react";
import { AddReminderModal } from "./modals/AddReminderModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface Reminder {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  category: string;
  status: string;
  isRecurring: boolean;
  frequency?: string;
  lastSent?: Date | null;
}

interface PaymentReminderProps {
  reminders: Reminder[];
  isLoading: boolean;
  onAddReminder: (reminder: Omit<Reminder, "id" | "status">) => Promise<void>;
  onUpdateReminder: (id: string, status: "PAID" | "PENDING") => Promise<void>;
  onDeleteReminder?: (id: string) => Promise<void>;
}

const getDaysUntilDue = (dueDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0); // Normalize due date to start of day
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export function PaymentReminder({
  reminders,
  isLoading,
  onAddReminder,
  onUpdateReminder,
  onDeleteReminder,
}: PaymentReminderProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<
    "ALL" | "PENDING" | "PAID" | "OVERDUE" | "UPCOMING"
  >("ALL");
  const [sortBy, setSortBy] = useState<"DATE" | "AMOUNT">("DATE");
  const [sendingNotification, setSendingNotification] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  // Apply filters and sorting to reminders
  const filteredReminders = reminders.filter((reminder) => {
    const daysUntilDue = getDaysUntilDue(reminder.dueDate);

    if (filter === "ALL") return true;
    if (filter === "PENDING") return reminder.status === "PENDING";
    if (filter === "PAID") return reminder.status === "PAID";
    if (filter === "OVERDUE")
      return daysUntilDue < 0 && reminder.status === "PENDING";
    if (filter === "UPCOMING")
      return (
        daysUntilDue >= 0 && daysUntilDue <= 7 && reminder.status === "PENDING"
      );

    return true;
  });

  // Sort reminders
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    if (sortBy === "DATE") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "AMOUNT") {
      return b.amount - a.amount;
    }
    return 0;
  });

  // Send a manual notification for a specific reminder
  const sendNotification = async (reminderId: string) => {
    if (!reminderId) return;

    setSendingNotification(reminderId);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch("/api/reminders/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reminderId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send notification");
      }

      // Success
      toast({
        title: "Notification sent",
        description: "Payment reminder email has been sent",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Notification failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setSendingNotification(null);
    }
  };

  // Handle reminder deletion
  const handleDeleteReminder = async (id: string) => {
    if (onDeleteReminder) {
      try {
        await onDeleteReminder(id);
        toast({
          title: "Reminder deleted",
          description: "Payment reminder has been removed",
        });
      } catch (error) {
        console.error("Error deleting reminder:", error);
        toast({
          title: "Delete failed",
          description:
            error instanceof Error
              ? error.message
              : "Failed to delete reminder",
          variant: "destructive",
        });
      }
    }
  };

  // Stats for the reminder summary
  const stats = {
    total: reminders.length,
    pending: reminders.filter((r) => r.status === "PENDING").length,
    overdue: reminders.filter(
      (r) => r.status === "PENDING" && getDaysUntilDue(r.dueDate) < 0
    ).length,
    dueToday: reminders.filter(
      (r) => r.status === "PENDING" && getDaysUntilDue(r.dueDate) === 0
    ).length,
    upcoming: reminders.filter(
      (r) =>
        r.status === "PENDING" &&
        getDaysUntilDue(r.dueDate) > 0 &&
        getDaysUntilDue(r.dueDate) <= 7
    ).length,
    totalAmount: reminders
      .filter((r) => r.status === "PENDING")
      .reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-4"
      >
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 shadow-md border border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              Payment Summary
            </CardTitle>
            <CardDescription>
              Overview of your upcoming payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-3 shadow-sm">
                <div className="text-sm text-muted-foreground mb-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Pending
                </div>
                <div className="text-2xl font-semibold">{stats.pending}</div>
              </div>
              <div className="bg-background rounded-lg p-3 shadow-sm">
                <div className="text-sm text-muted-foreground mb-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" /> Overdue
                </div>
                <div className="text-2xl font-semibold text-red-500">
                  {stats.overdue}
                </div>
              </div>
              <div className="bg-background rounded-lg p-3 shadow-sm col-span-2 sm:col-span-1">
                <div className="text-sm text-muted-foreground mb-1 flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" /> Total Due
                </div>
                <div className="text-2xl font-semibold">
                  ${stats.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Reminders Card */}
        <Card className="bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-xl shadow-xl border-opacity-50 border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-0">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                Payment Reminders
              </CardTitle>
              <CardDescription className="mt-1.5">
                Keep track of your upcoming payments
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    <span>
                      {filter.charAt(0) + filter.slice(1).toLowerCase()}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter Reminders</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setFilter("ALL")}
                      className={filter === "ALL" ? "bg-primary/10" : ""}
                    >
                      All Reminders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter("PENDING")}
                      className={filter === "PENDING" ? "bg-primary/10" : ""}
                    >
                      Pending Only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter("PAID")}
                      className={filter === "PAID" ? "bg-primary/10" : ""}
                    >
                      Paid Only
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter("OVERDUE")}
                      className={filter === "OVERDUE" ? "bg-primary/10" : ""}
                    >
                      Overdue
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilter("UPCOMING")}
                      className={filter === "UPCOMING" ? "bg-primary/10" : ""}
                    >
                      Due Within Week
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setSortBy("DATE")}
                      className={sortBy === "DATE" ? "bg-primary/10" : ""}
                    >
                      Due Date
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSortBy("AMOUNT")}
                      className={sortBy === "AMOUNT" ? "bg-primary/10" : ""}
                    >
                      Amount (High to Low)
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                size="sm"
                variant="default"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 mt-2">
            {isLoading ? (
              <LoadingState />
            ) : sortedReminders.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <ScrollArea className="h-[450px] pr-4">
                <AnimatePresence mode="popLayout">
                  {sortedReminders.map((reminder) => (
                    <ReminderItem
                      key={reminder.id}
                      reminder={reminder}
                      onUpdateReminder={onUpdateReminder}
                      onDeleteReminder={handleDeleteReminder}
                      onSendNotification={sendNotification}
                      isSendingNotification={
                        sendingNotification === reminder.id
                      }
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

function EmptyState({ filter = "ALL" }: { filter?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
      <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
      <p className="text-lg font-medium">
        No {filter !== "ALL" ? filter.toLowerCase() : ""} payment reminders
        found
      </p>
      <p className="text-sm text-center max-w-[300px]">
        {filter === "ALL"
          ? "Add your first reminder to stay on top of your payments"
          : filter === "PAID"
          ? "You haven't marked any reminders as paid"
          : filter === "OVERDUE"
          ? "Great! You have no overdue payments"
          : filter === "UPCOMING"
          ? "No payments due in the upcoming week"
          : "Try changing your filter settings to see other reminders"}
      </p>
    </div>
  );
}

function ReminderItem({
  reminder,
  onUpdateReminder,
  onDeleteReminder,
  onSendNotification,
  isSendingNotification,
}: {
  reminder: Reminder;
  onUpdateReminder: (id: string, status: "PAID" | "PENDING") => Promise<void>;
  onDeleteReminder?: (id: string) => Promise<void>;
  onSendNotification?: (id: string) => Promise<void>;
  isSendingNotification?: boolean;
}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const daysUntilDue = getDaysUntilDue(reminder.dueDate);

  const handleStatusUpdate = async (status: "PAID" | "PENDING") => {
    try {
      setIsUpdating(true);
      await onUpdateReminder(reminder.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const lastSentText = reminder.lastSent
    ? `Last notification sent ${new Date(
        reminder.lastSent
      ).toLocaleDateString()}`
    : "No notifications sent yet";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="mb-4 last:mb-0"
    >
      <Card className="overflow-hidden border-border/60 text-card-foreground hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          <div
            className={`flex items-center justify-between p-4 bg-card hover:bg-accent/30 transition-colors duration-300 relative ${
              daysUntilDue < 0 && reminder.status === "PENDING"
                ? "border-l-4 border-red-500"
                : ""
            }`}
          >
            {/* Recurring indicator */}
            {reminder.isRecurring && (
              <div className="absolute top-2 right-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="bg-primary/10 p-1 rounded-full">
                        <RefreshCw className="h-3 w-3 text-primary" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Recurring: {reminder.frequency}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}

            <div className="space-y-1.5 flex-grow mr-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold tracking-tight text-lg truncate max-w-[250px] sm:max-w-none">
                  {reminder.title}
                </h4>
                <Badge className="ml-2 bg-primary/15 text-primary hover:bg-primary/20 border-transparent">
                  {reminder.category}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(reminder.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}

                <HoverCard openDelay={300} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full p-0 ml-1"
                    >
                      <Info className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-1 text-sm">
                      <p className="text-xs text-muted-foreground">
                        {lastSentText}
                      </p>
                      {reminder.status === "PENDING" && (
                        <>
                          <p className="text-xs mt-2">
                            Notifications are automatically sent:
                          </p>
                          <ul className="text-xs list-disc pl-4 text-muted-foreground">
                            <li>7 days before due date</li>
                            <li>3 days before due date</li>
                            <li>1 day before due date</li>
                            <li>On the due date</li>
                          </ul>
                        </>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>

            <div className="flex items-center gap-3">
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

              <div className="flex flex-col sm:flex-row gap-2">
                {reminder.status === "PENDING" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleStatusUpdate("PAID")}
                          disabled={isUpdating}
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

                {reminder.status === "PAID" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleStatusUpdate("PENDING")}
                          disabled={isUpdating}
                          className="rounded-full hover:bg-primary hover:text-white transition-colors duration-300"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as Pending</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {onSendNotification && reminder.status === "PENDING" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onSendNotification(reminder.id)}
                          disabled={isSendingNotification}
                          className="rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-300"
                        >
                          {isSendingNotification ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <MailIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send Reminder Email</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {onDeleteReminder && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => onDeleteReminder(reminder.id)}
                          className="rounded-full hover:bg-red-500 hover:text-white transition-colors duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Reminder</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
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
  };

  return (
    <Badge className={`${getStatusColor(status, daysUntilDue)} shadow-sm`}>
      {getStatusText(status, daysUntilDue)}
    </Badge>
  );
}
