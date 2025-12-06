import { PrismaClient } from "@/.prisma/client";
const singleton = global as unknown as { prisma?: PrismaClient };
const prisma = singleton.prisma ?? new PrismaClient({ log: ["query"] });

!singleton.prisma ? (singleton.prisma = prisma) : singleton.prisma;

export default prisma;
