import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/libs/prisma";
import { compare } from "bcrypt";
import { signInSchema } from "@/validation/auth";
import logger from "@/libs/logger";
import { checkRateLimit, getClientIp } from "@/libs/ratelimit";
import { headers } from "next/headers";

// Maximum failed login attempts before triggering temporary lockout
const MAX_FAILED_ATTEMPTS = 5;
// Lockout duration in milliseconds (15 minutes)
const LOCKOUT_DURATION = 15 * 60 * 1000;

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const clientIp = getClientIp();
        const userAgent = headers().get("user-agent") || "unknown";

        try {
          // Check rate limit before processing
          const rateLimitResult = await checkRateLimit("signin");
          if (!rateLimitResult.success) {
            logger.warn({
              message: "Rate limit exceeded for signin",
              ip: clientIp,
              attempts: rateLimitResult.current,
              resetAt: new Date(rateLimitResult.reset),
            });
            throw new Error("Too many login attempts. Please try again later.");
          }

          // Parse and validate credentials
          const parsed = signInSchema.safeParse(credentials || {});
          if (!parsed.success) {
            logger.info({
              message: "Login validation failed",
              ip: clientIp,
              userAgent,
              errors: parsed.error.errors.map((e) => e.message),
            });
            throw new Error(
              parsed.error.errors.map((e) => e.message).join(", ")
            );
          }

          const { email, password } = parsed.data;

          // Find user and check account status
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) {
            // Log failed attempt but don't reveal which field was incorrect
            logger.info({
              message: "Failed login attempt - user not found or no password",
              ip: clientIp,
              userAgent,
              attemptedEmail: email,
            });
            throw new Error("Invalid email or password");
          }

          // Check for account lockout
          if (
            user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS &&
            user.lastFailedLoginAt &&
            new Date().getTime() - new Date(user.lastFailedLoginAt).getTime() <
              LOCKOUT_DURATION
          ) {
            const remainingLockoutTime = Math.ceil(
              (LOCKOUT_DURATION -
                (new Date().getTime() -
                  new Date(user.lastFailedLoginAt).getTime())) /
                60000
            );

            logger.warn({
              message: "Login attempt on locked account",
              userId: user.id,
              ip: clientIp,
              userAgent,
              remainingLockoutMinutes: remainingLockoutTime,
            });

            throw new Error(
              `Account temporarily locked. Try again in ${remainingLockoutTime} minutes.`
            );
          }

          // Validate password
          const isValid = await compare(password, user.password);
          if (!isValid) {
            // Increment failed login attempts
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: (user.failedLoginAttempts || 0) + 1,
                lastFailedLoginAt: new Date(),
              },
            });

            logger.info({
              message: "Failed login attempt - invalid password",
              userId: user.id,
              ip: clientIp,
              userAgent,
              failedAttempts: (user.failedLoginAttempts || 0) + 1,
            });

            throw new Error("Invalid email or password");
          }

          // Login successful - reset failed attempts, update login data
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lastFailedLoginAt: null,
              lastLoginAt: new Date(),
              lastLoginIp: clientIp,
              userAgent: userAgent.substring(0, 255),
            },
          });

          logger.info({
            message: "User logged in successfully",
            userId: user.id,
            ip: clientIp,
            userAgent,
          });

          return { id: user.id, email: user.email, name: user.name };
        } catch (error: any) {
          logger.error({
            message: "Error in login process",
            error: error.message,
            ip: clientIp,
            userAgent,
          });
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        const userAgent = headers().get("user-agent") || "unknown";
        const clientIp = getClientIp();

        // Log successful OAuth login
        logger.info({
          message: "User logged in via Google OAuth",
          email: profile.email,
          ip: clientIp,
          userAgent,
        });

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          lastLoginIp: clientIp,
          userAgent: userAgent.substring(0, 255),
          lastLoginAt: new Date(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user ID to the JWT token if available
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token.email) {
        logger.info({
          message: "User signed out",
          email: token.email,
          userId: token.id,
        });
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
