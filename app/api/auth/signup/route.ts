import { NextResponse } from "next/server";
import { signUp } from "@/lib/auth";
import { emailService } from "@/utils/emailService";
import { emailTemplates } from "@/utils/emailTemplates";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    const { user, token } = await signUp(name, email, password);

    // Send welcome email asynchronously without waiting
    const welcomeTemplate = emailTemplates.welcome(name);
    emailService
      .sendMail(email, welcomeTemplate.subject, welcomeTemplate.html)
      .catch((error) => {
        console.error("Failed to send welcome email:", error);
      });

    return NextResponse.json({
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
