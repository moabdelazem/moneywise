import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { checkOnAuthHeader, verifyToken } from "@/lib/auth";

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Check if the Authorization header is present and valid
  const authHeader = request.headers.get("authorization");
  // Check if the Authorization header is present and valid
  await checkOnAuthHeader(authHeader);

  // if the auth header is not present, return an unauthorized response
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the token from the Authorization header
  const token = authHeader.split(" ")[1];
  try {
    const { userId } = await verifyToken(token);
    // Find all expenses for the user
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    // if an error occurs, return an internal server error response
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Check if the Authorization header is present and valid
  const authHeader = request.headers.get("authorization");
  await checkOnAuthHeader(authHeader);

  // if the auth header is not present, return an unauthorized response
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const { userId } = await verifyToken(token);
    // Get the body from the request
    const { amount, description, date, category } = await request.json();

    // Create a new expense
    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        category,
        userId,
      },
    });

    // Return the new expense
    return NextResponse.json(expense);
  } catch (error) {
    // if an error occurs, return an internal server error response
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
