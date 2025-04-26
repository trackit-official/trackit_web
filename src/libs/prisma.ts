// import { PrismaClient } from "@prisma/client";

// // Ensure Prisma client is a singleton globally to avoid multiple instances in development
// declare global {
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient;
// }

// export const prisma = global.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") global.prisma = prisma;

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
