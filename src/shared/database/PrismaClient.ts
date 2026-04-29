import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';
import type { config as MssqlConfig } from 'mssql';

/**
 * Parses a Prisma SQL Server DSN into an mssql config object.
 * Format: sqlserver://HOST;database=Y;integratedSecurity=true;...
 */
function parsePrismaDsn(dsn: string): MssqlConfig {
  const withoutScheme = dsn.replace(/^sqlserver:\/\//, '');
  const parts = withoutScheme.split(';').filter(Boolean);
  const server = parts[0];

  const params: Record<string, string> = {};
  for (const part of parts.slice(1)) {
    const eqIndex = part.indexOf('=');
    if (eqIndex !== -1) {
      const key = part.slice(0, eqIndex).toLowerCase().trim();
      const value = part.slice(eqIndex + 1).trim();
      params[key] = value;
    }
  }

  return {
    server,
    options: {
      instanceName: params['instancename'],
      database: params['database'],
      trustedConnection: params['integratedsecurity'] === 'true',
      trustServerCertificate: params['trustservercertificate'] === 'true',
      port: params['port'] ? parseInt(params['port'], 10) : undefined,
    },
    ...(params['user'] && { user: params['user'] }),
    ...(params['password'] && { password: params['password'] }),
  };
}

let prismaInstance: PrismaClient | null = null;

export async function initializePrismaClient(): Promise<PrismaClient> {
  if (prismaInstance) return prismaInstance;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const mssqlConfig = parsePrismaDsn(connectionString);
  const adapter = new PrismaMssql(mssqlConfig);

  prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });

  return prismaInstance;
}

export function getPrismaClient(): PrismaClient {
  if (!prismaInstance) {
    throw new Error('PrismaClient not initialized. Call initializePrismaClient() first.');
  }
  return prismaInstance;
}

export async function disconnectPrismaClient(): Promise<void> {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

