import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma"; // This should now point to the correctly generated client
import { z } from "zod";
import { randomUUID } from "crypto"; // For generating unique error IDs

// Define a schema for input validation
const UserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  name: z.string().min(1, { message: "Name is required" }),
});

interface ErrorResponse {
  errorId: string;
  message: string;
  details?: Record<string, string[]>; // For field-specific errors
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = UserSchema.safeParse(body);

    if (!validation.success) {
      const errorId = randomUUID();
      console.error(
        `[${errorId}] Signup validation error:`,
        validation.error.flatten().fieldErrors
      );
      return NextResponse.json(
        {
          errorId,
          message: "Validation failed. Please check your input.",
          details: validation.error.flatten().fieldErrors,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Check if user already exists by email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      const errorId = randomUUID();
      console.warn(`[${errorId}] Signup attempt with existing email:`, email);
      return NextResponse.json(
        {
          errorId,
          message: "An account with this email already exists.",
        } as ErrorResponse,
        { status: 409 } // 409 Conflict
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Capture IP and User-Agent
    // Prefer x-forwarded-for, then x-real-ip, then null if neither is present.
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent");

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Field in schema is 'password' for the hash
        name,
        emailVerified: new Date(), // Consider sending a verification email instead
        lastLoginIp: ip,
        userAgent: userAgent,
        // Ensure other required fields from your schema (if any, not specified here) have default values or are included
      },
    });

    console.log(
      `User created successfully: ${user.id}, IP: ${ip}, User-Agent: ${userAgent}`
    );

    return NextResponse.json(
      {
        message: "Account created successfully. Please sign in.",
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const errorId = randomUUID();
    console.error(`[${errorId}] Signup error:`, error);

    // More specific error handling can be added here, e.g., for Prisma unique constraint violations
    if (error.code === "P2002") {
      // Prisma unique constraint violation
      let field = "unknown";
      if (error.meta?.target?.includes("email")) {
        field = "email";
        return NextResponse.json(
          {
            errorId,
            message: "An account with this email already exists.",
          } as ErrorResponse,
          { status: 409 }
        );
      }
      // Add more checks if other unique fields exist, e.g. username
      // else if (error.meta?.target?.includes('username')) {
      //     field = "username";
      //      return NextResponse.json(
      //         {
      //             errorId,
      //             message: "This username is already taken. Please choose another.",
      //         } as ErrorResponse,
      //         { status: 409 }
      //     );
      // }
      console.warn(
        `[${errorId}] Prisma unique constraint violation on field: ${field}`
      );
    }

    return NextResponse.json(
      {
        errorId,
        message:
          "An unexpected error occurred during signup. Please try again later.",
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
