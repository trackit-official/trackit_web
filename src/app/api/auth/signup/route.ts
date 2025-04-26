import { signUpSchema } from "@/validation/auth";
import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { hash } from "bcrypt";
import logger from "@/libs/logger";
import { checkRateLimit, getClientIp } from "@/libs/ratelimit";
import { headers } from "next/headers";

// Define error structure for consistent responses
interface ErrorResponse {
  error: string;
  errorId?: string;
  details?: string[];
}

export async function POST(request: Request) {
  const clientIp = getClientIp();
  const userAgent = headers().get("user-agent") || "unknown";

  try {
    // Check rate limit before processing the request
    const rateLimitResult = await checkRateLimit("signup");
    if (!rateLimitResult.success) {
      logger.warn({
        message: "Rate limit exceeded for signup",
        ip: clientIp,
        userAgent,
        remaining: rateLimitResult.limit - rateLimitResult.current,
        resetAt: new Date(rateLimitResult.reset),
      });

      return NextResponse.json(
        {
          error: "Too many signup attempts. Please try again later.",
          errorId: "RATE_LIMIT_EXCEEDED",
        } as ErrorResponse,
        {
          status: 429,
          headers: {
            "Retry-After": `${Math.ceil((rateLimitResult.reset - Date.now()) / 1000)}`,
          },
        }
      );
    }

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
        email, // We can log the email here as it already exists in our system
      });

      return NextResponse.json(
        {
          error: "Email already in use",
          errorId: "EMAIL_EXISTS",
        } as ErrorResponse,
        { status: 409 }
      );
    }

    // Use stronger hashing (increased from 10 to 12 rounds)
    const hashed = await hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        lastLoginIp: clientIp,
        userAgent: userAgent.substring(0, 255), // Limit string length for database
      },
    });

    logger.info({
      message: "User registered successfully",
      userId: newUser.id,
      ip: clientIp,
      userAgent,
    });

    // Return success response with CSRF token
    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: newUser.id,
      },
      {
        status: 201,
        headers: {
          // Using a header to help prevent CSRF attacks
          "X-CSRF-Token": require("crypto").randomBytes(64).toString("hex"),
        },
      }
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
        errorId,
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
