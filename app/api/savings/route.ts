import { checkOnAuthHeader, verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Initialize Prisma client
const prisma = new PrismaClient();

// GET all savings for the user
export async function GET(request: NextRequest) {
  try {
    // Get the Authorization header from the request
    const authHeader = request.headers.get("Authorization");
    // Check if the Authorization header is valid
    await checkOnAuthHeader(authHeader);

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the user's token
    const { userId } = await verifyToken(token);

    // Find all savings for the user
    const savings = await prisma.savings.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Return the savings
    return NextResponse.json(savings);
  } catch (error) {
    console.error("Error fetching savings:", error);
    return NextResponse.json(
      { error: "Failed to fetch savings" },
      { status: 500 }
    );
  }
}

// POST a new savings for the user
export async function POST(request: NextRequest) {
  try {
    // Get the Authorization header from the request
    const authHeader = request.headers.get("Authorization");
    // Check if the Authorization header is valid
    await checkOnAuthHeader(authHeader);

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the user's token
    const { userId } = await verifyToken(token);

    // Get and validate the request body
    const { amount, description } = await request.json();

    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount is required and must be a number" },
        { status: 400 }
      );
    }

    // Create a new savings record in the database
    const newSavings = await prisma.savings.create({
      data: {
        amount,
        description: description || "",
        userId,
      },
    });

    return NextResponse.json(newSavings);
  } catch (error) {
    console.error("Error creating savings:", error);
    return NextResponse.json(
      { error: "Failed to create savings" },
      { status: 500 }
    );
  }
}

// Update a savings record for the user
export async function PUT(request: NextRequest) {
  try {
    // Get the Authorization header from the request
    const authHeader = request.headers.get("Authorization");
    // Check if the Authorization header is valid
    await checkOnAuthHeader(authHeader);

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the user's token
    const { userId } = await verifyToken(token);

    // Get and validate the request body
    const { id, amount, description } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Savings ID is required" },
        { status: 400 }
      );
    }

    if (amount !== undefined && typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount must be a number" },
        { status: 400 }
      );
    }

    // Check if the savings record exists and belongs to the user
    const existingSavings = await prisma.savings.findFirst({
      where: { id, userId },
    });

    if (!existingSavings) {
      return NextResponse.json(
        { error: "Savings record not found" },
        { status: 404 }
      );
    }

    // Update the savings record in the database
    const updatedSavings = await prisma.savings.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json(updatedSavings);
  } catch (error) {
    console.error("Error updating savings:", error);
    return NextResponse.json(
      { error: "Failed to update savings" },
      { status: 500 }
    );
  }
}

// Delete a savings record for the user
export async function DELETE(request: NextRequest) {
  try {
    // Get the Authorization header from the request
    const authHeader = request.headers.get("Authorization");
    // Check if the Authorization header is valid
    await checkOnAuthHeader(authHeader);

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the user's token
    const { userId } = await verifyToken(token);

    // Get and validate the request body
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Savings ID is required" },
        { status: 400 }
      );
    }

    // Check if the savings record exists and belongs to the user
    const existingSavings = await prisma.savings.findFirst({
      where: { id, userId },
    });

    if (!existingSavings) {
      return NextResponse.json(
        { error: "Savings record not found" },
        { status: 404 }
      );
    }

    // Delete the savings record from the database
    const deletedSavings = await prisma.savings.delete({
      where: { id },
    });

    return NextResponse.json(deletedSavings);
  } catch (error) {
    console.error("Error deleting savings:", error);
    return NextResponse.json(
      { error: "Failed to delete savings" },
      { status: 500 }
    );
  }
}
