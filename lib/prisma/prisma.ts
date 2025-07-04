import { PrismaClient } from '@/.prisma/client';
const singleton = global as unknown as { prisma?: PrismaClient };
const prisma = singleton.prisma ?? new PrismaClient({ log: [ 'query' ] });

if (process.env.NODE_ENV === "development") singleton.prisma = prisma;

export default prisma;