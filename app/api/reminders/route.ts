import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyToken(token);
    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { dueDate: "asc" },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyToken(token);
    const data = await request.json();

    const reminder = await prisma.reminder.create({
      data: {
        title: data.title,
        amount: parseFloat(data.amount),
        dueDate: new Date(data.dueDate),
        category: data.category,
        status: data.status || "PENDING",
        isRecurring: data.isRecurring || false,
        frequency: data.frequency || null,
        userId,
        lastSent: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyToken(token);
    const { id, status } = await request.json();

    const reminder = await prisma.reminder.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        status,
        lastSent: new Date(),
      },
    });

    return NextResponse.json(reminder);
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyToken(token);
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Reminder ID is required" },
        { status: 400 }
      );
    }

    // Ensure amount is a float and dueDate is a Date object if present
    if (updateData.amount) {
      updateData.amount = parseFloat(updateData.amount);
    }
    if (updateData.dueDate) {
      updateData.dueDate = new Date(updateData.dueDate);
    }
    updateData.updatedAt = new Date();

    const reminder = await prisma.reminder.updateMany({
      where: {
        id,
        userId, // Ensure user can only update their own reminders
      },
      data: updateData,
    });

    if (reminder.count === 0) {
      return NextResponse.json(
        { error: "Reminder not found or unauthorized" },
        { status: 404 }
      );
    }

    // Fetch the updated reminder to return it
    const updatedReminder = await prisma.reminder.findUnique({
      where: { id },
    });

    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyToken(token);

    // Extract the reminderId from the URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Reminder ID is required" },
        { status: 400 }
      );
    }

    const deleteResult = await prisma.reminder.deleteMany({
      where: {
        id,
        userId, // Ensure user can only delete their own reminders
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Reminder not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Reminder deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
