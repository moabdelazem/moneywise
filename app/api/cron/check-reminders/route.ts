import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { emailService } from "@/utils/emailService";
import { emailTemplates } from "@/utils/emailTemplates";

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

// Secure this endpoint with a secret key
// In a production environment, use a proper authentication method for cron jobs
const CRON_SECRET = process.env.CRON_SECRET || "your-cron-secret-key";

export async function GET(request: Request) {
  // Verify authorization by checking the secret key in headers
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all active reminders that need notifications
    const activePendingReminders = await prisma.reminder.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const results = [];
    let successCount = 0;

    // Process each reminder
    for (const reminder of activePendingReminders) {
      const daysUntilDue = getDaysUntilDue(reminder.dueDate);

      // Only send notifications for specific days
      const notificationThresholds = [0, 1, 3, 7];

      if (daysUntilDue >= 0 && notificationThresholds.includes(daysUntilDue)) {
        // Check if notification already sent today
        if (reminder.lastSent) {
          const lastSent = new Date(reminder.lastSent);
          const today = new Date();

          // Skip if already sent today
          if (lastSent.toDateString() === today.toDateString()) {
            results.push({
              id: reminder.id,
              status: "skipped",
              reason: "Already sent today",
            });
            continue;
          }
        }

        // Send email notification
        try {
          const emailResult = await emailService.sendMail(
            reminder.user.email,
            emailTemplates.paymentReminder(reminder.user.name, {
              title: reminder.title,
              amount: reminder.amount,
              dueDate: reminder.dueDate,
              category: reminder.category,
              daysUntilDue,
            }).subject,
            emailTemplates.paymentReminder(reminder.user.name, {
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

            results.push({
              id: reminder.id,
              status: "sent",
              daysUntilDue,
            });

            successCount++;
          } else {
            results.push({
              id: reminder.id,
              status: "failed",
              reason: "Email sending failed",
            });
          }
        } catch (emailError) {
          console.error(
            `Error sending email for reminder ${reminder.id}:`,
            emailError
          );
          results.push({
            id: reminder.id,
            status: "error",
            reason: "Email sending error",
          });
        }
      } else {
        results.push({
          id: reminder.id,
          status: "skipped",
          reason:
            daysUntilDue < 0
              ? "Due date has passed"
              : "Not a notification threshold day",
          daysUntilDue,
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: activePendingReminders.length,
      successCount,
      results,
    });
  } catch (error) {
    console.error("Error in check-reminders cron job:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
