import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
// import { emailService } from "@/utils/emailService";
// import { emailTemplates } from "@/utils/emailTemplates";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const { user, token } = await login(email, password);

    // // Send login notification email asynchronously without waiting
    // emailService
    //   .sendMail(
    //     email,
    //     emailTemplates.loginAlert(email).subject,
    //     emailTemplates.loginAlert(email).html
    //   )
    //   .catch((error) => {
    //     console.error("Failed to send login notification email:", error);
    //   });

    return NextResponse.json({ user, token });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
