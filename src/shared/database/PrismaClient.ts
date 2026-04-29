import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of Prisma Client for database operations
 * This instance is shared across the entire application
 */
let prismaInstance: PrismaClient | null = null;

/**
 * Get or create a Prisma Client instance
 * Ensures only one instance is created throughout the application lifecycle
 */
export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
    });
  }
  return prismaInstance;
}

/**
 * Disconnect the Prisma Client
 * Call this when gracefully shutting down the application
 */
export async function disconnectPrismaClient(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

// Export the singleton instance for use in other modules
export const prisma = getPrismaClient();
