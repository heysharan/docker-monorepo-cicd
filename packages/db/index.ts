import { PrismaClient } from "./generated/prisma/index";

export const prismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});