import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

// Create a new ratelimiter that allows 5 requests per 30 seconds
export const authRateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  analytics: true,
  prefix: "ratelimit:auth",
});

// Get the client's IP address for rate limiting
export function getClientIp(): string {
  const headersList = headers();
  // Check for forwarded IP (when behind a proxy/load balancer)
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0];
  }

  // Fallback to direct IP
  const ip = headersList.get("x-real-ip") || "127.0.0.1";
  return ip;
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
    return { success: true };
  }
}
