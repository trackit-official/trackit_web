import { PrismaClient } from "@prisma/client";

// Ensure Prisma client is a singleton globally to avoid multiple instances in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

export const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;
