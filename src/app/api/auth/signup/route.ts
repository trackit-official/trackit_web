import { signUpSchema } from "@/validation/auth";
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { hash } from "bcrypt";
import logger from "@/libs/logger";
import { getClientIp, getUserAgent } from "@/libs/ratelimit";

// Define error structure for consistent responses
interface ErrorResponse {
  error: string;
  message: string;
  errorId?: string;
  details?: string[];
}

export async function POST(request: Request) {
  const clientIp = getClientIp();
  const userAgent = getUserAgent();

  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);

      logger.info({
        message: "Signup validation failed",
        ip: clientIp,
        userAgent,
        errors,
      });

      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Please check your information and try again.",
          errorId: "VALIDATION_ERROR",
          details: errors,
        } as ErrorResponse,
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      logger.info({
        message: "Signup attempt with existing email",
        ip: clientIp,
        userAgent,
        email,
      });

      return NextResponse.json(
        {
          error: "Email already in use",
          message:
            "The email address is already registered. Please use a different email or sign in.",
          errorId: "EMAIL_EXISTS",
        } as ErrorResponse,
        { status: 409 }
      );
    }

    // Use stronger hashing (12 rounds)
    const hashed = await hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    logger.info({
      message: "User registered successfully",
      userId: newUser.id,
      ip: clientIp,
      userAgent,
    });

    // Return success response
    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: newUser.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Generate a unique error ID for traceability
    const errorId =
      Date.now().toString(36) + Math.random().toString(36).substring(2);

    logger.error({
      message: "Error in signup process",
      errorId,
      error: error.message,
      stack: error.stack,
      ip: clientIp,
      userAgent,
    });

    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        message:
          "We encountered a problem while processing your signup. Please try again later.",
        errorId,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
