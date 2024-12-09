import { NextResponse } from "next/server";
import { checkOnAuthHeader, verifyToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Initialize Prisma client
const prisma = new PrismaClient();

// GET request to get the user profile
export async function GET(request: Request) {
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
    // Find the user with the given ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, emailNotifications: true },
    });

    // if the user is not found, return a not found response
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    // if the token is invalid, return an unauthorized response
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// PUT request to update the user profile
export async function PUT(request: Request) {
  try {
    // Check if the Authorization header is present and valid
    const authHeader = request.headers.get("authorization");
    await checkOnAuthHeader(authHeader);

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // if the token is not present, return an unauthorized response
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token
    const { userId } = await verifyToken(token);
    // if the user id is not found, return an invalid token response
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get the body from the request
    const { name, email, password, emailNotifications } = await request.json();

    // Create an object to update the user with the new data
    const updateData: {
      name?: string;
      email?: string;
      password?: string;
      emailNotifications?: boolean;
    } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (typeof emailNotifications === "boolean") {
      updateData.emailNotifications = emailNotifications;
    }

    // Update the user with the new data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        emailNotifications: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    // if an error occurs, return an internal server error response
    console.error("Error updating user profile:", error);
    // Return an internal server error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
