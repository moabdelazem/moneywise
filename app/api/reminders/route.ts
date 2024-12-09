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
