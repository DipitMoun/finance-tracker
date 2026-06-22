//initialisation du client
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
//Reutilisation du client si il existe deja, pour éviter les problèmes de connexion dans le développement
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
//En dev on stock l'instance dans global
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
