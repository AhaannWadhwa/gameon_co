import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validation/auth";
import {
  formatErrorResponse,
  logError,
  ConflictError,
  ValidationError,
} from "@/lib/errors";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input using shared schema
    const validatedData = signupSchema.parse(body);
    const { name, email, phone, password, dateOfBirth, role } = validatedData;

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("An account with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile in a transaction (atomic operation)
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          dateOfBirth: new Date(dateOfBirth),
          password: hashedPassword,
          role,
          status: "ACTIVE",
          emailVerified: new Date(), // Auto-verify for now
        },
      });

      // Create role-specific profile
      if (role === "ATHLETE") {
        await tx.athleteProfile.create({
          data: {
            userId: newUser.id,
            primarySport: "Soccer", // Default, user will update in onboarding
            secondarySports: [],
            positions: [],
          },
        });
      } else if (role === "COACH") {
        await tx.coachProfile.create({
          data: {
            userId: newUser.id,
            specialization: [],
            qualifications: [],
          },
        });
      } else if (role === "ACADEMY") {
        await tx.academyProfile.create({
          data: {
            userId: newUser.id,
            name: newUser.name,
            type: "Academy",
            sports: [],
            ageGroups: [],
            facilities: [],
          },
        });
      }

      return newUser;
    });

    console.log(`✅ New user registered: ${user.email} (${user.role})`);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    logError(error, "REGISTER_API");

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const validationError = new ValidationError(
        "Please check your input and try again"
      );
      const errorResponse = formatErrorResponse(validationError);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Handle all other errors with formatted response
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(errorResponse, {
      status: errorResponse.statusCode,
    });
  }
}
