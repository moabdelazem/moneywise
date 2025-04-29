import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { AuthHeader } from "./types";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function signUp(name: string, email: string, password: string) {
  // check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  // if the user already exists, throw an error
  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // create a token for the user
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  // return the user and the token
  return { user, token };
}

export async function login(email: string, password: string) {
  console.log(`Login attempt for email: ${email}`); // Log input email
  // check if the user exists
  const user = await prisma.user.findUnique({ where: { email } });
  // if the user does not exist, throw an error
  if (!user) {
    console.error(`Login failed: User not found for email: ${email}`); // Log failure
    throw new Error("Invalid credentials");
  }

  console.log(`User found: ${user.id}. Comparing password.`); // Log user found
  console.log(`Stored hash: ${user.password}`); // Log the stored hash

  // check if the password is valid
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log(`Password comparison result: ${isPasswordValid}`); // Log comparison result

  // if the password is not valid, throw an error
  if (!isPasswordValid) {
    console.error(`Login failed: Password mismatch for user: ${user.email}`); // Log failure
    throw new Error("Invalid credentials");
  }

  // create a token for the user
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  console.log(`Login successful for user: ${user.email}`); // Log success

  // return the user and the token
  return { user, token };
}

// verify the token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    return payload as { userId: string };
  } catch {
    throw new Error("Invalid token");
  }
}

// Check if the Authorization header is present and valid
// If not, return an unauthorized response
export async function checkOnAuthHeader(authHeader: AuthHeader) {
  // if the auth header is not present, return an unauthorized response
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
