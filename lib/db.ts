import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const newClient =
  process.env.NODE_ENV === "development"
    ? new PrismaClient({ log: ["query", "error"] })
    : new PrismaClient();

export const prisma = globalForPrisma.prisma || newClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
