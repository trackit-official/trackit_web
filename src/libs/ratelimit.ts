import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

// Create a new ratelimiter that allows 5 requests per 30 seconds
export const authRateLimiter = new Ratelimit({
  redis: new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  }),
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  analytics: true,
  prefix: "ratelimit:auth",
});

// Get the client's IP address for rate limiting
// This function should be called directly in the route handler
export async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
    // Check for forwarded IP (when behind a proxy/load balancer)
    const forwarded = headersList.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0];
    }

    // Fallback to direct IP
    const ip = headersList.get("x-real-ip") || "127.0.0.1";
    return ip;
  } catch (error) {
    console.error("Error getting client IP:", error);
    return "127.0.0.1";
  }
}

// Get user agent from headers
export async function getUserAgent(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get("user-agent") || "unknown";
  } catch (error) {
    console.error("Error getting user agent:", error);
    return "unknown";
  }
}

// Helper function to check rate limit and get result
export async function checkRateLimit(identifier: string) {
  try {
    const ip = getClientIp();
    // Combine IP and identifier for more granular rate limiting
    const key = `${ip}:${identifier}`;
    return await authRateLimiter.limit(key);
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Default to allowing the request if rate limiting fails
    return { success: true, limit: 0, remaining: 0, reset: 0 };
  }
}
