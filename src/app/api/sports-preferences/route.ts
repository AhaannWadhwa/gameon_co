import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const sportsPreferencesSchema = z.object({
  sports: z.array(z.string()).min(1, "At least one sport must be selected"),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { sports } = sportsPreferencesSchema.parse(body);

    // Update user's interests and mark onboarding as completed
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        interests: sports,
        onboardingCompleted: true,
      },
      select: {
        id: true,
        email: true,
        interests: true,
        onboardingCompleted: true,
      },
    });

    return NextResponse.json(
      {
        message: "Sports preferences saved successfully",
        user
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SPORTS_PREFERENCES_API_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
