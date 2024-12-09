import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { userId } = await verifyToken(token);

    // Delete user's transactions and budgets
    await prisma.expense.deleteMany({
      where: { userId: userId },
    });

    await prisma.budget.deleteMany({
      where: { userId: userId },
    });

    // Reset user settings to default
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        currency: "USD",
        emailNotifications: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        currency: true,
        emailNotifications: true,
      },
    });

    return NextResponse.json({
      message: "Account reset successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error resetting user account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
