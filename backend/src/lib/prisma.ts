import { PrismaClient, Prisma } from '@prisma/client';
import { env } from './env';
import { logger } from './logger';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Configure Prisma Client with production optimizations
const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: env.nodeEnv === 'development' 
    ? (['query', 'error', 'warn'] as Prisma.LogLevel[])
    : (['error'] as Prisma.LogLevel[]),
  errorFormat: 'pretty' as const,
};

// Use singleton pattern to prevent multiple instances in development
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(prismaClientOptions);

if (env.nodeEnv !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected on SIGINT');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  logger.info('Prisma client disconnected on SIGTERM');
  process.exit(0);
});

export default prisma;


