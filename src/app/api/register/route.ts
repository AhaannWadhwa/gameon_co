import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").refine((email) => email.endsWith("@gmail.com"), {
    message: "Only @gmail.com addresses are allowed",
  }),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ATHLETE", "COACH", "ACADEMY"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status: "ACTIVE",
        emailVerified: new Date(),
      },
    });

    // Create empty profile based on role
    if (role === 'ATHLETE') {
        await prisma.athleteProfile.create({ data: { userId: user.id, primarySport: "Soccer", secondarySports: [], positions: [] } });
    } else if (role === 'COACH') {
        await prisma.coachProfile.create({ data: { userId: user.id, specialization: [], qualifications: [] } });
    } else if (role === 'ACADEMY') {
        await prisma.academyProfile.create({ data: { userId: user.id, name: user.name, type: "Academy", sports: [], ageGroups: [], facilities: [] } });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_API_ERROR]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation error", errors: (error as z.ZodError).errors },
        { status: 400 }
      );
    }

    if ((error as any).code === 'P2002') {
        return NextResponse.json(
            { message: "User with this email already exists" },
            { status: 409 }
        );
    }

    if ((error as any).code === 'P1001') {
        return NextResponse.json(
            { message: "Database connection failed. Please check if the database is running." },
            { status: 503 } // Service Unavailable
        );
    }

    return NextResponse.json(
      { message: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
