import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { emailService } from "@/utils/emailService";
import { emailTemplates } from "@/utils/emailTemplates";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

// Helper function to calculate days until due
const getDaysUntilDue = (dueDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to start of day
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0); // Normalize due date to start of day
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Function to check if a reminder should send a notification
const shouldSendNotification = (reminder: any) => {
  // Only send for PENDING reminders
  if (reminder.status !== "PENDING") return false;

  const daysUntilDue = getDaysUntilDue(reminder.dueDate);

  // Send notifications for: Today, Tomorrow, 3 days, 1 week
  const notificationThresholds = [0, 1, 3, 7];

  // Skip if due date has passed
  if (daysUntilDue < 0) return false;

  // Check if days until due matches a notification threshold
  if (!notificationThresholds.includes(daysUntilDue)) return false;

  // Check if a notification has been sent today
  if (reminder.lastSent) {
    const lastSent = new Date(reminder.lastSent);
    const today = new Date();

    // If last sent is today, don't send again
    if (lastSent.toDateString() === today.toDateString()) return false;
  }

  return true;
};

export async function GET(request: Request) {
  // Add auth to protect this endpoint
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyToken(token);

    // Look up user's email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all pending reminders
    const reminders = await prisma.reminder.findMany({
      where: {
        userId,
        status: "PENDING",
      },
      orderBy: { dueDate: "asc" },
    });

    // Track which reminders we send notifications for
    const notificationsSent = [];

    // Process each reminder
    for (const reminder of reminders) {
      if (shouldSendNotification(reminder)) {
        const daysUntilDue = getDaysUntilDue(reminder.dueDate);

        // Send email notification
        const emailResult = await emailService.sendMail(
          user.email,
          emailTemplates.paymentReminder(user.name, {
            title: reminder.title,
            amount: reminder.amount,
            dueDate: reminder.dueDate,
            category: reminder.category,
            daysUntilDue,
          }).subject,
          emailTemplates.paymentReminder(user.name, {
            title: reminder.title,
            amount: reminder.amount,
            dueDate: reminder.dueDate,
            category: reminder.category,
            daysUntilDue,
          }).html
        );

        if (emailResult) {
          // Update lastSent timestamp
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { lastSent: new Date() },
          });

          notificationsSent.push({
            id: reminder.id,
            title: reminder.title,
            daysUntilDue,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
      count: notificationsSent.length,
    });
  } catch (error) {
    console.error("Error processing reminder notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST endpoint to manually trigger a notification for a specific reminder
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyToken(token);
    const { reminderId } = await request.json();

    if (!reminderId) {
      return NextResponse.json(
        { error: "Reminder ID is required" },
        { status: 400 }
      );
    }

    // Get the reminder and verify ownership
    const reminder = await prisma.reminder.findFirst({
      where: {
        id: reminderId,
        userId,
      },
    });

    if (!reminder) {
      return NextResponse.json(
        { error: "Reminder not found or unauthorized" },
        { status: 404 }
      );
    }

    // Look up user's email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const daysUntilDue = getDaysUntilDue(reminder.dueDate);

    // Send email notification
    const emailResult = await emailService.sendMail(
      user.email,
      emailTemplates.paymentReminder(user.name, {
        title: reminder.title,
        amount: reminder.amount,
        dueDate: reminder.dueDate,
        category: reminder.category,
        daysUntilDue,
      }).subject,
      emailTemplates.paymentReminder(user.name, {
        title: reminder.title,
        amount: reminder.amount,
        dueDate: reminder.dueDate,
        category: reminder.category,
        daysUntilDue,
      }).html
    );

    if (emailResult) {
      // Update lastSent timestamp
      await prisma.reminder.update({
        where: { id: reminder.id },
        data: { lastSent: new Date() },
      });

      return NextResponse.json({
        success: true,
        message: "Notification sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send notification" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending reminder notification:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
