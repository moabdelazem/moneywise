import { NextResponse } from "next/server";
import { signUp } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const { user, token } = await signUp(name, email, password);
    return NextResponse.json({ user, token });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
